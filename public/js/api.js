const API_BASE = "/api";

export const API = {
  // Payroll API Call
  async calculateSalary(data) {
    const res = await fetch(`${API_BASE}/payroll/calculate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await res.json();
  },

  // Trigger Hiring & Email API Call
  async hireCandidate(candidateData) {
    const res = await fetch(`${API_BASE}/recruitment/hire`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(candidateData),
    });
    return await res.json();
  },
};
