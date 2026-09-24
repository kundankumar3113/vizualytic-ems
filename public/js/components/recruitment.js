import { API } from "../api.js";

const stages = ["Screening", "Interview", "Offer", "Hired"];

document.addEventListener("DOMContentLoaded", () => {
  loadCandidates();

  document
    .getElementById("btn-add-candidate")
    ?.addEventListener("click", openCandidateCreate);

  document
    .getElementById("btn-back-create-candidate")
    ?.addEventListener("click", closeCandidateCreate);

  document
    .getElementById("btn-cancel-candidate")
    ?.addEventListener("click", closeCandidateCreate);

  document
    .getElementById("candidate-form")
    ?.addEventListener("submit", saveCandidate);

  document
    .getElementById("btn-back-recruitment")
    ?.addEventListener("click", closeCandidateDetails);

  window.addEventListener("popstate", handleCandidateRoute);
  handleCandidateRoute();
});

async function loadCandidates() {
  try {
    const candidates = await API.getCandidates();
    renderRecruitment(candidates);
    handleCandidateRoute();
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

  board.querySelectorAll("[data-candidate-id]").forEach((card) => {
    card.addEventListener("click", (event) => {
      if (event.target.closest("button")) return;

      openCandidateDetails(card.dataset.candidateId, candidates);
    });

    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openCandidateDetails(card.dataset.candidateId, candidates);
      }
    });
  });

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
    <article class="candidate-card" data-candidate-id="${escapeHtml(candidate.id)}" tabindex="0" role="button" aria-label="View ${escapeHtml(candidate.name)} details">
      <div class="candidate-card-header">
        <span class="candidate-id">${escapeHtml(candidate.id)}</span>
        <span class="view-profile">View profile <span aria-hidden="true">&#8594;</span></span>
      </div>
      <h4>${escapeHtml(candidate.name)}</h4>
      <p>${escapeHtml(candidate.role)}</p>
      <small>${escapeHtml(candidate.email)}</small>

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

