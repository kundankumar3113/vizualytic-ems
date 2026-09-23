const API_BASE = "/api";

async function apiRequest(path, options = {}) {
  const token = localStorage.getItem("auth_token");

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Request failed");
  }

  return data;
}

export const API = {
  async register(data) {
    return apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async login(data) {
    return apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async getEmployees() {
    return apiRequest("/employees");
  },

  async createEmployee(data) {
    return apiRequest("/employees", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async getAttendance() {
    return apiRequest("/attendance");
  },

  async createAttendance(data) {
    return apiRequest("/attendance", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async clockOut(data) {
    return apiRequest("/attendance/clock-out", {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  async calculateSalary(data) {
    return apiRequest("/payroll/calculate", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async getCandidates() {
    return apiRequest("/recruitment");
  },

  async createCandidate(data) {
    return apiRequest("/recruitment", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async updateCandidateStage(candidateId, stage) {
    return apiRequest(`/recruitment/${candidateId}/stage`, {
      method: "PATCH",
      body: JSON.stringify({ stage }),
    });
  },

  async hireCandidate(candidateData) {
    return apiRequest("/recruitment/hire", {
      method: "POST",
      body: JSON.stringify(candidateData),
    });
  },
};
