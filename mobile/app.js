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
  log: []
};

let state = loadState();

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
  return { ...defaultState, ...loaded, log: loaded.log || [] };
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function runDailyDecayCheck() {
  const today = todayKey();

  if (state.lastDecayCheck === today) {
    return;
  }

  if (
    state.lastActionDate &&
    state.lastActionDate !== today &&
    state.lastActionDate !== yesterdayKey()
  ) {
    state.streak = 0;

    state.nutrition = Math.max(0, state.nutrition - 2);
    state.fitness = Math.max(0, state.fitness - 2);
    state.strength = Math.max(0, state.strength - 2);
    state.mind = Math.max(0, state.mind - 2);
    state.soul = Math.max(0, state.soul - 2);

    state.decayNotice =
      "Decay triggered: no recorded action yesterday. Scores reduced.";
  } else {
    state.decayNotice = "";
  }

  state.lastDecayCheck = today;
  saveState();
}

function updateStreak() {
  const today = todayKey();

  if (state.lastActionDate === today) {
    return;
  }

  if (state.lastActionDate === yesterdayKey()) {
    state.streak += 1;
  } else {
    state.streak = 1;
  }

  state.lastActionDate = today;
}

function getEvolutionRank() {
  const average =
    (state.nutrition +
      state.fitness +
      state.strength +
      state.mind +
      state.soul) / 5;

  if (average >= 80) return "Iron Serpent";
  if (average >= 60) return "Coiled Fighter";
  if (average >= 40) return "Rising Snake";
  if (average >= 20) return "Awakening Snake";

  return "Dormant Snake";
}

function getPortraitPath() {

  const average =
    (state.nutrition +
      state.fitness +
      state.strength +
      state.mind +
      state.soul) / 5;

  if (average >= 80) {
    return "../assets/images/snake_portrait_level_4.png";
  }

  if (average >= 60) {
    return "../assets/images/snake_portrait_level_3.png";
  }

  if (average >= 40) {
    return "../assets/images/snake_portrait_level_2.png";
  }

  return "../assets/images/snake_portrait_level_1.png";
}

function getBadges() {
  return [
    {
      label: "First Blood",
      unlocked: state.log.length >= 1
    },
    {
      label: "Level 2 Fighter",
      unlocked: state.level >= 2
    },
    {
      label: "Three-Day Coil",
      unlocked: state.streak >= 3
    },
    {
      label: "Disciplined Eater",
      unlocked: state.nutrition >= 40
    },
    {
      label: "Road Soul",
      unlocked: state.soul >= 40
    }
  ];
}

function addXP(amount) {
  state.xp += amount;
  state.level = Math.floor(state.xp / 100) + 1;
  saveState();
}

function increaseStat(stat, amount) {
  updateStreak();

  state[stat] = Math.min(100, state[stat] + amount);

  addXP(10);
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
  state.log = state.log.slice(0, 10);
  saveState();
}

function resetState() {
  localStorage.removeItem(STORAGE_KEY);
  state = { ...defaultState, log: [] };

  updateScores();
  renderCharacter();
}

function updateScores() {
  const stats = ["nutrition", "fitness", "strength", "mind", "soul"];

  stats.forEach(stat => {
    document.getElementById(`${stat}-score`).innerText =
      state[stat] + "%";

    document.getElementById(`${stat}-fill`).style.width =
      state[stat] + "%";
  });
}

function renderLog() {
  if (!state.log.length) {
    return "<p>No actions recorded yet.</p>";
  }

  return state.log
    .map(entry => `
      <div class="log-entry">
        <strong>${entry.label}</strong>
        <span>${entry.stat} +${entry.amount}</span>
        <small>${entry.time}</small>
      </div>
    `)
    .join("");
}

function renderBadges() {
  return getBadges()
    .map(badge => `
      <div class="badge ${badge.unlocked ? "unlocked" : ""}">
        ${badge.unlocked ? "✓" : "○"} ${badge.label}
      </div>
    `)
    .join("");
}

function renderDecayNotice() {
  if (!state.decayNotice) {
    return "";
  }

  return `
    <div class="decay-warning">
      ${state.decayNotice}
    </div>
  `;
}

