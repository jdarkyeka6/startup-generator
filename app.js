const ideas = [
  { id: 1, name: "Ghost Kitchen OS", pitch: "A tiny operating system for home cooks to sell limited weekly menus without building a full restaurant business.", category: "Local", model: "5% fee", difficulty: "Medium", time: "3 weeks", score: 86, tags: ["Food", "Marketplace", "Local"], accent: "109, 231, 255" },
  { id: 2, name: "Second Brain Search", pitch: "Ask one question and search every note, screenshot, PDF, bookmark and saved post you have ever kept.", category: "AI", model: "$8/mo", difficulty: "Medium", time: "2 weeks", score: 91, tags: ["AI", "Search", "Productivity"], accent: "135, 92, 255" },
  { id: 3, name: "Creator Drop", pitch: "A storefront where creators launch one limited digital product every Friday and followers can buy in two taps.", category: "Creator", model: "7% fee", difficulty: "Easy", time: "10 days", score: 78, tags: ["Creators", "Commerce", "Social"], accent: "255, 121, 192" },
  { id: 4, name: "Receipt Radar", pitch: "Forward receipts and instantly get price-drop alerts, return deadlines and warranty reminders in one clean timeline.", category: "Consumer", model: "$3/mo", difficulty: "Easy", time: "1 week", score: 84, tags: ["Shopping", "Utility", "Mobile"], accent: "98, 240, 181" },
  { id: 5, name: "Tiny CRM", pitch: "A dead-simple relationship tracker for freelancers who hate CRMs: people, last contact, next move. Nothing else.", category: "SaaS", model: "$6/mo", difficulty: "Easy", time: "5 days", score: 88, tags: ["CRM", "Freelance", "B2B"], accent: "255, 185, 88" },
  { id: 6, name: "Explain My Bill", pitch: "Upload any confusing bill or invoice and get a plain-English breakdown, odd-charge flags and questions to ask.", category: "AI", model: "$2/use", difficulty: "Easy", time: "4 days", score: 82, tags: ["AI", "Finance", "Utility"], accent: "119, 155, 255" },
  { id: 7, name: "Queue Club", pitch: "Restaurants publish live wait times and people nearby can join the queue before they leave home.", category: "Local", model: "$29/mo", difficulty: "Medium", time: "3 weeks", score: 74, tags: ["Restaurants", "Local", "Mobile"], accent: "255, 130, 97" },
  { id: 8, name: "Skill Swap", pitch: "Trade one hour of what you are good at for one hour of what someone else knows, with no money changing hands.", category: "Consumer", model: "Freemium", difficulty: "Medium", time: "4 weeks", score: 80, tags: ["Community", "Learning", "Social"], accent: "98, 240, 181" },
  { id: 9, name: "Launch Copy", pitch: "Give it your product URL and it generates a launch page, Product Hunt copy, emails and social posts in one brand voice.", category: "AI", model: "$12/mo", difficulty: "Easy", time: "1 week", score: 89, tags: ["AI", "Marketing", "Founders"], accent: "178, 104, 255" },
  { id: 10, name: "Solo Status", pitch: "A beautiful one-page client portal for freelancers that shows project progress without endless update emails.", category: "SaaS", model: "$9/mo", difficulty: "Easy", time: "1 week", score: 85, tags: ["Freelance", "Clients", "SaaS"], accent: "109, 231, 255" },
  { id: 11, name: "ClipChef", pitch: "Turn any recipe video into a clean ingredient list, timed cooking steps and a grocery checklist.", category: "AI", model: "Freemium", difficulty: "Medium", time: "2 weeks", score: 87, tags: ["Video", "Food", "AI"], accent: "255, 169, 83" },
  { id: 12, name: "Neighbour Vault", pitch: "Private micro-communities for apartment buildings to lend tools, share notices and solve tiny local problems.", category: "Local", model: "$1/home", difficulty: "Medium", time: "3 weeks", score: 73, tags: ["Community", "Property", "Local"], accent: "96, 214, 170" },
  { id: 13, name: "One Minute Portfolio", pitch: "Creators paste links to their work and get a sharp portfolio site instantly, already mobile-ready and shareable.", category: "Creator", model: "$4/mo", difficulty: "Easy", time: "3 days", score: 83, tags: ["Portfolio", "Creator", "No-code"], accent: "255, 126, 190" },
  { id: 14, name: "Meeting Ghost", pitch: "A quiet assistant that watches your calendar and sends the exact prep notes you need five minutes before each meeting.", category: "AI", model: "$10/mo", difficulty: "Medium", time: "2 weeks", score: 90, tags: ["Calendar", "AI", "Work"], accent: "135, 92, 255" },
  { id: 15, name: "Micro Mentor", pitch: "Book 15-minute advice calls with people one tiny step ahead of you instead of expensive career coaches.", category: "Consumer", model: "15% fee", difficulty: "Hard", time: "5 weeks", score: 79, tags: ["Marketplace", "Career", "Calls"], accent: "109, 231, 255" },
  { id: 16, name: "Churn Notes", pitch: "Cancel any SaaS subscription through one inbox and automatically tell founders exactly why users are leaving.", category: "SaaS", model: "$49/mo", difficulty: "Hard", time: "6 weeks", score: 77, tags: ["SaaS", "Retention", "Analytics"], accent: "255, 111, 134" },
  { id: 17, name: "Sponsor Match", pitch: "Match small creators with small brands based on audience fit, not follower count, then generate the whole deal brief.", category: "Creator", model: "10% fee", difficulty: "Medium", time: "4 weeks", score: 88, tags: ["Creators", "Brands", "Marketplace"], accent: "255, 170, 87" },
  { id: 18, name: "Weekend Builder", pitch: "Choose a skill and get one realistic weekend project with a checklist, starter files and a Sunday-night finish line.", category: "Consumer", model: "$5/mo", difficulty: "Easy", time: "1 week", score: 86, tags: ["Learning", "Projects", "Gamified"], accent: "98, 240, 181" }
];

