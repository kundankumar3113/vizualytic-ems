import { API } from "../api.js";

document.addEventListener("DOMContentLoaded", () => {
  renderPayroll();
  document
    .getElementById("payroll-form")
    ?.addEventListener("submit", calculatePayroll);
});

function renderPayroll() {
  const container = document.getElementById("payroll-content");
  if (!container) return;
  container.innerHTML = `<div class="directory-summary"><div class="mini-stat"><span>Next payroll</span><strong>Sep 30</strong></div><div class="mini-stat"><span>Gross payroll</span><strong>$220k</strong></div><div class="mini-stat"><span>Pending reviews</span><strong>04</strong></div></div><div class="payroll-grid"><form id="payroll-form" class="panel payroll-form"><p class="eyebrow">Salary engine</p><h3>Calculate take-home pay</h3><label>Base salary<input name="baseSalary" type="number" value="95000" min="0" /></label><label>HRA<input name="hra" type="number" value="12000" min="0" /></label><label>Allowances<input name="allowances" type="number" value="5000" min="0" /></label><button class="primary-button" type="submit">Calculate salary</button></form><div id="payroll-result" class="panel payroll-result"><p class="eyebrow">Payslip preview</p><h3>Enter salary details</h3><p class="result-muted">Your gross salary, deductions, and net take-home will appear here.</p></div></div>`;
}

async function calculatePayroll(event) {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const data = Object.fromEntries(formData.entries());
  const result = await API.calculateSalary(data);
  document.getElementById("payroll-result").innerHTML =
    `<p class="eyebrow">Payslip preview</p><h3>$${result.netTakeHome.toLocaleString(undefined, { maximumFractionDigits: 2 })} net take-home</h3><div class="result-lines"><span>Gross salary <strong>$${result.grossSalary.toLocaleString()}</strong></span><span>Tax deduction <strong>-$${result.taxDeduction.toLocaleString()}</strong></span><span>PF deduction <strong>-$${result.pfDeduction.toLocaleString()}</strong></span></div>`;
}
