import { store } from "../store.js";

document.addEventListener("DOMContentLoaded", () => {
  renderAttendance();
  store.subscribe(renderAttendance);
});

function renderAttendance() {
  const container = document.getElementById("attendance-content");
  if (!container) return;
  const clockedIn = store.getState().attendance.clockedIn;
  container.innerHTML = `
		<div class="directory-summary"><div class="mini-stat"><span>Present today</span><strong>18</strong></div><div class="mini-stat"><span>On leave</span><strong>02</strong></div><div class="mini-stat"><span>Late arrivals</span><strong>03</strong></div></div>
		<div class="attendance-grid"><div class="panel attendance-focus"><p class="eyebrow">Your shift</p><h3>${clockedIn ? "You are clocked in" : "Ready when you are"}</h3><p>${clockedIn ? "Your work session is being tracked." : "Start your day with the Clock In button above."}</p><div class="attendance-ring">${clockedIn ? "ON" : "OFF"}</div></div><div class="panel table-panel"><div class="panel-title"><h3>Today's team</h3><span>21 people</span></div><div class="attendance-row"><strong>Ananya Roy</strong><span class="table-status">Present · 09:02</span></div><div class="attendance-row"><strong>Rohan Verma</strong><span class="table-status">Present · 09:08</span></div><div class="attendance-row"><strong>Meera Shah</strong><span class="leave-status">On leave</span></div></div></div>`;
}
