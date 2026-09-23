import { store } from "./store.js";
import { API } from "./api.js";

document.addEventListener("DOMContentLoaded", () => {
  const user = store.getState().user;
  const token = localStorage.getItem("auth_token");

  if (!user || !token) {
    showAuthScreen();
    setupAuthForms();
    return;
  }

  showApplication(user);
  setupApplication();
});

function showAuthScreen() {
  document.getElementById("auth-screen")?.classList.remove("hidden");
  document.getElementById("app-shell")?.classList.add("hidden");
}

function showApplication(user) {
  document.getElementById("auth-screen")?.classList.add("hidden");
  document.getElementById("app-shell")?.classList.remove("hidden");

  const heading = document.querySelector(".topbar h2");

  if (heading) {
    heading.textContent = `Good morning, ${user.name}`;
  }
}

function setupAuthForms() {
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");
  const authToggle = document.getElementById("auth-toggle");
  const authTitle = document.getElementById("auth-title");

  authToggle?.addEventListener("click", () => {
    const isRegistering = registerForm.classList.toggle("hidden");

    loginForm.classList.toggle("hidden", isRegistering);

    authTitle.textContent = isRegistering ? "Create account" : "Login";

    authToggle.textContent = isRegistering
      ? "Already have an account?"
      : "Create an account";
  });

  loginForm?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(loginForm);
    const loginData = Object.fromEntries(formData.entries());
    const errorElement = document.getElementById("login-error");

    errorElement.textContent = "";

    try {
      const result = await API.login(loginData);

      localStorage.setItem("auth_token", result.token);
      store.setUser(result.user);

      window.location.reload();
    } catch (error) {
      errorElement.textContent = error.message;
    }
  });

  registerForm?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(registerForm);
    const registerData = Object.fromEntries(formData.entries());
    const errorElement = document.getElementById("register-error");

    errorElement.textContent = "";

    try {
      const result = await API.register(registerData);

      localStorage.setItem("auth_token", result.token);
      store.setUser(result.user);

      window.location.reload();
    } catch (error) {
      errorElement.textContent = error.message;
    }
  });
}

function setupApplication() {
  setupNavigation();
  setupClockButton();
  setupLogout();

  store.subscribe((state) => {
    updateClockUI(state.attendance);
    renderEmployeeCount(state.employees.length);
  });
}

function setupNavigation() {
  const navTabs = document.querySelectorAll(".nav-tab");

  navTabs.forEach((tab) => {
    tab.addEventListener("click", (event) => {
      const targetSection = event.currentTarget.dataset.target;

      if (targetSection) {
        showSection(targetSection);
      }
    });
  });
}

function setupClockButton() {
  const clockButton = document.getElementById("btn-clock-toggle");

  if (!clockButton) return;

  clockButton.addEventListener("click", async () => {
    const isClockingIn = !store.getState().attendance.clockedIn;
    const now = new Date();

    try {
      if (isClockingIn) {
        await API.createAttendance({
          employee_id: 1,
          attendance_date: now.toISOString().slice(0, 10),
          status: "Present",
          check_in: now.toTimeString().slice(0, 5),
        });

        store.toggleClock();
        window.dispatchEvent(new Event("attendance-updated"));

        alert("Clocked in successfully");
        return;
      }

      await API.clockOut({
        employee_id: 1,
        attendance_date: now.toISOString().slice(0, 10),
        check_out: now.toTimeString().slice(0, 5),
      });

      store.toggleClock();
      window.dispatchEvent(new Event("attendance-updated"));

      alert("Clocked out successfully");
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  });
}

function setupLogout() {
  const logoutButton = document.getElementById("btn-logout");

  logoutButton?.addEventListener("click", () => {
    store.logout();
    window.location.reload();
  });
}

function showSection(sectionId) {
  document.querySelectorAll("main > section").forEach((section) => {
    section.classList.add("hidden");
  });

  const activeSection = document.getElementById(sectionId);

  if (activeSection) {
    activeSection.classList.remove("hidden");
  }

  document.querySelectorAll(".nav-tab").forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.target === sectionId);
  });
}

function updateClockUI(attendance) {
  const clockButton = document.getElementById("btn-clock-toggle");

  if (!clockButton) return;

  if (attendance.clockedIn) {
    clockButton.textContent = "Clock Out";
    clockButton.className = "clock-button clock-out-button";
  } else {
    clockButton.textContent = "Clock In";
    clockButton.className = "clock-button";
  }
}

function renderEmployeeCount(count) {
  const employeeCount = document.getElementById("total-employee-count");

  if (employeeCount) {
    employeeCount.textContent = count;
  }
}
