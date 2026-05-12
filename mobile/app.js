const STORAGE_KEY = "iron_snake_state";

const defaultState = {
  xp: 0,
  level: 1,
  streak: 0,
  lastActionDate: null,
  lastDecayCheck: null,
  decayNotice: "",
  nutrition: 12,
  fitness: 9,
  strength: 6,
  mind: 11,
  soul: 4,
  log: [],
  completedQuests: [],
  unlockedEvents: [],
  completedMissions: []
};

let state = loadState();

const dailyQuests = [
  { id: "cook_protein", title: "Eat One Proper Protein Meal", stat: "nutrition", label: "Protein Meal", amount: 5, xp: 15 },
  { id: "move_body", title: "Move Your Body", stat: "fitness", label: "Walk", amount: 4, xp: 15 },
  { id: "strength_touch", title: "Do One Strength Action", stat: "strength", label: "Press Ups", amount: 3, xp: 15 },
  { id: "calm_mind", title: "Calm The Mind", stat: "mind", label: "Breathing", amount: 4, xp: 15 },
  { id: "leave_the_cave", title: "Leave The Cave", stat: "soul", label: "Went Outside", amount: 4, xp: 15 }
];

const missionChains = {
  cooking: [
    { id: "catalunyan_casserole", title: "Catalunyan Casserole", stat: "nutrition", amount: 8, xp: 25 },
    { id: "creamy_chicken", title: "Creamy Chicken", stat: "nutrition", amount: 7, xp: 22 },
    { id: "salmon_plate", title: "Salmon Plate", stat: "nutrition", amount: 7, xp: 22 }
  ],
  fitness: [
    { id: "walk_20", title: "20 Minute Walk", stat: "fitness", amount: 6, xp: 20 },
    { id: "mobility_10", title: "10 Minute Mobility", stat: "fitness", amount: 5, xp: 18 },
    { id: "conditioning_light", title: "Light Conditioning", stat: "fitness", amount: 7, xp: 24 }
  ],
  strength: [
    { id: "pressups", title: "Press-Up Set", stat: "strength", amount: 5, xp: 18 },
    { id: "core", title: "Core Work", stat: "strength", amount: 5, xp: 18 },
    { id: "lift_session", title: "Lift Session", stat: "strength", amount: 8, xp: 28 }
  ],
  mind: [
    { id: "breathing", title: "Breathing Reset", stat: "mind", amount: 5, xp: 18 },
    { id: "calm_response", title: "Stayed Calm", stat: "mind", amount: 6, xp: 20 },
    { id: "quiet_10", title: "10 Minutes Quiet", stat: "mind", amount: 6, xp: 20 }
  ],
  soul: [
    { id: "motorcycle_ride", title: "Motorcycle Ride", stat: "soul", amount: 8, xp: 28 },
    { id: "social_contact", title: "Social Contact", stat: "soul", amount: 6, xp: 20 },
    { id: "new_place", title: "Visit Somewhere New", stat: "soul", amount: 8, xp: 28 }
  ]
};

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function yesterdayKey() {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toISOString().slice(0, 10);
}

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  const loaded = saved ? JSON.parse(saved) : {};

  return {
    ...defaultState,
    ...loaded,
    log: loaded.log || [],
    completedQuests: loaded.completedQuests || [],
    unlockedEvents: loaded.unlockedEvents || [],
    completedMissions: loaded.completedMissions || []
  };
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function runDailyDecayCheck() {
  const today = todayKey();

  if (state.lastDecayCheck === today) return;

  if (
    state.lastActionDate &&
    state.lastActionDate !== today &&
    state.lastActionDate !== yesterdayKey()
  ) {
    state.streak = 0;
    ["nutrition", "fitness", "strength", "mind", "soul"].forEach(stat => {
      state[stat] = Math.max(0, state[stat] - 2);
    });

    state.decayNotice = "Decay triggered: no recorded action yesterday. Scores reduced.";
  } else {
    state.decayNotice = "";
  }

  state.lastDecayCheck = today;
  saveState();
}

