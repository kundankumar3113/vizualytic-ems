import { API } from "../api.js";

document.addEventListener("DOMContentLoaded", () => {
  loadEmployees();

  document
    .getElementById("btn-add-employee")
    ?.addEventListener("click", addEmployee);

  document
    .getElementById("btn-back-employees")
    ?.addEventListener("click", closeEmployeeDetails);

  window.addEventListener("popstate", handleEmployeeRoute);
});

async function loadEmployees() {
  try {
    const employees = await API.getEmployees();
    renderEmployees(employees);
    handleEmployeeRoute(employees);
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
              <th>Date joined</th>
              <th>Annual salary</th>
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
                    <button class="employee-name-button" data-employee-id="${employee.id}" type="button">
                      ${escapeHtml(employee.name)}
                    </button>
                  </td>
                  <td>${escapeHtml(employee.role)}</td>
                  <td>${escapeHtml(employee.department || "Unassigned")}</td>
                  <td>${escapeHtml(employee.date_of_joining || "Not provided")}</td>
                  <td>${formatSalary(employee.salary)}</td>
                  <td>
                    <span class="table-status">${escapeHtml(employee.status || "Active")}</span>
                  </td>
                </tr>
              `,
                    )
                    .join("")
                : `
                <tr>
                  <td colspan="6">No employees found.</td>
                </tr>
              `
            }
          </tbody>
        </table>
      </div>
    </div>
  `;

  container.querySelectorAll("[data-employee-id]").forEach((button) => {
    button.addEventListener("click", () => {
      const employee = employees.find(
        (item) => String(item.id) === button.dataset.employeeId,
      );

      if (employee) openEmployeeDetails(employee);
    });
  });
}

function formatSalary(salary) {
  if (salary === null || salary === undefined || salary === "") {
    return "Not provided";
  }

  return Number(salary).toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

function openEmployeeDetails(employee) {
  history.pushState({}, "", `#employee/${employee.id}`);
  renderEmployeeDetails(employee);
  document.getElementById("employees")?.classList.add("hidden");
  document.getElementById("employee-details")?.classList.remove("hidden");
  document
    .querySelectorAll(".nav-tab")
    .forEach((tab) => tab.classList.remove("active"));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderEmployeeDetails(employee) {
  const container = document.getElementById("employee-details-content");
  if (!container) return;

  const salary = employee.salary
    ? Number(employee.salary).toLocaleString(undefined, {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      })
    : "Not provided";

  container.innerHTML = `
    <div class="candidate-hero employee-hero">
      <div class="candidate-avatar">${escapeHtml(getInitials(employee.name))}</div>
      <div class="candidate-hero-copy">
        <p class="eyebrow">Employee profile</p>
        <h2>${escapeHtml(employee.name)}</h2>
        <p>${escapeHtml(employee.role)}${employee.department ? ` <span>in ${escapeHtml(employee.department)}</span>` : ""}</p>
      </div>
      <span class="stage-badge">${escapeHtml(employee.status || "Active")}</span>
    </div>

    <div class="employee-detail-grid">
      <article class="panel employee-summary-panel">
        <p class="eyebrow">Compensation</p>
        <h3>${salary}</h3>
        <p class="detail-muted">Annual salary</p>
      </article>
      <article class="panel employee-summary-panel">
        <p class="eyebrow">Employment</p>
        <h3>${escapeHtml(employee.date_of_joining || "Not provided")}</h3>
        <p class="detail-muted">Date of joining</p>
      </article>
    </div>

    <article class="panel employee-info-panel">
      <div class="panel-title"><h3>Employee information</h3><span>ID ${escapeHtml(employee.id)}</span></div>
      <dl class="detail-list">
        <div><dt>Full name</dt><dd>${escapeHtml(employee.name)}</dd></div>
        <div><dt>Email address</dt><dd>${escapeHtml(employee.email)}</dd></div>
        <div><dt>Role</dt><dd>${escapeHtml(employee.role)}</dd></div>
        <div><dt>Department</dt><dd>${escapeHtml(employee.department || "Not assigned")}</dd></div>
        <div><dt>Phone</dt><dd>${escapeHtml(employee.phone || "Not provided")}</dd></div>
        <div><dt>Address</dt><dd>${escapeHtml(employee.address || "Not provided")}</dd></div>
        <div><dt>Status</dt><dd>${escapeHtml(employee.status || "Active")}</dd></div>
        <div><dt>Employee ID</dt><dd>${escapeHtml(employee.id)}</dd></div>
      </dl>
    </article>
  `;
}

function handleEmployeeRoute(employees = null) {
  const match = window.location.hash.match(/^#employee\/(\d+)$/);
  if (!match) return;

  const findEmployee = employees
    ? employees.find((item) => String(item.id) === match[1])
    : null;

  if (findEmployee) openEmployeeDetails(findEmployee);
}

function closeEmployeeDetails() {
  history.pushState({}, "", "#employees");
  document.getElementById("employee-details")?.classList.add("hidden");
  document.getElementById("employees")?.classList.remove("hidden");
  document
    .querySelector('.nav-tab[data-target="employees"]')
    ?.classList.add("active");
}

function getInitials(name) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function escapeHtml(value) {
  return String(value ?? "").replace(
    /[&<>'"]/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "'": "&#39;",
        '"': "&quot;",
      })[character],
  );
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
