import { store } from "../store.js";

document.addEventListener("DOMContentLoaded", () => {
  renderEmployees();
  document
    .getElementById("btn-add-employee")
    ?.addEventListener("click", addEmployee);
});

function renderEmployees() {
  const container = document.getElementById("employees-content");
  if (!container) return;
  const employees = store.getState().employees;
  container.innerHTML = `
		<div class="directory-summary"><div class="mini-stat"><span>Active people</span><strong>${employees.length}</strong></div><div class="mini-stat"><span>Departments</span><strong>${new Set(employees.map((employee) => employee.dept)).size}</strong></div><div class="mini-stat"><span>Payroll total</span><strong>$${employees.reduce((total, employee) => total + employee.salary, 0).toLocaleString()}</strong></div></div>
		<div class="panel table-panel"><div class="panel-title"><h3>People directory</h3><span>${employees.length} records</span></div><div class="table-wrap"><table><thead><tr><th>Employee</th><th>Role</th><th>Department</th><th>Salary</th><th>Status</th></tr></thead><tbody>${employees.map((employee) => `<tr><td><strong>${employee.name}</strong><small>${employee.id}</small></td><td>${employee.role}</td><td>${employee.dept}</td><td>$${employee.salary.toLocaleString()}</td><td><span class="table-status">${employee.status}</span></td></tr>`).join("")}</tbody></table></div></div>`;
}

function addEmployee() {
  const name = window.prompt("Employee name");
  if (!name?.trim()) return;
  store.addEmployee({
    id: `VDS-${1001 + store.getState().employees.length}`,
    name: name.trim(),
    role: "New team member",
    dept: "Unassigned",
    salary: 0,
    status: "Active",
  });
  renderEmployees();
}
