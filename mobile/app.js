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
    week: "Week 1 — Wake The Snake",
    quest: "Swap the usual bacon sandwich for a better lunch.",
    cookingTitle: "Better Sandwich Day",
    cookingSteps: [
      "Use wholemeal bread or a decent roll.",
      "Add chicken, tuna, eggs, ham, or cheese.",
      "Add one salad item: tomato, cucumber, lettuce, or peppers.",
      "Drink water with it.",
      "This is not a diet. This is the first upgrade."
    ],
    workoutTitle: "Wake The Body",
    workoutSteps: [
      "Walk for 10 minutes.",
      "Do 5 slow squats.",
      "Do 5 wall press-ups.",
      "Stretch shoulders for 1 minute.",
      "Stop before it feels too hard."
    ]
  },
  {
    day: 2,
    week: "Week 1 — Wake The Snake",
    quest: "Prepare one simple protein meal.",
    cookingTitle: "Eggs Or Chicken Plate",
    cookingSteps: [
      "Choose eggs, chicken, tuna, or ham.",
      "Add potatoes, rice, pasta, or bread.",
      "Add one vegetable.",
      "Season with salt, pepper, garlic, or paprika.",
      "Eat slowly. This counts."
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
    week: "Week 1 — Wake The Snake",
    quest: "Cook Catalunyan casserole.",
    cookingTitle: "Catalunyan Casserole",
    cookingSteps: [
      "Boil chopped potatoes until soft.",
      "Fry onion, garlic, chorizo, and pork belly.",
      "Add peppers, green beans, and broccoli.",
      "Mix the potatoes into the pan.",
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
    week: "Week 1 — Wake The Snake",
    quest: "Repeat one successful meal and one simple training action.",
    cookingTitle: "Repeat To Win",
    cookingSteps: [
      "Choose the easiest successful meal so far.",
      "Cook it again.",
      "Add one extra vegetable.",
      "Drink water.",
      "Rhythm beats novelty."
    ],
    workoutTitle: "Controlled Repeat",
    workoutSteps: [
      "Walk for 15 minutes.",
      "Repeat yesterday, but cleaner.",
      "Move slower.",
      "Rest longer if needed.",
      "Finish proud, not broken."
    ]
  },
  {
    day: 5,
    week: "Week 1 — Wake The Snake",
    quest: "Cook creamy chicken or a simple protein dinner.",
    cookingTitle: "Creamy Chicken",
    cookingSteps: [
      "Fry onion and garlic.",
      "Add chopped chicken.",
      "Add mushrooms or peppers if available.",
      "Add a small amount of cream, yoghurt, or soft cheese.",
      "Serve with potatoes, rice, or pasta.",
      "Keep the portion sensible."
    ],
    workoutTitle: "Strength Touch",
    workoutSteps: [
      "Walk 10 minutes.",
      "Do 3 rounds of squats.",
      "Do 3 rounds of press-ups.",
      "Do 3 rounds of core.",
      "Stop with one rep in reserve."
    ]
  },
  {
    day: 6,
    week: "Week 1 — Wake The Snake",
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
    week: "Week 1 — Wake The Snake",
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
  },
  {
    day: 8,
    week: "Week 2 — Build The Coil",
    quest: "Add breakfast or an earlier protein start.",
    cookingTitle: "Small Breakfast Upgrade",
    cookingSteps: [
      "Choose one: yoghurt, eggs, banana, porridge, or protein sandwich.",
      "Keep it small.",
      "Eat before the usual late-morning hunger crash.",
      "Drink water.",
      "Do not force a full breakfast yet."
    ],
    workoutTitle: "Coil Builder",
    workoutSteps: [
      "Walk 20 minutes.",
      "Do 3 rounds of 8 squats.",
      "Do 3 rounds of 8 wall or bench press-ups.",
      "Do 3 rounds of 15 second plank.",
      "Stretch for 3 minutes."
    ]
  },
  {
    day: 9,
    week: "Week 2 — Build The Coil",
    quest: "Cook a clean protein and carb plate.",
    cookingTitle: "Chicken, Rice, Vegetable",
    cookingSteps: [
      "Cook rice or potatoes.",
      "Cook chicken with garlic and paprika.",
      "Add broccoli, peppers, or green beans.",
      "Add a small sauce if needed.",
      "Make one spare portion."
    ],
    workoutTitle: "More Reps, Same Control",
    workoutSteps: [
      "Walk 20 minutes.",
      "Do 3 rounds of 10 squats.",
      "Do 3 rounds of 8 press-ups variation.",
      "Do 3 rounds of core.",
      "Keep technique clean."
    ]
  },
  {
    day: 10,
    week: "Week 2 — Build The Coil",
    quest: "Cook salmon or fish.",
    cookingTitle: "Salmon Plate",
    cookingSteps: [
      "Cook salmon, cod, tuna steak, or fish fingers if needed.",
      "Add potatoes, rice, or bread.",
      "Add peas, broccoli, or salad.",
      "Use lemon, pepper, garlic, or paprika.",
      "Simple food. Strong food."
    ],
    workoutTitle: "Conditioning Touch",
    workoutSteps: [
      "Walk 10 minutes.",
      "Do 5 rounds: 5 squats, 5 press-ups, 10 second plank.",
      "Rest as needed.",
      "Do not rush.",
      "Finish with water."
    ]
  },
  {
    day: 11,
    week: "Week 2 — Build The Coil",
    quest: "Repeat the strongest meal so far.",
    cookingTitle: "Repeat Strongest Meal",
    cookingSteps: [
      "Pick Catalunyan casserole, creamy chicken, or salmon plate.",
      "Cook it again.",
      "Improve one thing only.",
      "Do not overcomplicate it.",
      "Repeatability is the win."
    ],
    workoutTitle: "Joint-Friendly Day",
    workoutSteps: [
      "Walk 20 minutes.",
      "Do gentle mobility.",
      "Do light squats only.",
      "Do breathing afterwards.",
      "Recover without quitting."
    ]
  },
  {
    day: 12,
    week: "Week 2 — Build The Coil",
    quest: "Cook a proper lunch instead of buying rubbish.",
    cookingTitle: "Lunch Control",
    cookingSteps: [
      "Make a proper sandwich, wrap, or leftovers box.",
      "Include protein.",
      "Include one vegetable or salad item.",
      "Take water.",
      "This replaces drift."
    ],
    workoutTitle: "Strength Builder",
    workoutSteps: [
      "Walk 15 minutes.",
      "Do 4 rounds of 8 squats.",
      "Do 4 rounds of 8 press-ups variation.",
      "Do 4 rounds of 15 second plank.",
      "Stretch."
    ]
  },
  {
    day: 13,
    week: "Week 2 — Build The Coil",
    quest: "Get outside for body and soul.",
    cookingTitle: "Outdoor Day Food",
    cookingSteps: [
      "Eat before going out.",
      "Choose a sandwich, eggs, leftovers, or chicken plate.",
      "Avoid skipping food then crashing later.",
      "Drink water.",
      "Keep the engine fuelled."
    ],
    workoutTitle: "Outside Session",
    workoutSteps: [
      "Walk 25 minutes.",
      "Find stairs or a hill if possible.",
      "Do not sprint.",
      "Keep breathing under control.",
      "Finish calmer than you started."
    ]
  },
  {
    day: 14,
    week: "Week 2 — Build The Coil",
    quest: "Week 2 review.",
    cookingTitle: "Week Two Review Meal",
    cookingSteps: [
      "Choose the meal Snake enjoyed most.",
      "Cook it again.",
      "Write down the easiest repeatable version.",
      "Plan two repeats for next week.",
      "Food discipline is now forming."
    ],
    workoutTitle: "Week Two Test",
    workoutSteps: [
      "Walk 25 minutes.",
      "Do max comfortable squats.",
      "Do max comfortable press-ups variation.",
      "Do max comfortable plank.",
      "Compare to Day 7."
    ]
  },
  {
    day: 15,
    week: "Week 3 — Strike With Structure",
    quest: "Start the day with planned food.",
    cookingTitle: "Planned Start",
    cookingSteps: [
      "Decide today’s main meal early.",
      "Prepare one ingredient in advance.",
      "Do not wait until hungry to decide.",
      "Keep protein central.",
      "Structure beats impulse."
    ],
    workoutTitle: "Structured Session",
    workoutSteps: [
      "Walk 25 minutes.",
      "Do 4 rounds of 10 squats.",
      "Do 4 rounds of 10 press-ups variation.",
      "Do 4 rounds of 20 second plank.",
      "Rest properly."
    ]
  },
  {
    day: 16,
    week: "Week 3 — Strike With Structure",
    quest: "Cook a batch meal.",
    cookingTitle: "Batch Cook",
    cookingSteps: [
      "Choose casserole, chilli, curry, or chicken rice.",
      "Cook enough for 2 portions.",
      "Store one portion.",
      "Label it if needed.",
      "Future Snake gets fed."
    ],
    workoutTitle: "Strength Progression",
    workoutSteps: [
      "Walk 15 minutes.",
      "Add one harder variation if safe.",
      "More range, slower reps, or lower press-up angle.",
      "Do not add everything at once.",
      "Progress is controlled pressure."
    ]
  },
  {
    day: 17,
    week: "Week 3 — Strike With Structure",
    quest: "Eat leftovers instead of drifting.",
    cookingTitle: "Leftover Discipline",
    cookingSteps: [
      "Use yesterday’s stored portion.",
      "Add salad, veg, or bread if needed.",
      "Drink water.",
      "Notice the reduced effort.",
      "This is why batch cooking matters."
    ],
    workoutTitle: "Recovery Strength",
    workoutSteps: [
      "Walk 20 minutes.",
      "Do mobility.",
      "Do light core.",
      "No ego today.",
      "Keep the streak alive."
    ]
  },
  {
    day: 18,
    week: "Week 3 — Strike With Structure",
    quest: "Cook a meal with vegetables built in.",
    cookingTitle: "Vegetable Built-In Meal",
    cookingSteps: [
      "Choose chicken, pork, tuna, or eggs.",
      "Add at least two vegetables.",
      "Cook them into the meal, not as punishment.",
      "Season properly.",
      "Make it taste good."
    ],
    workoutTitle: "Conditioning Builder",
    workoutSteps: [
      "Walk 10 minutes.",
      "Do 6 rounds of 5 squats, 5 press-ups, 15 second plank.",
      "Rest 60 seconds between rounds.",
      "Keep breathing steady.",
      "Finish clean."
    ]
  },
  {
    day: 19,
    week: "Week 3 — Strike With Structure",
    quest: "Prepare a no-excuse lunch.",
    cookingTitle: "No-Excuse Lunch",
    cookingSteps: [
      "Make lunch before hunger hits.",
      "Protein first.",
      "Carb second.",
      "Vegetable or salad third.",
      "Take it with you if needed."
    ],
    workoutTitle: "Walk And Reset",
    workoutSteps: [
      "Walk 30 minutes.",
      "No workout pressure.",
      "Use the walk to clear the head.",
      "Breathe through the nose if possible.",
      "Return steadier."
    ]
  },
  {
    day: 20,
    week: "Week 3 — Strike With Structure",
    quest: "Cook something better than takeaway.",
    cookingTitle: "Better Than Takeaway",
    cookingSteps: [
      "Choose a favourite flavour: spicy, creamy, smoky, or garlicky.",
      "Build it around protein.",
      "Add potato, rice, pasta, or bread.",
      "Add vegetables.",
      "Make the better choice satisfying."
    ],
    workoutTitle: "Pressure Session",
    workoutSteps: [
      "Walk 15 minutes.",
      "Do 5 rounds of 10 squats.",
      "Do 5 rounds of 8-10 press-ups.",
      "Do 5 rounds of 20 second plank.",
      "Stop if form collapses."
    ]
  },
  {
    day: 21,
    week: "Week 3 — Strike With Structure",
    quest: "Week 3 review.",
    cookingTitle: "Structure Review",
    cookingSteps: [
      "List the top three repeat meals.",
      "Pick one batch meal.",
      "Pick one quick lunch.",
      "Pick one comfort meal that is still decent.",
      "This becomes the base library."
    ],
    workoutTitle: "Week Three Test",
    workoutSteps: [
      "Walk 30 minutes.",
      "Test squats.",
      "Test press-ups variation.",
      "Test plank.",
      "Compare to Day 14."
    ]
  },
  {
    day: 22,
    week: "Week 4 — Pride Phase",
    quest: "Choose deliberately all day.",
    cookingTitle: "Deliberate Food Day",
    cookingSteps: [
      "Plan lunch and dinner.",
      "No accidental food.",
      "Protein in both meals.",
      "Water through the day.",
      "This is command, not restriction."
    ],
    workoutTitle: "Pride Session",
    workoutSteps: [
      "Walk 30 minutes.",
      "Do 5 rounds of squats.",
      "Do 5 rounds of press-ups.",
      "Do 5 rounds of core.",
      "Finish with posture tall."
    ]
  },
  {
    day: 23,
    week: "Week 4 — Pride Phase",
    quest: "Cook for tomorrow as well as today.",
    cookingTitle: "Future-Proof Meal",
    cookingSteps: [
      "Cook two portions.",
      "Eat one.",
      "Store one.",
      "Use enough protein.",
      "Future Snake does not beg."
    ],
    workoutTitle: "Controlled Harder Day",
    workoutSteps: [
      "Walk 20 minutes.",
      "Add one harder movement only.",
      "Keep everything else steady.",
      "No reckless jumps.",
      "Earn the upgrade."
    ]
  },
  {
    day: 24,
    week: "Week 4 — Pride Phase",
    quest: "Use yesterday’s food and train clean.",
    cookingTitle: "Stored Meal Win",
    cookingSteps: [
      "Use the stored portion.",
      "Add something fresh if needed.",
      "Drink water.",
      "Notice the system working.",
      "This is discipline paying interest."
    ],
    workoutTitle: "Clean Technique",
    workoutSteps: [
      "Walk 20 minutes.",
      "Slow every rep down.",
      "Stop rushing.",
      "Make each movement clean.",
      "Quality is strength."
    ]
  },
  {
    day: 25,
    week: "Week 4 — Pride Phase",
    quest: "Cook a confident meal without instructions.",
    cookingTitle: "No-Instruction Meal",
    cookingSteps: [
      "Choose protein.",
      "Choose carb.",
      "Choose vegetables.",
      "Choose flavour.",
      "Cook from memory.",
      "You are learning."
    ],
    workoutTitle: "Confidence Session",
    workoutSteps: [
      "Choose your best current workout.",
      "Repeat it.",
      "Improve one thing.",
      "Do not chase punishment.",
      "Chase command."
    ]
  },
  {
    day: 26,
    week: "Week 4 — Pride Phase",
    quest: "Get out into the world.",
    cookingTitle: "Fuel Before Freedom",
    cookingSteps: [
      "Eat before going out.",
      "Avoid running on fumes.",
      "Take water.",
      "If riding, do not skip food.",
      "Soul needs fuel too."
    ],
    workoutTitle: "Road Body",
    workoutSteps: [
      "Walk or ride out.",
      "Spend time away from the house.",
      "Stretch after.",
      "Notice mood change.",
      "The world is part of training."
    ]
  },
  {
    day: 27,
    week: "Week 4 — Pride Phase",
    quest: "Prepare Snake’s repeatable weekly system.",
    cookingTitle: "Build The Food System",
    cookingSteps: [
      "Pick 3 repeat meals.",
      "Pick 2 quick lunches.",
      "Pick 1 comfort meal.",
      "Pick 1 batch meal.",
      "This becomes the next month."
    ],
    workoutTitle: "Build The Training System",
    workoutSteps: [
      "Pick 2 strength days.",
      "Pick 2 walking days.",
      "Pick 1 recovery day.",
      "Pick 1 outside/soul day.",
      "Make it realistic."
    ]
  },
  {
    day: 28,
    week: "Week 4 — Pride Phase",
    quest: "Complete the first IronSnake cycle.",
    cookingTitle: "Cycle Completion Meal",
    cookingSteps: [
      "Cook the best meal from the month.",
      "Make it properly.",
      "Eat with pride.",
      "Write down what changed.",
      "This is not the end. It is the first coil."
    ],
    workoutTitle: "Cycle Test",
    workoutSteps: [
      "Walk 30 minutes.",
      "Test squats.",
      "Test press-ups variation.",
      "Test plank.",
      "Compare honestly to Day 1.",
      "High four."
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
    <strong>${plan.week}</strong>
    <em>Day ${state.currentDay} Quest</em>
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
    <p><strong>${plan.week}</strong></p>
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
    <p><strong>${plan.week}</strong></p>
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
