const API_BASE = "/api";

export const API = {
  async calculateSalary(data) {
    const res = await fetch(`${API_BASE}/payroll/calculate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    return await res.json();
  },

  async hireCandidate(candidateData) {
    const res = await fetch(`${API_BASE}/recruitment/hire`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(candidateData),
    });

    return await res.json();
  },

  async getEmployees() {
    const res = await fetch(`${API_BASE}/employees`);

    if (!res.ok) {
      throw new Error("Unable to load employees");
    }

    return await res.json();
  },

  async createEmployee(data) {
    const res = await fetch(`${API_BASE}/employees`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Unable to create employee");
    }

    return await res.json();
  },

  async getAttendance() {
    const res = await fetch(`${API_BASE}/attendance`);

    if (!res.ok) {
      throw new Error("Unable to load attendance");
    }

    return await res.json();
  },

  async createAttendance(data) {
    const res = await fetch(`${API_BASE}/attendance`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Unable to save attendance");
    }

    return await res.json();
  },

  async getCandidates() {
    const res = await fetch(`${API_BASE}/recruitment`);

    if (!res.ok) {
      throw new Error("Unable to load candidates");
    }

    return await res.json();
  },

  async createCandidate(data) {
    const res = await fetch(`${API_BASE}/recruitment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Unable to create candidate");
    }

    return await res.json();
  },

  async updateCandidateStage(candidateId, stage) {
    const res = await fetch(`${API_BASE}/recruitment/${candidateId}/stage`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stage }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Unable to update candidate stage");
    }

    return await res.json();
  },
};
