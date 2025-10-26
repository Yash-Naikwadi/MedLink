import React, { useState, useEffect } from "react";
import { Upload, User, FileText, Share2, Eye, XCircle, Stethoscope } from "lucide-react";
import "./UserDashboard.css";
import { API_ENDPOINTS, fetchAPI, uploadFile } from "../config/api";
import { useNavigate } from "react-router-dom";

function UserDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [selectedFile, setSelectedFile] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showRevokeModal, setShowRevokeModal] = useState(false);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [doctorEmail, setDoctorEmail] = useState("");
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [selectedReportHash, setSelectedReportHash] = useState(null);
  const [prescription, setPrescription] = useState("");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    setUserEmail(email || "User");
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const data = await fetchAPI(API_ENDPOINTS.REPORTS.GET_ALL);
      setReports(data.reports || []);
    } catch (err) {
      console.error("Error fetching reports:", err);
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a file");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await uploadFile(API_ENDPOINTS.REPORTS.UPLOAD, formData);
      alert("Report uploaded successfully!");
      setSelectedFile(null);
      fetchReports();
    } catch (err) {
      setError(err.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async (e) => {
    e.preventDefault();
    if (!selectedReportHash) {
      setError("Please select a report to share");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await fetchAPI(API_ENDPOINTS.REPORTS.SHARE, {
        method: "POST",
        body: JSON.stringify({
          reportHash: selectedReportHash,
          doctorEmail: doctorEmail,
        }),
      });
      alert(`Document shared with ${doctorEmail}`);
      setShowShareModal(false);
      setDoctorEmail("");
      setSelectedReportHash(null);
      fetchReports();
    } catch (err) {
      setError(err.message || "Share failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRevoke = async (e) => {
    e.preventDefault();
    if (!selectedReportHash) {
      setError("Please select a report to revoke");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await fetchAPI(API_ENDPOINTS.REPORTS.REVOKE, {
        method: "POST",
        body: JSON.stringify({
          reportHash: selectedReportHash,
          doctorEmail: doctorEmail,
        }),
      });
      alert(`Access revoked for ${doctorEmail}`);
      setShowRevokeModal(false);
      setDoctorEmail("");
      setSelectedReportHash(null);
      fetchReports();
    } catch (err) {
      setError(err.message || "Share failed");
    } finally {
      setLoading(false);
    }
  };

  const handleViewPrescription = async (reportHash) => {
    setLoading(true);
    setError("");
    setPrescription("");

    try {
      const data = await fetchAPI(API_ENDPOINTS.REPORTS.GET_PRESCRIPTION(reportHash));
      if (data.prescription) {
        setPrescription(data.prescription);
        setShowPrescriptionModal(true);
      } else {
        alert("No prescription available for this report yet.");
      }
    } catch (err) {
      setError(err.message || "Failed to fetch prescription");
      alert("No prescription available or error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetchAPI(API_ENDPOINTS.AUTH.LOGOUT, { method: "POST" });
      localStorage.clear();
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
      navigate("/login");
    }
  };

  return (
    <div className="user-dashboard">
      {/* 🧭 NAVBAR */}
      <nav className="navbar">
        <h1>User Dashboard</h1>
        <div>
          <button
            onClick={() => setActiveTab("profile")}
            className={activeTab === "profile" ? "active" : ""}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab("report")}
            className={activeTab === "report" ? "active" : ""}
          >
            Report
          </button>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </nav>
      {error && <div style={{ color: "red", padding: "1rem" }}>{error}</div>}

      {/* 👤 PROFILE SECTION */}
      {activeTab === "profile" && (
        <section className="profile-section">
          <div className="profile-content">
            <div className="profile-left">
              <h2>Hello, {userEmail.split('@')[0]}!</h2>
              <p>Welcome back to your health dashboard.</p>

              <div className="profile-card">
                <p>
                  <strong>Email:</strong> {userEmail}
                </p>
                <p>
                  <strong>Role:</strong> Patient
                </p>
                <p>
                  <strong>Total Reports:</strong> {reports.length}
                </p>
                <p>
                  <strong>Shared Reports:</strong> {reports.filter(r => r.sharedWith?.length > 0).length}
                </p>
              </div>
            </div>
            <img
              src="https://via.placeholder.com/180"
              alt="user"
              className="profile-img"
            />
          </div>
        </section>
      )}

      {/* 📄 REPORT SECTION */}
      {activeTab === "report" && (
        <section className="report-section">
          <div className="report-box">
            <h2>
              <Upload size={22} /> Upload Report
            </h2>

            <input type="file" onChange={handleFileChange} />
            {selectedFile && (
              <p style={{ color: "#94a3b8", marginBottom: "1rem" }}>
                Selected file: {selectedFile.name}
              </p>
            )}

            <div className="button-row">
              <button
                className="btn btn-view"
                onClick={handleUpload}
                disabled={loading || !selectedFile}
              >
                <Upload size={18} /> {loading ? "Uploading..." : "Upload Document"}
              </button>
            </div>

            {/* 📋 PREVIOUS REPORTS */}
            <div className="report-history">
              <h3>
                <FileText size={20} /> Previous Reports
              </h3>
              <table>
                <thead>
                  <tr>
                    <th>Report Name</th>
                    <th>Date</th>
                    <th>Shared With</th>
                    <th>Prescription</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.length === 0 ? (
                    <tr>
                      <td colSpan="4" style={{ textAlign: "center" }}>
                        No reports uploaded yet
                      </td>
                    </tr>
                  ) : (
                    reports.map((report) => (
                      <tr key={report._id}>
                        <td>{report.fileName || "Medical Report"}</td>
                        <td>
                          {new Date(report.createdAt).toLocaleDateString()}
                        </td>
                        <td>
                          {report.sharedWith?.length > 0
                            ? `${report.sharedWith.length} doctor(s)`
                            : "Not shared"}
                        </td>
                        <td>
                          {report.prescription ? (
                            <button
                              className="btn btn-prescription"
                              onClick={() => handleViewPrescription(report.reportHash)}
                            >
                              <Stethoscope size={16} /> View
                            </button>
                          ) : (
                            <span style={{ color: "#94a3b8" }}>Pending</span>
                          )}
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="btn btn-share"
                              onClick={() => {
                                setSelectedReportHash(report.reportHash);
                                setShowShareModal(true);
                              }}
                            >
                              <Share2 size={16} /> Share
                            </button>
                            {report.sharedWith?.length > 0 && (
                              <button
                                className="btn btn-revoke"
                                onClick={() => {
                                  setSelectedReportHash(report.reportHash);
                                  setShowRevokeModal(true);
                                }}
                              >
                                <XCircle size={16} /> Revoke
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {showShareModal && (
        <div className="modal-bg">
          <div className="modal">
            <h3>Share Report with Doctor</h3>
            <form onSubmit={handleShare}>
              <input
                type="email"
                required
                placeholder="Enter doctor's email"
                value={doctorEmail}
                onChange={(e) => setDoctorEmail(e.target.value)}
              />
              <div className="modal-buttons">
                <button
                  type="button"
                  onClick={() => {
                    setShowShareModal(false);
                    setDoctorEmail("");
                  }}
                  className="cancel"
                >
                  Cancel
                </button>
                <button type="submit" className="share" disabled={loading}>
                  {loading ? "Sharing..." : "Share"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showRevokeModal && (
        <div className="modal-bg">
          <div className="modal">
            <h3>Revoke Access</h3>
            <form onSubmit={handleRevoke}>
              <input
                type="email"
                required
                placeholder="Enter doctor's email"
                value={doctorEmail}
                onChange={(e) => setDoctorEmail(e.target.value)}
              />
              <div className="modal-buttons">
                <button
                  type="button"
                  onClick={() => {
                    setShowRevokeModal(false);
                    setDoctorEmail("");
                  }}
                  className="cancel"
                >
                  Cancel
                </button>
                <button type="submit" className="share" disabled={loading}>
                  {loading ? "Revoking..." : "Revoke Access"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showPrescriptionModal && (
        <div className="modal-bg">
          <div className="modal prescription-modal">
            <h3>Doctor's Prescription</h3>
            <div className="prescription-content">
              <p>{prescription}</p>
            </div>
            <div className="modal-buttons">
              <button
                type="button"
                onClick={() => {
                  setShowPrescriptionModal(false);
                  setPrescription("");
                }}
                className="share"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserDashboard;
