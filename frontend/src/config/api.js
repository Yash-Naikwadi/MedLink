const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4939';

export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: `${API_BASE_URL}/api/auth/register`,
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    LOGOUT: `${API_BASE_URL}/api/auth/logout`,
  },
  DOCTOR_AUTH: {
    REGISTER: `${API_BASE_URL}/api/doctor/auth/register`,
    LOGIN: `${API_BASE_URL}/api/doctor/auth/login`,
    LOGOUT: `${API_BASE_URL}/api/doctor/auth/logout`,
  },
  REPORTS: {
    UPLOAD: `${API_BASE_URL}/api/report/upload`,
    GET_ALL: `${API_BASE_URL}/api/report/myreports`,
    GET_BY_ID: (id) => `${API_BASE_URL}/api/report/${id}`,
    SHARE: `${API_BASE_URL}/api/report/share`,
  },
  DOCTOR_REPORTS: {
    GET_SHARED: `${API_BASE_URL}/api/doctor/reports/shared`,
    ADD_FEEDBACK: `${API_BASE_URL}/api/doctor/reports/feedback`,
  },
};

export const fetchAPI = async (url, options = {}) => {
  const defaultOptions = {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  const response = await fetch(url, { ...defaultOptions, ...options });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || 'Request failed');
  }

  return response.json();
};

export const uploadFile = async (url, formData) => {
  const response = await fetch(url, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Upload failed' }));
    throw new Error(error.message || 'Upload failed');
  }

  return response.json();
};
