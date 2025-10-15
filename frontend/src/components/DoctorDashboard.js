import React, { useState, useEffect } from "react";
import { FileText, MessageSquare, User, ClipboardCheck } from "lucide-react";
import "./DoctorDashboard.css";
import { API_ENDPOINTS, fetchAPI } from "../config/api";
import { useNavigate } from "react-router-dom";

function DoctorDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("patients");
  const [selectedReport, setSelectedReport] = useState(null);
  const [diagnosis, setDiagnosis] = useState("");
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSharedReports();
  }, []);

  const fetchSharedReports = async () => {
    try {
      const data = await fetchAPI(API_ENDPOINTS.DOCTOR_REPORTS.GET_SHARED);
      setReports(data.reports || []);
    } catch (err) {
      console.error("Error fetching reports:", err);
    }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (selectedReport && diagnosis.trim() !== "") {
      setLoading(true);
      setError("");

      try {
        await fetchAPI(API_ENDPOINTS.DOCTOR_REPORTS.ADD_FEEDBACK, {
          method: "POST",
          body: JSON.stringify({
            reportId: selectedReport._id,
            feedback: diagnosis,
          }),
        });
        alert("Diagnosis/Feedback submitted successfully!");
        setDiagnosis("");
        setSelectedReport(null);
        fetchSharedReports();
      } catch (err) {
        setError(err.message || "Failed to submit feedback");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await fetchAPI(API_ENDPOINTS.DOCTOR_AUTH.LOGOUT, { method: "POST" });
      localStorage.clear();
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
      navigate("/login");
    }
  };

  return (
    <div className="doctor-dashboard">
      {/* 🧭 NAVBAR */}
      <nav className="navbar">
        <h1>Doctor Dashboard</h1>
        <div>
          <button
            onClick={() => setActiveTab("patients")}
            className={activeTab === "patients" ? "active" : ""}
          >
            Patients
          </button>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </nav>
      {error && <div style={{ color: "red", padding: "1rem" }}>{error}</div>}

      {/* 👨‍⚕️ PATIENT REPORTS */}
      {activeTab === "patients" && (
        <section className="patients-section">
          <div className="patients-box">
            <h2>
              <FileText size={22} /> Shared Patient Reports
            </h2>
            <table>
              <thead>
                <tr>
                  <th>Patient Name</th>
                  <th>Report Name</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {reports.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center" }}>
                      No reports shared with you yet
                    </td>
                  </tr>
                ) : (
                  reports.map((report, index) => (
                    <tr key={index}>
                      <td>{report.userId?.email || "N/A"}</td>
                      <td>{report.fileName || "Report"}</td>
                      <td>
                        {new Date(report.createdAt).toLocaleDateString()}
                      </td>
                      <td>{report.feedback ? "Reviewed" : "New"}</td>
                      <td>
                        <button
                          className="btn-view"
                          onClick={() => setSelectedReport(report)}
                        >
                          <MessageSquare size={16} /> Review
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* 🩺 FEEDBACK MODAL */}
          {selectedReport && (
            <div className="modal-bg">
              <div className="modal">
                <h3>
                  Review Report - {selectedReport.fileName || "Report"}
                </h3>
                <form onSubmit={handleFeedbackSubmit}>
                  <textarea
                    required
                    placeholder="Enter diagnosis or feedback..."
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                  ></textarea>
                  <div className="modal-buttons">
                    <button
                      type="button"
                      onClick={() => setSelectedReport(null)}
                      className="cancel"
                    >
                      Cancel
                    </button>
                    <button type="submit" className="share" disabled={loading}>
                      {loading ? "Submitting..." : "Submit Feedback"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

export default DoctorDashboard;