function openCandidateDetails(candidateId, candidates) {
  const candidate = candidates.find((item) => item.id === candidateId);
  if (!candidate) return;

  history.pushState(
    { candidateId },
    "",
    `#candidate/${encodeURIComponent(candidateId)}`,
  );
  renderCandidateDetails(candidate);
  document.getElementById("recruitment")?.classList.add("hidden");
  document.getElementById("candidate-details")?.classList.remove("hidden");
  document
    .querySelectorAll(".nav-tab")
    .forEach((tab) => tab.classList.remove("active"));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderCandidateDetails(candidate) {
  const container = document.getElementById("candidate-details-content");
  if (!container) return;

  const stageIndex = stages.indexOf(candidate.stage);
  const progress =
    stageIndex >= 0 ? ((stageIndex + 1) / stages.length) * 100 : 0;

  container.innerHTML = `
    <div class="candidate-hero">
      <div class="candidate-avatar">${escapeHtml(getInitials(candidate.name))}</div>
      <div class="candidate-hero-copy">
        <p class="eyebrow">Candidate profile</p>
        <h2>${escapeHtml(candidate.name)}</h2>
        <p>${escapeHtml(candidate.role)}${candidate.department ? ` <span>in ${escapeHtml(candidate.department)}</span>` : ""}</p>
      </div>
      <span class="stage-badge">${escapeHtml(candidate.stage)}</span>
    </div>

    <div class="candidate-detail-grid">
      <article class="panel candidate-info-panel">
        <div class="panel-title"><h3>Candidate details</h3><span>${escapeHtml(candidate.id)}</span></div>
        <dl class="detail-list">
          <div><dt>Email address</dt><dd>${escapeHtml(candidate.email)}</dd></div>
          <div><dt>Role</dt><dd>${escapeHtml(candidate.role)}</dd></div>
          <div><dt>Department</dt><dd>${escapeHtml(candidate.department || "Not assigned")}</dd></div>
          <div><dt>Candidate ID</dt><dd>${escapeHtml(candidate.id)}</dd></div>
        </dl>
      </article>

      <article class="panel candidate-progress-panel">
        <p class="eyebrow">Hiring progress</p>
        <h3>${escapeHtml(candidate.stage)} stage</h3>
        <p class="detail-muted">This candidate is currently in the ${escapeHtml(candidate.stage.toLowerCase())} stage of your hiring pipeline.</p>
        <div class="progress-track"><span style="width: ${progress}%"></span></div>
        <div class="stage-track">${stages.map((stage, index) => `<span class="${index <= stageIndex ? "complete" : ""}">${escapeHtml(stage)}</span>`).join("")}</div>
        ${stageIndex < stages.length - 1 ? `<button class="primary-button detail-action" data-detail-next-stage="${escapeHtml(stages[stageIndex + 1])}" data-detail-id="${escapeHtml(candidate.id)}">Move to ${escapeHtml(stages[stageIndex + 1])}</button>` : `<button class="primary-button detail-action" data-detail-onboard="${escapeHtml(candidate.id)}">Onboard candidate</button>`}
      </article>
    </div>

    <article class="panel candidate-next-panel">
      <div><p class="eyebrow">Next step</p><h3>${stageIndex < stages.length - 1 ? `Review and move to ${escapeHtml(stages[stageIndex + 1])}` : "Ready for onboarding"}</h3></div>
      <p>Keep the candidate record current as they move through the hiring process.</p>
    </article>
  `;

  container
    .querySelector("[data-detail-next-stage]")
    ?.addEventListener("click", async (event) => {
      await moveCandidate(
        event.currentTarget.dataset.detailId,
        event.currentTarget.dataset.detailNextStage,
      );
    });

  container
    .querySelector("[data-detail-onboard]")
    ?.addEventListener("click", async (event) => {
      await onboardCandidate(event.currentTarget.dataset.detailOnboard);
    });
}

function handleCandidateRoute() {
  if (window.location.hash === "#candidate/new") {
    showCandidateCreate();
    return;
  }

  const match = window.location.hash.match(/^#candidate\/(.+)$/);
  if (!match) return;

  const board = document.getElementById("recruitment-board");
  if (!board) return;

  const card = board.querySelector(
    `[data-candidate-id="${CSS.escape(decodeURIComponent(match[1]))}"]`,
  );
  card?.click();
}

function openCandidateCreate() {
  history.pushState({}, "", "#candidate/new");
  showCandidateCreate();
}

function showCandidateCreate() {
  document.getElementById("recruitment")?.classList.add("hidden");
  document.getElementById("candidate-details")?.classList.add("hidden");
  document.getElementById("candidate-create")?.classList.remove("hidden");
  document
    .querySelectorAll(".nav-tab")
    .forEach((tab) => tab.classList.remove("active"));
  document.getElementById("candidate-form")?.reset();
  document.getElementById("candidate-form-error").textContent = "";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function closeCandidateCreate() {
  history.pushState({}, "", "#recruitment");
  document.getElementById("candidate-create")?.classList.add("hidden");
  document.getElementById("recruitment")?.classList.remove("hidden");
  document
    .querySelector('.nav-tab[data-target="recruitment"]')
    ?.classList.add("active");
}

function closeCandidateDetails() {
  history.pushState({}, "", "#recruitment");
  document.getElementById("candidate-details")?.classList.add("hidden");
  document.getElementById("recruitment")?.classList.remove("hidden");
  document
    .querySelector('.nav-tab[data-target="recruitment"]')
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

async function moveCandidate(candidateId, nextStage) {
  try {
    await API.updateCandidateStage(candidateId, nextStage);
    await loadCandidates();
    closeCandidateDetails();
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

async function saveCandidate(event) {
  event.preventDefault();

  const form = event.currentTarget;
  const formData = new FormData(form);
  const candidateData = Object.fromEntries(formData.entries());
  const errorElement = document.getElementById("candidate-form-error");
  errorElement.textContent = "";

  try {
    await API.createCandidate(candidateData);
    closeCandidateCreate();
    await loadCandidates();
  } catch (error) {
    console.error(error);
    errorElement.textContent = error.message;
  }
}