const state = {
  filter: "All",
  deck: [...ideas],
  index: 0,
  saved: JSON.parse(localStorage.getItem("swipestart:saved") || "[]"),
  history: []
};

const cardStack = document.getElementById("cardStack");
const progressCount = document.getElementById("progressCount");
const progressTotal = document.getElementById("progressTotal");
const passButton = document.getElementById("passButton");
const buildButton = document.getElementById("buildButton");
const undoButton = document.getElementById("undoButton");
const resetButton = document.getElementById("resetButton");
const savedGrid = document.getElementById("savedGrid");
const savedCount = document.getElementById("savedCount");
const savedBadge = document.getElementById("savedBadge");
const toast = document.getElementById("toast");
const nopeHint = document.getElementById("nopeHint");
const likeHint = document.getElementById("likeHint");

let toastTimer;

function filteredIdeas() {
  return state.filter === "All" ? ideas : ideas.filter((idea) => idea.category === state.filter);
}

function resetDeck({ keepHistory = false } = {}) {
  state.deck = filteredIdeas();
  state.index = 0;
  if (!keepHistory) state.history = [];
  renderDeck();
}

function persistSaved() {
  localStorage.setItem("swipestart:saved", JSON.stringify(state.saved));
  renderSaved();
}

function isSaved(id) {
  return state.saved.includes(id);
}

function getIdea(id) {
  return ideas.find((idea) => idea.id === id);
}

function cardMarkup(idea, offset = 0) {
  return `
    <article class="idea-card" data-id="${idea.id}" data-offset="${offset}" style="--accent-rgb:${idea.accent}" aria-label="${idea.name}">
      <div class="card-topline">
        <span class="category-badge"><span>✦</span>${idea.category}</span>
        <span class="idea-number">IDEA ${String(idea.id).padStart(2, "0")}</span>
      </div>
      <h3 class="idea-name">${idea.name}</h3>
      <p class="idea-pitch">${idea.pitch}</p>
      <div class="metric-grid">
        <div class="metric"><span class="metric-label">Model</span><span class="metric-value">${idea.model}</span></div>
        <div class="metric"><span class="metric-label">Build</span><span class="metric-value">${idea.difficulty}</span></div>
        <div class="metric"><span class="metric-label">MVP</span><span class="metric-value">${idea.time}</span></div>
      </div>
      <div class="tag-row">${idea.tags.map((tag) => `<span class="idea-tag">${tag}</span>`).join("")}</div>
      <div class="card-footer-note">
        <span>Swipe right to save</span>
        <span class="score-ring">${idea.score}</span>
      </div>
    </article>
  `;
}

function renderDeck() {
  const deck = state.deck;
  progressTotal.textContent = deck.length;
  progressCount.textContent = deck.length ? Math.min(state.index + 1, deck.length) : 0;

  if (!deck.length) {
    cardStack.innerHTML = `<div class="empty-state"><div class="empty-icon">⌕</div><h3>No ideas in this filter</h3><p>Try another category.</p></div>`;
    return;
  }

  if (state.index >= deck.length) {
    cardStack.innerHTML = `<div class="empty-state"><div class="empty-icon">✓</div><h3>Deck cleared</h3><p>You made it through every ${state.filter === "All" ? "" : state.filter + " "}idea. Reset to run it again.</p></div>`;
    progressCount.textContent = deck.length;
    return;
  }

  cardStack.innerHTML = deck.slice(state.index, state.index + 3).map((idea, offset) => cardMarkup(idea, offset)).join("");
  attachDrag(cardStack.querySelector(".idea-card"));
}