function updateStreak() {
  const today = todayKey();

  if (state.lastActionDate === today) return;

  state.streak = state.lastActionDate === yesterdayKey() ? state.streak + 1 : 1;
  state.lastActionDate = today;
}

function getAverageScore() {
  return (state.nutrition + state.fitness + state.strength + state.mind + state.soul) / 5;
}

function getEvolutionRank() {
  const average = getAverageScore();

  if (average >= 80) return "Iron Serpent";
  if (average >= 60) return "Coiled Fighter";
  if (average >= 40) return "Rising Snake";
  if (average >= 20) return "Awakening Snake";

  return "Dormant Snake";
}

function getRecoveryState() {
  const average = getAverageScore();

  if (average >= 75) return "Dominant";
  if (average >= 55) return "Building";
  if (average >= 35) return "Unstable but Moving";
  if (average >= 20) return "Awake but Fragile";

  return "Dormant";
}

function getSnakeDialogue() {
  const rank = getEvolutionRank();

  if (rank === "Iron Serpent") return "You are no longer negotiating with weakness.";
  if (rank === "Coiled Fighter") return "The coil is tightening. Keep pressure on.";
  if (rank === "Rising Snake") return "You are becoming harder to stop.";
  if (rank === "Awakening Snake") return "The first movement is always the hardest.";

  return "Start. One action breaks the sleep.";
}

function getPortraitPath() {
  const average = getAverageScore();

  if (average >= 80) return "../assets/images/snake_portrait_level_4.png";
  if (average >= 60) return "../assets/images/snake_portrait_level_3.png";
  if (average >= 40) return "../assets/images/snake_portrait_level_2.png";

  return "../assets/images/snake_portrait_level_1.png";
}

function getQuestKey(id) {
  return `${todayKey()}_${id}`;
}

function isQuestComplete(id) {
  return state.completedQuests.includes(getQuestKey(id));
}

function completeQuest(id) {
  const quest = dailyQuests.find(q => q.id === id);

  if (!quest || isQuestComplete(id)) return;

  increaseStat(quest.stat, quest.amount, quest.xp);
  addLog(quest.title, quest.stat, quest.amount);
  state.completedQuests.push(getQuestKey(id));
  state.completedQuests = state.completedQuests.slice(-80);

  checkUnlocks();
  saveState();
  showPanel("quests");
}

function completeMission(chain, id) {
  const mission = missionChains[chain].find(m => m.id === id);
  const key = `${todayKey()}_${chain}_${id}`;

  if (!mission || state.completedMissions.includes(key)) return;

  increaseStat(mission.stat, mission.amount, mission.xp);
  addLog(mission.title, mission.stat, mission.amount);

  state.completedMissions.push(key);
  state.completedMissions = state.completedMissions.slice(-120);

  checkUnlocks();
  saveState();
  showPanel(chain);
}

function addXP(amount) {
  state.xp += amount;
  state.level = Math.floor(state.xp / 100) + 1;
  saveState();
}

function increaseStat(stat, amount, xp = 10) {
  updateStreak();
  state[stat] = Math.min(100, state[stat] + amount);
  addXP(xp);
  updateScores();
}

function addLog(label, stat, amount) {
  const entry = {
    label,
    stat,
    amount,
    time: new Date().toLocaleString()
  };

  state.log.unshift(entry);
  state.log = state.log.slice(0, 12);
  saveState();
}

function checkUnlocks() {
  const unlocks = [
    { id: "level_2", condition: state.level >= 2, label: "Level 2 Fighter unlocked." },
    { id: "rank_rising", condition: getAverageScore() >= 40, label: "Rising Snake state unlocked." },
    { id: "three_day_streak", condition: state.streak >= 3, label: "Three-Day Coil unlocked." },
    { id: "whole_day", condition: dailyQuests.every(q => isQuestComplete(q.id)), label: "Full Daily Quest Clear unlocked." },
    { id: "road_soul", condition: state.soul >= 50, label: "Road Soul unlocked." }
  ];

  unlocks.forEach(unlock => {
    if (unlock.condition && !state.unlockedEvents.includes(unlock.id)) {
      state.unlockedEvents.unshift(unlock.id);
      addLog(unlock.label, "event", 0);
    }
  });
}

