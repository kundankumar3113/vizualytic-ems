import { store } from "../store.js";

document.addEventListener("DOMContentLoaded", () => {
  const state = store.getState();
  const count = document.getElementById("total-employee-count");
  if (count) count.textContent = state.employees.length;
});