function renderCharacter() {
  const xpIntoLevel = state.xp % 100;

  document.getElementById("content-panel").innerHTML = `
    <div class="character-portrait-wrapper">

      <img
        class="character-portrait"
        src="${getPortraitPath()}"
      >

      <div class="character-aura"></div>

    </div>

    <h3>Character</h3>

    ${renderDecayNotice()}

    <p><strong>Level:</strong> ${state.level}</p>
    <p><strong>XP:</strong> ${state.xp}</p>

    <div class="xp-bar">
      <div class="xp-fill" style="width: ${xpIntoLevel}%"></div>
    </div>

    <p><strong>Streak:</strong> ${state.streak} day(s)</p>
    <p><strong>Evolution:</strong> ${getEvolutionRank()}</p>

    <h4>Milestones</h4>

    <div class="badge-grid">
      ${renderBadges()}
    </div>

    <h4>Recent Actions</h4>

    ${renderLog()}

    <button class="danger-button"
            onclick="resetState()">
      Reset Snake
    </button>
  `;
}

function renderRecord(title, body, actions) {
  const buttons = actions
    .map(action => `
      <button onclick="completeAction('${action.label}', '${action.stat}', ${action.amount}, '${action.panel}')">
        ${action.label}
      </button>
    `)
    .join("");

  document.getElementById("content-panel").innerHTML = `
    <h3>${title}</h3>
    <p>${body}</p>
    ${buttons}
  `;
}

function setActiveNav(name) {
  const navItems = ["character", "cooking", "fitness", "strength", "mind", "soul"];

  navItems.forEach(item => {
    const button = document.getElementById(`nav-${item}`);

    if (!button) {
      return;
    }

    if (item === name) {
      button.classList.add("active");
    } else {
      button.classList.remove("active");
    }
  });
}

function completeAction(label, stat, amount, panel) {
  increaseStat(stat, amount);
  addLog(label, stat, amount);
  showPanel(panel);
}

function showPanel(name) {
  setActiveNav(name);

  if (name === "character") {
    renderCharacter();
    return;
  }

  if (name === "cooking") {
    renderRecord("Cooking Record", "Record food discipline, protein, hydration and recovery meals.", [
      { label: "Protein Meal", stat: "nutrition", amount: 5, panel: "cooking" },
      { label: "Hydration", stat: "nutrition", amount: 3, panel: "cooking" },
      { label: "No Junk Meal", stat: "nutrition", amount: 4, panel: "cooking" }
    ]);
  }

  if (name === "fitness") {
    renderRecord("Fitness Record", "Record conditioning, movement, walking and cardio.", [
      { label: "Walk", stat: "fitness", amount: 4, panel: "fitness" },
      { label: "Cardio", stat: "fitness", amount: 5, panel: "fitness" },
      { label: "Mobility", stat: "fitness", amount: 3, panel: "fitness" }
    ]);
  }

  if (name === "strength") {
    renderRecord("Strength Record", "Record lifting, bodyweight work and progressive overload.", [
      { label: "Lift Session", stat: "strength", amount: 5, panel: "strength" },
      { label: "Press Ups", stat: "strength", amount: 3, panel: "strength" },
      { label: "Core Work", stat: "strength", amount: 3, panel: "strength" }
    ]);
  }

  if (name === "mind") {
    renderRecord("Mind", "Record calm, mindfulness, control and emotional discipline.", [
      { label: "Breathing", stat: "mind", amount: 4, panel: "mind" },
      { label: "Meditation", stat: "mind", amount: 5, panel: "mind" },
      { label: "Stayed Calm", stat: "mind", amount: 4, panel: "mind" }
    ]);
  }

  if (name === "soul") {
    renderRecord("Soul", "Record freedom, motorcycle routes, getting out and social recovery.", [
      { label: "Motorcycle Ride", stat: "soul", amount: 5, panel: "soul" },
      { label: "Went Outside", stat: "soul", amount: 4, panel: "soul" },
      { label: "Social Contact", stat: "soul", amount: 4, panel: "soul" }
    ]);
  }
}

runDailyDecayCheck();
updateScores();
showPanel("character");
