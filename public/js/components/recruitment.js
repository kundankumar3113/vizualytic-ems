import { API } from "../api.js";

const stages = ["Screening", "Interview", "Offer", "Hired"];

document.addEventListener("DOMContentLoaded", () => {
  loadCandidates();

  document
    .getElementById("btn-add-candidate")
    ?.addEventListener("click", addCandidate);
});

async function loadCandidates() {
  try {
    const candidates = await API.getCandidates();
    renderRecruitment(candidates);
  } catch (error) {
    console.error(error);

    const board = document.getElementById("recruitment-board");
    if (board) {
      board.innerHTML = "<p>Unable to load candidates.</p>";
    }
  }
}

function renderRecruitment(candidates) {
  const board = document.getElementById("recruitment-board");
  if (!board) return;

  board.innerHTML = stages
    .map((stage) => {
      const stageCandidates = candidates.filter(
        (candidate) => candidate.stage === stage,
      );

      return `
        <div class="pipeline-column">
          <div class="pipeline-heading">
            <h4>${stage}</h4>
            <span>${stageCandidates.length}</span>
          </div>

          <div class="candidate-list">
            ${
              stageCandidates.length
                ? stageCandidates.map(candidateCard).join("")
                : '<p class="pipeline-empty">No candidates</p>'
            }
          </div>
        </div>
      `;
    })
    .join("");

  board.querySelectorAll("[data-next-stage]").forEach((button) => {
    button.addEventListener("click", () => {
      moveCandidate(button.dataset.id, button.dataset.nextStage);
    });
  });

  board.querySelectorAll("[data-onboard]").forEach((button) => {
    button.addEventListener("click", () => {
      onboardCandidate(button.dataset.id);
    });
  });
}

function candidateCard(candidate) {
  const stageIndex = stages.indexOf(candidate.stage);
  const nextStage = stages[stageIndex + 1];

  return `
    <article class="candidate-card">
      <span class="candidate-id">${candidate.id}</span>
      <h4>${candidate.name}</h4>
      <p>${candidate.role}</p>
      <small>${candidate.email}</small>

      ${
        nextStage
          ? `
            <button
              class="candidate-action"
              data-next-stage="${nextStage}"
              data-id="${candidate.id}">
              Move to ${nextStage}
            </button>
          `
          : `
            <button
              class="candidate-action"
              data-onboard
              data-id="${candidate.id}">
              Onboard candidate
            </button>
          `
      }
    </article>
  `;
}

async function moveCandidate(candidateId, nextStage) {
  try {
    await API.updateCandidateStage(candidateId, nextStage);
    await loadCandidates();
  } catch (error) {
    console.error(error);
    alert(error.message);
  }
}

async function onboardCandidate(candidateId) {
  const candidates = await API.getCandidates();
  const candidate = candidates.find((item) => item.id === candidateId);

  if (!candidate) {
    alert("Candidate not found");
    return;
  }

  const confirmed = window.confirm(
    `Send onboarding email to ${candidate.name}?`,
  );

  if (!confirmed) return;

  try {
    const result = await API.hireCandidate({
      candidateId: candidate.id,
      name: candidate.name,
      email: candidate.email,
      role: candidate.role,
      department: candidate.department,
    });

    if (!result.success) {
      throw new Error(result.error || "Unable to onboard candidate");
    }

    alert("Onboarding email sent successfully");
    await loadCandidates();
  } catch (error) {
    console.error(error);
    alert(error.message);
  }
}

async function addCandidate() {
  const name = window.prompt("Candidate name");
  if (!name?.trim()) return;

  const role = window.prompt("Role");
  if (!role?.trim()) return;

  const email = window.prompt("Email");
  if (!email?.trim()) return;

  const department = window.prompt("Department") || "";

  try {
    await API.createCandidate({
      name: name.trim(),
      role: role.trim(),
      email: email.trim(),
      department: department.trim(),
      stage: "Screening",
    });

    await loadCandidates();
  } catch (error) {
    console.error(error);
    alert(error.message);
  }
}
