import React, { useState, useEffect } from "react";
import { Upload, User, FileText, Share2, Eye } from "lucide-react";
import "./UserDashboard.css";
import { API_ENDPOINTS, fetchAPI, uploadFile } from "../config/api";
import { useNavigate } from "react-router-dom";

function UserDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [selectedFile, setSelectedFile] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [doctorEmail, setDoctorEmail] = useState("");
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedReportId, setSelectedReportId] = useState(null);

  useEffect(() => {
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
      formData.append("report", selectedFile);

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
    if (!selectedReportId) {
      setError("Please select a report to share");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await fetchAPI(API_ENDPOINTS.REPORTS.SHARE, {
        method: "POST",
        body: JSON.stringify({
          reportId: selectedReportId,
          doctorEmail: doctorEmail,
        }),
      });
      alert(`Document shared with ${doctorEmail}`);
      setShowShareModal(false);
      setDoctorEmail("");
      fetchReports();
    } catch (err) {
      setError(err.message || "Share failed");
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
              <h2>Hello, John!</h2>
              <p>Welcome back to your health dashboard.</p>

              <div className="profile-card">
                <p>
                  <strong>Disease:</strong> Diabetes Type II
                </p>
                <p>
                  <strong>Next Test Date:</strong> 25 Oct 2025
                </p>
                <p>
                  <strong>Progress:</strong> Improving (80%)
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
                    <th>Status</th>
                    <th>Action</th>
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
                        <td>{report.fileName || "Report"}</td>
                        <td>
                          {new Date(report.createdAt).toLocaleDateString()}
                        </td>
                        <td>{report.sharedWith?.length > 0 ? "Shared" : "Uploaded"}</td>
                        <td>
                          <button
                            className="btn btn-share"
                            onClick={() => {
                              setSelectedReportId(report._id);
                              setShowShareModal(true);
                            }}
                          >
                            <Share2 size={16} /> Share
                          </button>
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

      {/* 🪟 SHARE MODAL */}
      {showShareModal && (
        <div className="modal-bg">
          <div className="modal">
            <h3>Share Report</h3>
            <form onSubmit={handleShare}>
              <input
                type="email"
                required
                placeholder="Doctor's Email"
                value={doctorEmail}
                onChange={(e) => setDoctorEmail(e.target.value)}
              />
              <div className="modal-buttons">
                <button
                  type="button"
                  onClick={() => setShowShareModal(false)}
                  className="cancel"
                >
                  Cancel
                </button>
                <button type="submit" className="share">
                  Share
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserDashboard;