function renderSaved() {
  const savedIdeas = state.saved.map(getIdea).filter(Boolean);
  savedBadge.textContent = savedIdeas.length;
  savedCount.textContent = `${savedIdeas.length} saved`;

  if (!savedIdeas.length) {
    savedGrid.innerHTML = `<div class="empty-state"><div class="empty-icon">♥</div><h3>No keepers yet</h3><p>Swipe right on an idea and it will land here.</p></div>`;
    return;
  }

  savedGrid.innerHTML = savedIdeas.map((idea) => `
    <article class="saved-card" style="--accent-rgb:${idea.accent}">
      <div class="saved-card-top">
        <div><span class="category-badge">${idea.category}</span><h3>${idea.name}</h3></div>
        <button class="remove-saved" type="button" data-remove="${idea.id}" aria-label="Remove ${idea.name}">×</button>
      </div>
      <p>${idea.pitch}</p>
      <div class="tag-row">${idea.tags.map((tag) => `<span class="idea-tag">${tag}</span>`).join("")}</div>
    </article>
  `).join("");

  document.querySelectorAll("[data-remove]").forEach((button) => {
    button.addEventListener("click", () => {
      const id = Number(button.dataset.remove);
      state.saved = state.saved.filter((savedId) => savedId !== id);
      persistSaved();
      showToast("Removed from saved");
    });
  });
}

function showToast(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("show");
  toastTimer = setTimeout(() => toast.classList.remove("show"), 1300);
}

function swipe(direction, card = cardStack.querySelector(".idea-card")) {
  if (!card || state.index >= state.deck.length) return;

  const idea = state.deck[state.index];
  const liked = direction === "right";
  state.history.push({ ideaId: idea.id, index: state.index, liked, filter: state.filter });

  if (liked && !isSaved(idea.id)) {
    state.saved.unshift(idea.id);
    persistSaved();
  }

  card.style.transition = "transform 260ms cubic-bezier(.2,.8,.2,1), opacity 230ms ease";
  card.style.transform = `translateX(${liked ? 130 : -130}%) rotate(${liked ? 16 : -16}deg)`;
  card.style.opacity = "0";

  setTimeout(() => {
    state.index += 1;
    renderDeck();
  }, 210);

  showToast(liked ? "Saved to your build list ♥" : "Passed");
}

function undoLast() {
  const last = state.history.pop();
  if (!last) {
    showToast("Nothing to undo yet");
    return;
  }

  if (last.filter !== state.filter) {
    showToast("Undo is only available in this filter");
    state.history.push(last);
    return;
  }

  state.index = Math.max(0, last.index);
  if (last.liked) {
    state.saved = state.saved.filter((id) => id !== last.ideaId);
    persistSaved();
  }
  renderDeck();
  showToast("Swipe undone");
}

function attachDrag(card) {
  if (!card) return;

  let startX = 0;
  let currentX = 0;
  let dragging = false;

  card.addEventListener("pointerdown", (event) => {
    dragging = true;
    startX = event.clientX;
    card.setPointerCapture(event.pointerId);
    card.style.transition = "none";
  });

  card.addEventListener("pointermove", (event) => {
    if (!dragging) return;
    currentX = event.clientX - startX;
    const rotate = currentX / 18;
    card.style.transform = `translateX(${currentX}px) rotate(${rotate}deg)`;

    const strength = Math.min(Math.abs(currentX) / 100, 1);
    likeHint.style.opacity = currentX > 0 ? strength : 0;
    nopeHint.style.opacity = currentX < 0 ? strength : 0;
  });

  function finishDrag(event) {
    if (!dragging) return;
    dragging = false;
    if (card.hasPointerCapture(event.pointerId)) card.releasePointerCapture(event.pointerId);
    likeHint.style.opacity = 0;
    nopeHint.style.opacity = 0;

    if (Math.abs(currentX) > 90) {
      swipe(currentX > 0 ? "right" : "left", card);
    } else {
      card.style.transition = "transform 220ms cubic-bezier(.2,.8,.2,1)";
      card.style.transform = "translateX(0) rotate(0)";
    }
    currentX = 0;
  }

  card.addEventListener("pointerup", finishDrag);
  card.addEventListener("pointercancel", finishDrag);
}

passButton.addEventListener("click", () => swipe("left"));
buildButton.addEventListener("click", () => swipe("right"));
undoButton.addEventListener("click", undoLast);
resetButton.addEventListener("click", () => {
  resetDeck();
  showToast("Deck reset");
});

document.querySelectorAll(".filter-chip").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filter-chip").forEach((chip) => chip.classList.remove("active"));
    button.classList.add("active");
    state.filter = button.dataset.filter;
    resetDeck();
  });
});

document.querySelectorAll(".nav-item").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".nav-item").forEach((item) => item.classList.remove("active"));
    document.querySelectorAll(".screen").forEach((screen) => screen.classList.remove("active"));
    button.classList.add("active");
    document.getElementById(button.dataset.screen).classList.add("active");
    if (button.dataset.screen === "savedScreen") renderSaved();
  });
});

window.addEventListener("keydown", (event) => {
  const discoverActive = document.getElementById("discoverScreen").classList.contains("active");
  if (!discoverActive) return;
  if (event.key === "ArrowLeft") swipe("left");
  if (event.key === "ArrowRight") swipe("right");
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "z") undoLast();
});

renderSaved();
resetDeck();
