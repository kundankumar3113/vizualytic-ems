import { store } from "./store.js";
import { API } from "./api.js";

document.addEventListener("DOMContentLoaded", () => {
  console.log("Vizualytic Data Solution EMS initialized.");

  // UI Navigation Tabs
  const navTabs = document.querySelectorAll(".nav-tab");
  navTabs.forEach((tab) => {
    tab.addEventListener("click", (e) => {
      const targetSection = e.currentTarget.dataset.target;
      showSection(targetSection);
    });
  });

  // Clock In/Out Event Handler
  const clockBtn = document.getElementById("btn-clock-toggle");
  if (clockBtn) {
    clockBtn.addEventListener("click", async () => {
      const isClockingIn = !store.getState().attendance.clockedIn;

      if (!isClockingIn) {
        store.toggleClock();
        return;
      }

      try {
        const now = new Date();

        await API.createAttendance({
          employee_id: 1,
          attendance_date: now.toISOString().slice(0, 10),
          status: "Present",
          check_in: now.toTimeString().slice(0, 5),
        });

        store.toggleClock();
        alert("Clocked in successfully");
      } catch (error) {
        console.error(error);
        alert(error.message);
      }
    });
  }

  // Subscribe UI Updates to State Changes
  store.subscribe((state) => {
    updateClockUI(state.attendance);
    renderEmployeeCount(state.employees.length);
  });
});

function showSection(sectionId) {
  document
    .querySelectorAll("main > section")
    .forEach((sec) => sec.classList.add("hidden"));
  const activeSection = document.getElementById(sectionId);
  if (activeSection) activeSection.classList.remove("hidden");
  document.querySelectorAll(".nav-tab").forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.target === sectionId);
  });
}

function updateClockUI(attendance) {
  const clockBtn = document.getElementById("btn-clock-toggle");
  if (!clockBtn) return;
  if (attendance.clockedIn) {
    clockBtn.textContent = "Clock Out";
    clockBtn.className =
      "px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700";
  } else {
    clockBtn.textContent = "Clock In";
    clockBtn.className =
      "px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700";
  }
}

function renderEmployeeCount(count) {
  const el = document.getElementById("total-employee-count");
  if (el) el.textContent = count;
}
