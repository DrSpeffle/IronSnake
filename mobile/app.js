const STORAGE_KEY = "iron_snake_phone_state";

const defaultState = {
  xp: 0,
  level: 1,
  currentDay: 1,
  completedToday: false,
  nutrition: 12,
  fitness: 9,
  strength: 6,
  mind: 11,
  soul: 4,
  lastCompletedDate: null,
  log: []
};

let state = loadState();

const dayPlans = [
  {
    day: 1,
    quest: "Swap the usual bacon sandwich for a better lunch.",
    cookingTitle: "Better Sandwich Day",
    cookingSteps: [
      "Buy wholemeal bread or a decent roll.",
      "Add chicken, tuna, eggs, or ham.",
      "Add salad, tomato, cucumber, or peppers.",
      "Drink water with it.",
      "Do not aim for perfect. Aim for better."
    ],
    workoutTitle: "Wake The Body",
    workoutSteps: [
      "Walk for 10 minutes.",
      "Do 5 slow squats.",
      "Do 5 wall press-ups.",
      "Stretch shoulders for 1 minute.",
      "Stop before it feels stupidly hard."
    ]
  },
  {
    day: 2,
    quest: "Cook or prepare one simple protein meal.",
    cookingTitle: "Eggs Or Chicken Plate",
    cookingSteps: [
      "Choose eggs, chicken, or tuna.",
      "Add potatoes, rice, or bread.",
      "Add one vegetable.",
      "Season with salt, pepper, garlic, or paprika.",
      "Eat slowly and notice it counts."
    ],
    workoutTitle: "Foundation Set",
    workoutSteps: [
      "Walk for 12 minutes.",
      "Do 2 rounds of 5 squats.",
      "Do 2 rounds of 5 wall press-ups.",
      "Do 10 seconds plank.",
      "Tick done."
    ]
  },
  {
    day: 3,
    quest: "Catalunyan casserole attempt.",
    cookingTitle: "Catalunyan Casserole",
    cookingSteps: [
      "Boil chopped potatoes until soft.",
      "Fry onion, garlic, chorizo, and pork belly.",
      "Add capsicum/pepper, green beans, and broccoli.",
      "Mix potatoes into the pan.",
      "Season and simmer until rich.",
      "Make enough for leftovers."
    ],
    workoutTitle: "First Proper Session",
    workoutSteps: [
      "Walk for 15 minutes.",
      "Do 3 rounds of 6 squats.",
      "Do 3 rounds of 6 wall or bench press-ups.",
      "Do 3 rounds of 10 second plank.",
      "Stretch hips and shoulders."
    ]
  },
  {
    day: 4,
    quest: "Repeat one good meal and one simple training action.",
    cookingTitle: "Repeat To Win",
    cookingSteps: [
      "Choose the easiest successful meal so far.",
      "Cook it again.",
      "Add one extra vegetable.",
      "Drink water.",
      "Do not chase novelty. Build rhythm."
    ],
    workoutTitle: "Controlled Repeat",
    workoutSteps: [
      "Walk for 15 minutes.",
      "Repeat yesterday, but cleaner.",
      "Move slower.",
      "Rest longer if needed.",
      "Finish feeling proud, not broken."
    ]
  },
  {
    day: 5,
    quest: "Prepare creamy chicken or a simple protein dinner.",
    cookingTitle: "Creamy Chicken",
    cookingSteps: [
      "Fry onion and garlic.",
      "Add chopped chicken.",
      "Add mushrooms or peppers if available.",
      "Add small amount of cream or soft cheese.",
      "Serve with potatoes, rice, or pasta.",
      "Keep the portion sensible."
    ],
    workoutTitle: "Strength Touch",
    workoutSteps: [
      "Walk 10 minutes.",
      "Do 3 rounds of squats.",
      "Do 3 rounds of press-ups.",
      "Do 3 rounds of core.",
      "Stop with one rep still in reserve."
    ]
  },
  {
    day: 6,
    quest: "Get outside and reinforce the system.",
    cookingTitle: "Simple Recovery Food",
    cookingSteps: [
      "Make a sandwich, eggs, or leftovers.",
      "Add one protein source.",
      "Add one colour from vegetables.",
      "Drink water.",
      "Keep it simple."
    ],
    workoutTitle: "Outdoor Movement",
    workoutSteps: [
      "Go outside.",
      "Walk 20 minutes.",
      "No speed target.",
      "No performance target.",
      "Just prove movement."
    ]
  },
  {
    day: 7,
    quest: "Review the week and complete one pride action.",
    cookingTitle: "Week Review Meal",
    cookingSteps: [
      "Pick the best meal of the week.",
      "Cook it again.",
      "Notice what was easier.",
      "Write down one meal to repeat next week.",
      "This is how food discipline forms."
    ],
    workoutTitle: "Week One Test",
    workoutSteps: [
      "Walk 20 minutes.",
      "Do max comfortable squats.",
      "Do max comfortable press-ups variation.",
      "Do a plank.",
      "Record honestly. No ego."
    ]
  }
];

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? { ...defaultState, ...JSON.parse(saved) } : { ...defaultState };
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function getTodayPlan() {
  return dayPlans[(state.currentDay - 1) % dayPlans.length];
}

function getOverallScore() {
  return Math.round(
    (state.nutrition + state.fitness + state.strength + state.mind + state.soul) / 5
  );
}

