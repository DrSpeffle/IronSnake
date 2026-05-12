const STORAGE_KEY = "iron_snake_state";

const defaultState = {
  xp: 0,
  level: 1,
  streak: 0,
  nutrition: 12,
  fitness: 9,
  strength: 6,
  mind: 11,
  soul: 4
};

let state = loadState();

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);

  if (saved) {
    return JSON.parse(saved);
  }

  return { ...defaultState };
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
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

function addXP(amount) {
  state.xp += amount;
  state.level = Math.floor(state.xp / 100) + 1;

  saveState();
  renderCharacter();
}

function increaseStat(stat, amount) {
  state[stat] += amount;

  if (state[stat] > 100) {
    state[stat] = 100;
  }

  addXP(10);
  updateScores();
  saveState();
}

function resetState() {
  localStorage.removeItem(STORAGE_KEY);
  state = { ...defaultState };

  updateScores();
  renderCharacter();
}

function updateScores() {
  document.getElementById("nutrition-score").innerText = state.nutrition + "%";
  document.getElementById("fitness-score").innerText = state.fitness + "%";
  document.getElementById("strength-score").innerText = state.strength + "%";
  document.getElementById("mind-score").innerText = state.mind + "%";
  document.getElementById("soul-score").innerText = state.soul + "%";
}

function renderCharacter() {
  document.getElementById("content-panel").innerHTML = `
    <h3>Character</h3>

    <p><strong>Level:</strong> ${state.level}</p>
    <p><strong>XP:</strong> ${state.xp}</p>
    <p><strong>Streak:</strong> ${state.streak}</p>
    <p><strong>Evolution:</strong> ${getEvolutionRank()}</p>

    <button onclick="increaseStat('nutrition', 5)">Cook Meal</button>
    <button onclick="increaseStat('fitness', 5)">Cardio</button>
    <button onclick="increaseStat('strength', 5)">Lift</button>
    <button onclick="increaseStat('mind', 5)">Calm</button>
    <button onclick="increaseStat('soul', 5)">Explore</button>

    <button class="danger-button" onclick="resetState()">Reset Snake</button>
  `;
}

const panels = {
  character: {
    render: renderCharacter
  },

  cooking: {
    title: "Cooking Record",
    body: "Meals, protein, hydration and cooking streaks."
  },

  fitness: {
    title: "Fitness Record",
    body: "Walking, conditioning and fitness progression."
  },

  strength: {
    title: "Strength Record",
    body: "Lifts and strength milestones."
  },

  mind: {
    title: "Mind",
    body: "Mindfulness, calm and emotional recovery."
  },

  soul: {
    title: "Soul",
    body: "Motorcycle routes, freedom and exploration."
  }
};

function showPanel(name) {
  if (name === "character") {
    renderCharacter();
    return;
  }

  const panel = panels[name];

  document.getElementById("content-panel").innerHTML = `
    <h3>${panel.title}</h3>
    <p>${panel.body}</p>
  `;
}

updateScores();
renderCharacter();