function resetState() {
  localStorage.removeItem(STORAGE_KEY);
  state = { ...defaultState, log: [], completedQuests: [], unlockedEvents: [], completedMissions: [] };
  updateScores();
  showPanel("character");
}

function exportSave() {
  const payload = JSON.stringify(state, null, 2);

  document.getElementById("content-panel").innerHTML = `
    <h3>Export Save</h3>
    <p>Copy this save data somewhere safe.</p>
    <textarea class="save-box" readonly>${payload}</textarea>
    <button onclick="showPanel('character')">Back</button>
  `;
}

function importSave() {
  document.getElementById("content-panel").innerHTML = `
    <h3>Import Save</h3>
    <p>Paste saved IronSnake data below.</p>
    <textarea class="save-box" id="import-save-box"></textarea>
    <button onclick="loadImportedSave()">Import</button>
    <button onclick="showPanel('character')">Back</button>
  `;
}

function loadImportedSave() {
  const raw = document.getElementById("import-save-box").value;

  try {
    const imported = JSON.parse(raw);
    state = { ...defaultState, ...imported };
    saveState();
    updateScores();
    showPanel("character");
  } catch {
    alert("Invalid save data.");
  }
}

function updateScores() {
  ["nutrition", "fitness", "strength", "mind", "soul"].forEach(stat => {
    document.getElementById(`${stat}-score`).innerText = state[stat] + "%";
    document.getElementById(`${stat}-fill`).style.width = state[stat] + "%";
  });
}

function renderDecayNotice() {
  if (!state.decayNotice) return "";
  return `<div class="decay-warning">${state.decayNotice}</div>`;
}

function renderLog() {
  if (!state.log.length) return "<p>No actions recorded yet.</p>";

  return state.log.map(entry => `
    <div class="log-entry">
      <strong>${entry.label}</strong>
      <span>${entry.stat} +${entry.amount}</span>
      <small>${entry.time}</small>
    </div>
  `).join("");
}

function getBadges() {
  return [
    { label: "First Blood", unlocked: state.log.length >= 1 },
    { label: "Level 2 Fighter", unlocked: state.level >= 2 },
    { label: "Three-Day Coil", unlocked: state.streak >= 3 },
    { label: "Disciplined Eater", unlocked: state.nutrition >= 40 },
    { label: "Road Soul", unlocked: state.soul >= 40 },
    { label: "Full Daily Clear", unlocked: dailyQuests.every(q => isQuestComplete(q.id)) },
    { label: "Rising Snake", unlocked: getAverageScore() >= 40 }
  ];
}

function renderBadges() {
  return getBadges().map(badge => `
    <div class="badge ${badge.unlocked ? "unlocked" : ""}">
      ${badge.unlocked ? "✓" : "○"} ${badge.label}
    </div>
  `).join("");
}

function renderCharacter() {
  const xpIntoLevel = state.xp % 100;

  document.getElementById("content-panel").innerHTML = `
    <div class="character-portrait-wrapper">
      <img class="character-portrait" src="${getPortraitPath()}">
      <div class="character-aura"></div>
    </div>

    <h3>Character</h3>

    ${renderDecayNotice()}

    <div class="dialogue-box">
      ${getSnakeDialogue()}
    </div>

    <p><strong>Level:</strong> ${state.level}</p>
    <p><strong>XP:</strong> ${state.xp}</p>

    <div class="xp-bar">
      <div class="xp-fill" style="width: ${xpIntoLevel}%"></div>
    </div>

    <p><strong>Streak:</strong> ${state.streak} day(s)</p>
    <p><strong>Evolution:</strong> ${getEvolutionRank()}</p>
    <p><strong>Recovery State:</strong> ${getRecoveryState()}</p>

    <h4>Milestones</h4>
    <div class="badge-grid">${renderBadges()}</div>

    <h4>Recent Actions</h4>
    ${renderLog()}

    <button onclick="exportSave()">Export Save</button>
    <button onclick="importSave()">Import Save</button>
    <button class="danger-button" onclick="resetState()">Reset Snake</button>
  `;
}

