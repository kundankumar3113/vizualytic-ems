import { API } from "../api.js";

document.addEventListener("DOMContentLoaded", () => {
  loadEmployees();

  document
    .getElementById("btn-add-employee")
    ?.addEventListener("click", addEmployee);
});

async function loadEmployees() {
  try {
    const employees = await API.getEmployees();
    renderEmployees(employees);
  } catch (error) {
    console.error(error);
    document.getElementById("employees-content").innerHTML =
      "<p>Unable to load employees.</p>";
  }
}

function renderEmployees(employees) {
  const container = document.getElementById("employees-content");
  if (!container) return;

  const departments = new Set(
    employees.map((employee) => employee.department).filter(Boolean),
  );

  container.innerHTML = `
    <div class="directory-summary">
      <div class="mini-stat">
        <span>Active people</span>
        <strong>${employees.length}</strong>
      </div>
      <div class="mini-stat">
        <span>Departments</span>
        <strong>${departments.size}</strong>
      </div>
      <div class="mini-stat">
        <span>Payroll total</span>
        <strong>Not available</strong>
      </div>
    </div>

    <div class="panel table-panel">
      <div class="panel-title">
        <h3>People directory</h3>
        <span>${employees.length} records</span>
      </div>

      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Employee</th>
              <th>Role</th>
              <th>Department</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${
              employees.length
                ? employees
                    .map(
                      (employee) => `
                <tr>
                  <td>
                    <strong>${employee.name}</strong>
                    <small>${employee.id}</small>
                  </td>
                  <td>${employee.role}</td>
                  <td>${employee.department || "Unassigned"}</td>
                  <td>
                    <span class="table-status">${employee.status}</span>
                  </td>
                </tr>
              `,
                    )
                    .join("")
                : `
                <tr>
                  <td colspan="4">No employees found.</td>
                </tr>
              `
            }
          </tbody>
        </table>
      </div>
    </div>
  `;
}

async function addEmployee() {
  const name = window.prompt("Employee name");
  if (!name?.trim()) return;

  const email = window.prompt("Employee email");
  if (!email?.trim()) return;

  const role = window.prompt("Employee role");
  if (!role?.trim()) return;

  const department = window.prompt("Employee department") || "";

  try {
    await API.createEmployee({
      name: name.trim(),
      email: email.trim(),
      role: role.trim(),
      department: department.trim(),
    });

    await loadEmployees();
  } catch (error) {
    alert(error.message);
  }
}
