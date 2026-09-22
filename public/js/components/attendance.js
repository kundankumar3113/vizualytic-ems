import { API } from "../api.js";

document.addEventListener("DOMContentLoaded", () => {
  loadAttendance();
});

async function loadAttendance() {
  try {
    const attendance = await API.getAttendance();
    renderAttendance(attendance);
  } catch (error) {
    console.error(error);
    document.getElementById("attendance-content").innerHTML =
      "<p>Unable to load attendance.</p>";
  }
}

function renderAttendance(attendance) {
  const container = document.getElementById("attendance-content");
  if (!container) return;

  const present = attendance.filter(
    (record) => record.status === "Present",
  ).length;
  const onLeave = attendance.filter(
    (record) => record.status === "On leave",
  ).length;
  const late = attendance.filter((record) => record.status === "Late").length;

  container.innerHTML = `
    <div class="directory-summary">
      <div class="mini-stat"><span>Present today</span><strong>${present}</strong></div>
      <div class="mini-stat"><span>On leave</span><strong>${onLeave}</strong></div>
      <div class="mini-stat"><span>Late arrivals</span><strong>${late}</strong></div>
    </div>
    <div class="panel table-panel">
      <div class="panel-title"><h3>Attendance records</h3><span>${attendance.length} records</span></div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Date</th><th>Employee ID</th><th>Status</th><th>Check in</th><th>Check out</th></tr></thead>
          <tbody>
            ${
              attendance.length
                ? attendance
                    .map(
                      (record) => `
                <tr>
                  <td>${record.attendance_date}</td>
                  <td>${record.employee_id || "Not assigned"}</td>
                  <td>${record.status}</td>
                  <td>${record.check_in || "-"}</td>
                  <td>${record.check_out || "-"}</td>
                </tr>
              `,
                    )
                    .join("")
                : '<tr><td colspan="5">No attendance records found.</td></tr>'
            }
          </tbody>
        </table>
      </div>
    </div>`;
}