function renderQuests() {
  const completed = dailyQuests.filter(q => isQuestComplete(q.id)).length;

  const questCards = dailyQuests.map(quest => {
    const done = isQuestComplete(quest.id);

    return `
      <div class="quest-card ${done ? "quest-complete" : ""}">
        <strong>${done ? "✓" : "○"} ${quest.title}</strong>
        <span>${quest.stat} +${quest.amount} / XP +${quest.xp}</span>
        <button ${done ? "disabled" : ""} onclick="completeQuest('${quest.id}')">
          ${done ? "Completed" : "Complete Quest"}
        </button>
      </div>
    `;
  }).join("");

  document.getElementById("content-panel").innerHTML = `
    <h3>Daily Quests</h3>
    <p><strong>${completed}/${dailyQuests.length}</strong> complete today.</p>
    ${questCards}
  `;
}

function renderMissionChain(chain, title, body) {
  const cards = missionChains[chain].map(mission => {
    const key = `${todayKey()}_${chain}_${mission.id}`;
    const done = state.completedMissions.includes(key);

    return `
      <div class="quest-card ${done ? "quest-complete" : ""}">
        <strong>${done ? "✓" : "○"} ${mission.title}</strong>
        <span>${mission.stat} +${mission.amount} / XP +${mission.xp}</span>
        <button ${done ? "disabled" : ""} onclick="completeMission('${chain}', '${mission.id}')">
          ${done ? "Completed Today" : "Record Mission"}
        </button>
      </div>
    `;
  }).join("");

  document.getElementById("content-panel").innerHTML = `
    <h3>${title}</h3>
    <p>${body}</p>
    ${cards}
  `;
}

function setActiveNav(name) {
  ["character", "quests", "cooking", "fitness", "strength", "mind", "soul"].forEach(item => {
    const button = document.getElementById(`nav-${item}`);
    if (!button) return;
    button.classList.toggle("active", item === name);
  });
}

function showPanel(name) {
  setActiveNav(name);

  if (name === "character") return renderCharacter();
  if (name === "quests") return renderQuests();

  if (name === "cooking") {
    return renderMissionChain(
      "cooking",
      "Cooking Record",
      "Build food discipline through simple, repeatable meals."
    );
  }

  if (name === "fitness") {
    return renderMissionChain(
      "fitness",
      "Fitness Record",
      "Movement, cardio, conditioning and daily body use."
    );
  }

  if (name === "strength") {
    return renderMissionChain(
      "strength",
      "Strength Record",
      "Strength work, overload, core and physical rebuild."
    );
  }

  if (name === "mind") {
    return renderMissionChain(
      "mind",
      "Mind",
      "Calm, control, breathing and emotional regulation."
    );
  }

  if (name === "soul") {
    return renderMissionChain(
      "soul",
      "Soul",
      "Motorcycle routes, getting out, social contact and freedom."
    );
  }
}

function createEmbers() {
  const emberContainer = document.getElementById("embers");
  if (!emberContainer) return;

  for (let i = 0; i < 24; i++) {
    const ember = document.createElement("div");

    ember.className = "ember";
    ember.style.left = Math.random() * 100 + "%";
    ember.style.animationDuration = (6 + Math.random() * 8) + "s";
    ember.style.animationDelay = Math.random() * 8 + "s";
    ember.style.opacity = 0.2 + Math.random() * 0.8;

    emberContainer.appendChild(ember);
  }
}

runDailyDecayCheck();
updateScores();
showPanel("character");
createEmbers();
