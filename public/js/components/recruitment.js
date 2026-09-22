const stages = ["Screening", "Interview", "Offer", "Hired"];

let candidates = [
  {
    id: "C-101",
    name: "kundan kuamr",
    role: "Data Engineer",
    email: "kundan@example.com",
    stage: "Screening",
  },
  {
    id: "C-102",
    name: "nitsh",
    role: "Frontend Developer",
    email: "nitish@example.com",
    stage: "Hired",
  },
  {
    id: "C-103",
    name: "hemant",
    role: "Product Analyst",
    email: "hemant@example.com",
    stage: "Interview",
  },
];

document.addEventListener("DOMContentLoaded", () => {
  renderRecruitment();
  document
    .getElementById("btn-add-candidate")
    ?.addEventListener("click", addCandidate);
});

function renderRecruitment() {
  const board = document.getElementById("recruitment-board");
  if (!board) return;

  board.innerHTML = stages
    .map((stage) => {
      const stageCandidates = candidates.filter(
        (candidate) => candidate.stage === stage,
      );
      return `
			<div class="pipeline-column">
				<div class="pipeline-heading"><h4>${stage}</h4><span>${stageCandidates.length}</span></div>
				<div class="candidate-list">
					${stageCandidates.length ? stageCandidates.map(candidateCard).join("") : '<p class="pipeline-empty">No candidates</p>'}
				</div>
			</div>`;
    })
    .join("");

  board.querySelectorAll("[data-next-stage]").forEach((button) => {
    button.addEventListener("click", () => moveCandidate(button.dataset.id));
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
			${nextStage ? `<button class="candidate-action" data-next-stage="${nextStage}" data-id="${candidate.id}">Move to ${nextStage}</button>` : '<span class="hired-label">Onboard next</span>'}
		</article>`;
}

function moveCandidate(candidateId) {
  const candidate = candidates.find((item) => item.id === candidateId);
  if (!candidate) return;
  candidate.stage = stages[stages.indexOf(candidate.stage) + 1];
  renderRecruitment();
}

function addCandidate() {
  const name = window.prompt("Candidate name");
  if (!name?.trim()) return;
  const role = window.prompt("Role", "New role");
  if (!role?.trim()) return;
  candidates.push({
    id: `C-${104 + candidates.length}`,
    name: name.trim(),
    role: role.trim(),
    email: "pending@example.com",
    stage: "Screening",
  });
  renderRecruitment();
}
