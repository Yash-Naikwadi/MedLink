import React, { useState } from "react";
import "./Login.css";
import { RiFilePaper2Line } from "react-icons/ri";
import { useLocation, useNavigate } from "react-router-dom";
import { API_ENDPOINTS, fetchAPI } from "../config/api";

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isLogin = location.pathname === "/login";

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const endpoint =
        formData.role === "doctor"
          ? API_ENDPOINTS.DOCTOR_AUTH.LOGIN
          : API_ENDPOINTS.AUTH.LOGIN;

      const response = await fetchAPI(endpoint, {
        method: "POST",
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      localStorage.setItem("userRole", formData.role);
      localStorage.setItem("userEmail", formData.email);

      if (formData.role === "doctor") {
        navigate("/doctor");
      } else {
        navigate("/user");
      }
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const endpoint =
        formData.role === "doctor"
          ? API_ENDPOINTS.DOCTOR_AUTH.REGISTER
          : API_ENDPOINTS.AUTH.REGISTER;

      const response = await fetchAPI(endpoint, {
        method: "POST",
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      alert("Registration successful! Please login.");
      navigate("/login");
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="leftbox">
        <div className="circle circle1"></div>
        <div className="circle circle2"></div>

        <div className="content">
          <div className="logo-icon">
            <RiFilePaper2Line size={40} color="#fff" />
          </div>
          <h2 className="logo-text">MedLink</h2>
          <h1 className="f">Your Health, Your Data, Your </h1>
          <h1 className="s">Control.</h1>
          <p>
            Securely manage and share your health records with blockchain
            technology, ensuring privacy and ownership.
          </p>
        </div>
      </div>

      <div className="rightbox">
        <div className="auth-header">
          <h1>
            Secure <span>Access</span>
          </h1>
          <div className="tabs">
            <a
              href="#"
              className={isLogin ? "active" : ""}
              onClick={(e) => {
                e.preventDefault();
                navigate("/login");
              }}
            >
              Login
            </a>
            <a
              href="#"
              className={!isLogin ? "active" : ""}
              onClick={(e) => {
                e.preventDefault();
                navigate("/register");
              }}
            >
              Register
            </a>
          </div>
        </div>

        <div className="auth-container">
          {error && <div style={{ color: "red", marginBottom: "1rem" }}>{error}</div>}
          {isLogin ? (
            <div className="loginform">
              <h2>Welcome Back</h2>
              <form onSubmit={handleLogin}>
                <label>
                  Email
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                  />
                </label>
                <label>
                  Password
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                  />
                </label>
                <label>
                  Select Role
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                  >
                    <option value="">-- Select Role --</option>
                    <option value="doctor">Doctor</option>
                    <option value="patient">Patient</option>
                  </select>
                </label>
                <a href="#">Forget Password?</a>
                <button type="submit" disabled={loading}>
                  {loading ? "Logging in..." : "Login"}
                </button>
              </form>
              <p>
                Not a Member?{" "}
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/register");
                  }}
                >
                  Signup now
                </a>
              </p>
            </div>
          ) : (
            <div className="registerform">
              <h2>Create Account</h2>
              <form onSubmit={handleRegister}>
                <label>
                  Email
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email"
                    required
                  />
                </label>
                <label>
                  Password
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter password"
                    required
                  />
                </label>
                <label>
                  Confirm Password
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Re-enter password"
                    required
                  />
                </label>
                <label>
                  Select Role
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                  >
                    <option value="">-- Select Role --</option>
                    <option value="doctor">Doctor</option>
                    <option value="patient">Patient</option>
                  </select>
                </label>
                <button type="submit" disabled={loading}>
                  {loading ? "Creating Account..." : "Create Account"}
                </button>
                <p>
                  Already have an account?{" "}
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate("/login");
                    }}
                  >
                    Log in
                  </a>
                </p>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
