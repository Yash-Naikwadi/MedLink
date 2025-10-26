import React, { useState, useEffect } from "react";
import { FileText, MessageSquare, User, ClipboardCheck } from "lucide-react";
import "./DoctorDashboard.css";
import { API_ENDPOINTS, fetchAPI } from "../config/api";
import { useNavigate } from "react-router-dom";

function DoctorDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("patients");
  const [selectedReport, setSelectedReport] = useState(null);
  const [prescription, setPrescription] = useState("");
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [doctorEmail, setDoctorEmail] = useState("");

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    setDoctorEmail(email || "Doctor");
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

  const handlePrescriptionSubmit = async (e) => {
    e.preventDefault();
    if (selectedReport && prescription.trim() !== "") {
      setLoading(true);
      setError("");

      try {
        await fetchAPI(
          API_ENDPOINTS.DOCTOR_REPORTS.ADD_PRESCRIPTION(selectedReport.reportHash),
          {
            method: "PUT",
            body: JSON.stringify({
              prescription: prescription,
            }),
          }
        );
        alert("Prescription added successfully!");
        setPrescription("");
        setSelectedReport(null);
        fetchSharedReports();
      } catch (err) {
        setError(err.message || "Failed to submit prescription");
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
        <div className="navbar-left">
          <h1>Doctor Dashboard</h1>
          <span className="doctor-email">Dr. {doctorEmail.split('@')[0]}</span>
        </div>
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
                  <th>Patient Email</th>
                  <th>Report Name</th>
                  <th>Date</th>
                  <th>Prescription Status</th>
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
                      <td>{report.userId?.email || "Patient"}</td>
                      <td>{report.fileName || "Medical Report"}</td>
                      <td>
                        {new Date(report.createdAt).toLocaleDateString()}
                      </td>
                      <td>
                        {report.prescription ? (
                          <span className="status-added">Added</span>
                        ) : (
                          <span className="status-pending">Pending</span>
                        )}
                      </td>
                      <td>
                        <button
                          className="btn-view"
                          onClick={() => {
                            setSelectedReport(report);
                            setPrescription(report.prescription || "");
                          }}
                        >
                          <ClipboardCheck size={16} />
                          {report.prescription ? " Update" : " Add Prescription"}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {selectedReport && (
            <div className="modal-bg">
              <div className="modal">
                <h3>
                  {selectedReport.prescription ? "Update" : "Add"} Prescription
                </h3>
                <p className="modal-report-info">
                  Patient: {selectedReport.userId?.email || "N/A"}<br />
                  Report: {selectedReport.fileName || "Medical Report"}
                </p>
                <form onSubmit={handlePrescriptionSubmit}>
                  <textarea
                    required
                    placeholder="Enter prescription details, diagnosis, and treatment recommendations..."
                    value={prescription}
                    onChange={(e) => setPrescription(e.target.value)}
                  ></textarea>
                  <div className="modal-buttons">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedReport(null);
                        setPrescription("");
                      }}
                      className="cancel"
                    >
                      Cancel
                    </button>
                    <button type="submit" className="share" disabled={loading}>
                      {loading
                        ? "Submitting..."
                        : selectedReport.prescription
                        ? "Update Prescription"
                        : "Add Prescription"}
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