function updateHeader() {
  const overall = getOverallScore();

  document.getElementById("overall-score").innerText = overall + "%";
  document.getElementById("overall-fill").style.width = overall + "%";

  const plan = getTodayPlan();

  document.getElementById("current-quest").innerHTML = `
    <strong>Day ${state.currentDay} Quest</strong>
    <span>${state.completedToday ? "✓ Done" : plan.quest}</span>
    ${
      state.completedToday
        ? `<button onclick="nextDay()">Next Day</button>`
        : `<button onclick="completeToday()">Tick Done</button>`
    }
  `;
}

function completeToday() {
  if (state.completedToday) return;

  state.completedToday = true;
  state.xp += 25;
  state.level = Math.floor(state.xp / 100) + 1;

  state.nutrition = Math.min(100, state.nutrition + 4);
  state.fitness = Math.min(100, state.fitness + 3);
  state.strength = Math.min(100, state.strength + 3);
  state.mind = Math.min(100, state.mind + 2);
  state.soul = Math.min(100, state.soul + 2);

  state.log.unshift(`Day ${state.currentDay} completed`);
  state.log = state.log.slice(0, 10);

  saveState();
  updateHeader();
  showPage("character");
}

function nextDay() {
  state.currentDay += 1;
  state.completedToday = false;
  saveState();
  updateHeader();
  showPage("character");
}

function getEvolutionRank() {
  const score = getOverallScore();

  if (score >= 80) return "Iron Serpent";
  if (score >= 60) return "Coiled Fighter";
  if (score >= 40) return "Rising Snake";
  if (score >= 20) return "Awakening Snake";

  return "Dormant Snake";
}

function getPortraitPath() {
  const score = getOverallScore();

  if (score >= 80) return "../assets/images/snake_portrait_level_4.png";
  if (score >= 60) return "../assets/images/snake_portrait_level_3.png";
  if (score >= 40) return "../assets/images/snake_portrait_level_2.png";

  return "../assets/images/snake_portrait_level_1.png";
}

function setActiveNav(page) {
  ["character", "cooking", "workout", "mind", "soul"].forEach(item => {
    const button = document.getElementById(`nav-${item}`);
    if (button) button.classList.toggle("active", item === page);
  });
}

function renderCharacter() {
  const xpIntoLevel = state.xp % 100;

  document.getElementById("content-panel").innerHTML = `
    <div class="character-portrait-wrapper">
      <img class="character-portrait" src="${getPortraitPath()}">
      <div class="character-aura"></div>
    </div>

    <h3>Snake</h3>

    <p><strong>Level:</strong> ${state.level}</p>
    <p><strong>XP:</strong> ${state.xp}</p>

    <div class="xp-bar">
      <div class="xp-fill" style="width: ${xpIntoLevel}%"></div>
    </div>

    <p><strong>Evolution:</strong> ${getEvolutionRank()}</p>
    <p><strong>Current Day:</strong> ${state.currentDay}</p>

    <h4>Scores</h4>
    <div class="mini-stat">Nutrition: ${state.nutrition}%</div>
    <div class="mini-stat">Fitness: ${state.fitness}%</div>
    <div class="mini-stat">Strength: ${state.strength}%</div>
    <div class="mini-stat">Mind: ${state.mind}%</div>
    <div class="mini-stat">Soul: ${state.soul}%</div>

    <h4>Recent Progress</h4>
    ${
      state.log.length
        ? state.log.map(item => `<div class="log-entry"><strong>${item}</strong></div>`).join("")
        : "<p>No progress yet.</p>"
    }
  `;
}

function renderCooking() {
  const plan = getTodayPlan();

  document.getElementById("content-panel").innerHTML = `
    <h3>${plan.cookingTitle}</h3>
    <p>Day ${state.currentDay} cooking instruction.</p>
    <ol class="instruction-list">
      ${plan.cookingSteps.map(step => `<li>${step}</li>`).join("")}
    </ol>
  `;
}

function renderWorkout() {
  const plan = getTodayPlan();

  document.getElementById("content-panel").innerHTML = `
    <h3>${plan.workoutTitle}</h3>
    <p>Day ${state.currentDay} training instruction.</p>
    <ol class="instruction-list">
      ${plan.workoutSteps.map(step => `<li>${step}</li>`).join("")}
    </ol>
  `;
}

function renderMind() {
  document.getElementById("content-panel").innerHTML = `
    <h3>Mind</h3>
    <p>Calm is trained the same way strength is trained.</p>
    <ol class="instruction-list">
      <li>Sit still for 2 minutes.</li>
      <li>Breathe in for 4 seconds.</li>
      <li>Breathe out for 6 seconds.</li>
      <li>Do not argue with thoughts. Let them pass.</li>
      <li>Tick the day done only after one calm action.</li>
    </ol>
  `;
}

function renderSoul() {
  document.getElementById("content-panel").innerHTML = `
    <h3>Soul</h3>
    <p>Freedom, road, social contact, and getting out.</p>
    <ol class="instruction-list">
      <li>Step outside every day if possible.</li>
      <li>Plan one short motorcycle route.</li>
      <li>Visit one place that is not work or home.</li>
      <li>Message or speak to one person.</li>
      <li>Record the day as complete when life has expanded, even slightly.</li>
    </ol>
  `;
}

function showPage(page) {
  setActiveNav(page);
  updateHeader();

  if (page === "character") return renderCharacter();
  if (page === "cooking") return renderCooking();
  if (page === "workout") return renderWorkout();
  if (page === "mind") return renderMind();
  if (page === "soul") return renderSoul();
}

function createEmbers() {
  const emberContainer = document.getElementById("embers");
  if (!emberContainer || emberContainer.children.length) return;

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

createEmbers();
showPage("character");
