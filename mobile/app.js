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
  sleep: 7,

  weight: "",
  mobility: 8,
  feeling: "Unstable but moving.",

  workoutHistory: [],
  dailyRecords: [],
  log: []
};

const sleepLibrary = [
  {
    title: "Wind Down Protocol",
    description:
      "No bright screens 30 minutes before sleep. Dim lights. Slow breathing."
  },

  {
    title: "Cold Dark Room",
    description:
      "Cool room, darkness, quiet environment, no overstimulation."
  },

  {
    title: "No Chaos Before Bed",
    description:
      "Avoid arguments, doomscrolling, or stress loops before sleeping."
  },

  {
    title: "Hydrate Early",
    description:
      "Drink enough water through the day so you are not dehydrated at night."
  },

  {
    title: "Consistent Sleep Time",
    description:
      "Going to sleep at roughly the same time matters more than perfection."
  },

  {
    title: "Recovery Mindset",
    description:
      "Sleep is not weakness. It is biological reconstruction."
  }
];

const recipes = [
  {
    id: "catalunyan-casserole",
    title: "Catalunyan Casserole",
    image: "/assets/images/cooking/catalunyan-casserole.png",
    ingredients: [
      "Potatoes",
      "Chorizo",
      "Pork belly",
      "Onion",
      "Garlic",
      "Peppers",
      "Green beans",
      "Broccoli"
    ],
    method: [
      "Boil chopped potatoes until soft.",
      "Fry onion, garlic, chorizo, and pork belly.",
      "Add peppers, green beans, and broccoli.",
      "Mix potatoes through the pan.",
      "Season and simmer until rich."
    ]
  },

  {
    id: "beef-stroganoff",
    title: "Beef Stroganoff",
    image: "/assets/images/cooking/beef-stroganoff.png",
    ingredients: [
      "Beef strips",
      "Onion",
      "Mushrooms",
      "Garlic",
      "Paprika",
      "Cream",
      "Rice or pasta"
    ],
    method: [
      "Fry onion, garlic, and mushrooms.",
      "Add beef strips and brown them.",
      "Add paprika, salt, and pepper.",
      "Stir in cream and simmer gently.",
      "Serve with rice or pasta."
    ]
  },

  {
    id: "chicken-parmigiana",
    title: "Chicken Parmigiana",
    image: "/assets/images/cooking/chicken-parmigiana.png",
    ingredients: [
      "Chicken breast",
      "Tomato sauce",
      "Cheese",
      "Breadcrumbs"
    ],
    method: [
      "Flatten chicken slightly.",
      "Coat with breadcrumbs if wanted.",
      "Bake or fry until cooked.",
      "Top with tomato sauce and cheese.",
      "Serve with potatoes or salad."
    ]
  },

  {
    id: "lasagna",
    title: "Lasagna",
    image: "/assets/images/cooking/lasagna.png",
    ingredients: [
      "Mince",
      "Onion",
      "Garlic",
      "Tomato sauce",
      "Pasta sheets",
      "Cheese sauce"
    ],
    method: [
      "Cook mince with onion and garlic.",
      "Add tomato sauce and simmer.",
      "Layer meat sauce, pasta sheets, and cheese sauce.",
      "Top with cheese.",
      "Bake until golden."
    ]
  }
];

const workoutLibrary = [
  {
    title: "Wake The Body",
    focus: "Beginner movement",
    steps: [
      "10 minute walk",
      "5 squats",
      "5 wall press-ups",
      "Shoulder stretch",
      "Stop before failure"
    ]
  },

  {
    title: "Beginner Strength",
    focus: "Strength foundation",
    steps: [
      "3 rounds of squats",
      "3 rounds of press-ups",
      "3 rounds of plank",
      "Controlled breathing",
      "Finish with water"
    ]
  },

  {
    title: "Mobility Reset",
    focus: "Recovery",
    steps: [
      "Hip mobility",
      "Shoulder circles",
      "Back stretch",
      "Breathing",
      "Slow walking"
    ]
  },

  {
    title: "Road Conditioning",
    focus: "Outdoor movement",
    steps: [
      "20 minute walk",
      "Find hills or stairs",
      "Do not sprint",
      "Steady breathing",
      "Recovery stretch"
    ]
  }
];

const mindLibrary = [
  {
    title: "2 Minute Reset",
    description:
      "Sit still for 2 minutes. Breathe in 4 seconds, out 6 seconds."
  },

  {
    title: "Anger Reset",
    description:
      "Walk away. Breathe. Slow the nervous system before speaking."
  },

  {
    title: "Bad Day Protocol",
    description:
      "Shower. Water. Walk. One good meal. Early sleep. No self-destruction."
  },

  {
    title: "Craving Control",
    description:
      "Delay impulse for 10 minutes. Drink water. Move body first."
  },

  {
    title: "Confidence Reminder",
    description:
      "You are rebuilding, not punishing yourself."
  }
];

let state = loadState();

function loadState() {

  const saved =
    localStorage.getItem(STORAGE_KEY);

  return saved
    ? { ...defaultState, ...JSON.parse(saved) }
    : { ...defaultState };
}

function saveState() {

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(state)
  );
}

function getOverallScore() {

  return Math.round(
    (
      state.nutrition +
      state.fitness +
      state.strength +
      state.mind +
      state.sleep
    ) / 5
  );
}

function updateHeader() {

  const overall =
    getOverallScore();

  document.getElementById(
    "overall-score"
  ).innerText =
    overall + "%";

  document.getElementById(
    "overall-fill"
  ).style.width =
    overall + "%";

  document.getElementById(
    "current-quest"
  ).innerHTML = `

    <strong>
      Week 1 — Wake The Snake
    </strong>

    <em>
      Day ${state.currentDay}
    </em>

    <span>
      ${
        state.completedToday
          ? "✓ Done"
          : "Rebuild the system slowly and consistently."
      }
    </span>

    ${
      state.completedToday
        ? `
          <button onclick="nextDay()">
            Next Day
          </button>
        `
        : `
          <button onclick="showRecordToday()">
            Record Today
          </button>
        `
    }

  `;
}

function recordAction(type) {

  state.completedToday = true;

  state.xp += 25;

  state.level =
    Math.floor(state.xp / 100) + 1;

  state.nutrition =
    Math.min(100, state.nutrition + 4);

  state.fitness =
    Math.min(100, state.fitness + 3);

  state.strength =
    Math.min(100, state.strength + 3);

  state.mind =
    Math.min(100, state.mind + 2);

  state.sleep =
    Math.min(100, state.sleep + 2);

  const entry = {
    day: state.currentDay,
    date: new Date().toLocaleDateString(),
    type,
    xp: 25
  };

  state.dailyRecords.unshift(entry);

  state.dailyRecords =
    state.dailyRecords.slice(0, 40);

  saveState();

  showPage("home");
}

function nextDay() {

  state.currentDay += 1;

  state.completedToday = false;

  saveState();

  showPage("home");
}

function updateLibraryField(
  field,
  value
) {

  state[field] = value;

  saveState();

  renderLibrary();
}

function getEvolutionRank() {

  const score =
    getOverallScore();

  if (score >= 80)
    return "Iron Serpent";

  if (score >= 60)
    return "Coiled Fighter";

  if (score >= 40)
    return "Rising Snake";

  if (score >= 20)
    return "Awakening Snake";

  return "Dormant Snake";
}

function getPortraitPath() {

  const score =
    getOverallScore();

  if (score >= 80)
    return "/assets/images/snake_portrait_level_4.png";

  if (score >= 60)
    return "/assets/images/snake_portrait_level_3.png";

  if (score >= 40)
    return "/assets/images/snake_portrait_level_2.png";

  return "/assets/images/snake_portrait_level_1.png";
}

function setActiveNav(page) {

  [
    "home",
    "library",
    "cooking",
    "workouts",
    "mind",
    "sleep"
  ].forEach(item => {

    const button =
      document.getElementById(
        `nav-${item}`
      );

    if (!button) return;

    button.classList.toggle(
      "active",
      item === page
    );

  });
}

function renderHome() {

  const xpIntoLevel =
    state.xp % 100;

  document.getElementById(
    "content-panel"
  ).innerHTML = `

    <div class="character-portrait-wrapper">

      <img
        class="character-portrait"
        src="${getPortraitPath()}">

      <div class="character-aura"></div>

    </div>

    <h3>Snake</h3>

    <div class="home-grid">

      <div>
        <strong>Level</strong>
        <span>${state.level}</span>
      </div>

      <div>
        <strong>XP</strong>
        <span>${state.xp}</span>
      </div>

      <div>
        <strong>Evolution</strong>
        <span>${getEvolutionRank()}</span>
      </div>

      <div>
        <strong>Day</strong>
        <span>${state.currentDay}</span>
      </div>

    </div>

    <div class="xp-bar">

      <div
        class="xp-fill"
        style="width:${xpIntoLevel}%">
      </div>

    </div>

  `;
}

function renderLibrary() {

  const delta =
    getOverallScore() - 9;

  const records =
    state.dailyRecords.length

      ? state.dailyRecords.map(item => `

          <div class="history-card">

            <strong>
              ${item.type}
            </strong>

            <span>
              Day ${item.day}
            </span>

            <span>
              ${item.date}
            </span>

            <span>
              +${item.xp} XP
            </span>

          </div>

        `).join("")

      : `
          <p>
            No records yet.
          </p>
        `;

  document.getElementById(
    "content-panel"
  ).innerHTML = `

    <h3>Library</h3>

    <div class="library-stat">

      <strong>
        Delta Development
      </strong>

      <span>
        ${
          delta >= 0
            ? "+"
            : ""
        }${delta}%
      </span>

    </div>

    <label class="input-label">
      Weight
    </label>

    <input
      class="track-input"
      value="${state.weight}"
      placeholder="e.g. 15.8 st"
      onchange="
        updateLibraryField(
          'weight',
          this.value
        )">

    <label class="input-label">
      Overall Feeling
    </label>

    <textarea
      class="track-input track-area"
      onchange="
        updateLibraryField(
          'feeling',
          this.value
        )">${state.feeling}</textarea>

    <h4>
      Archive
    </h4>

    ${records}

  `;
}

function renderCooking() {

  const cards =
    recipes.map(recipe => `

      <button
        class="recipe-card"
        onclick="
          renderRecipe(
            '${recipe.id}'
          )">

        <img
          src="${recipe.image}"
          alt="${recipe.title}">

        <span>
          ${recipe.title}
        </span>

      </button>

    `).join("");

  document.getElementById(
    "content-panel"
  ).innerHTML = `

    <h3>Cooking</h3>

    <div class="recipe-grid">

      ${cards}

    </div>

  `;
}

function renderRecipe(id) {

  const recipe =
    recipes.find(
      item => item.id === id
    );

  if (!recipe) {
    showPage("cooking");
    return;
  }

  document.getElementById(
    "content-panel"
  ).innerHTML = `

    <button
      class="back-button"
      onclick="
        showPage('cooking')
      ">

      ← Back

    </button>

    <div class="recipe-detail-image-wrap">

      <img
        class="recipe-detail-image"
        src="${recipe.image}"
        alt="${recipe.title}">

    </div>

    <h3>
      ${recipe.title}
    </h3>

    <h4>Ingredients</h4>

    <ul class="instruction-list">

      ${
        recipe.ingredients
          .map(item => `
            <li>${item}</li>
          `)
          .join("")
      }

    </ul>

    <h4>Method</h4>

    <ol class="instruction-list">

      ${
        recipe.method
          .map(step => `
            <li>${step}</li>
          `)
          .join("")
      }

    </ol>

  `;
}

function renderWorkouts() {

  const cards =
    workoutLibrary.map(workout => `

      <div class="task-card">

        <strong>
          ${workout.title}
        </strong>

        <span>
          ${workout.focus}
        </span>

        <ul class="instruction-list">

          ${
            workout.steps
              .map(step => `
                <li>${step}</li>
              `)
              .join("")
          }

        </ul>

      </div>

    `).join("");

  document.getElementById(
    "content-panel"
  ).innerHTML = `

    <h3>Workouts</h3>

    ${cards}

  `;
}

function renderMind() {

  const cards =
    mindLibrary.map(item => `

      <div class="task-card">

        <strong>
          ${item.title}
        </strong>

        <span>
          ${item.description}
        </span>

      </div>

    `).join("");

  document.getElementById(
    "content-panel"
  ).innerHTML = `

    <h3>Mind</h3>

    ${cards}

  `;
}

function renderSleep() {

  const cards =
    sleepLibrary.map(item => `

      <div class="task-card">

        <strong>
          ${item.title}
        </strong>

        <span>
          ${item.description}
        </span>

        <button onclick="
          recordAction(
            'Sleep: ${item.title}'
          )">

          Tick Sleep Done

        </button>

      </div>

    `).join("");

  document.getElementById(
    "content-panel"
  ).innerHTML = `

    <h3>Sleep</h3>

    ${cards}

  `;
}

function showRecordToday() {

  document.getElementById(
    "content-panel"
  ).innerHTML = `

    <h3>
      Record Today
    </h3>

    <div class="record-grid">

      <button onclick="
        recordAction(
          'Full Daily Quest'
        )">

        Full Daily Quest

      </button>

      <button onclick="
        recordAction(
          'Cooking'
        )">

        Cooking

      </button>

      <button onclick="
        recordAction(
          'Workout'
        )">

        Workout

      </button>

      <button onclick="
        recordAction(
          'Mind Reset'
        )">

        Mind

      </button>

      <button onclick="
        recordAction(
          'Sleep'
        )">

        Sleep

      </button>

    </div>

  `;
}

function showPage(page) {

  setActiveNav(page);

  updateHeader();

  if (page === "home")
    return renderHome();

  if (page === "library")
    return renderLibrary();

  if (page === "cooking")
    return renderCooking();

  if (page === "workouts")
    return renderWorkouts();

  if (page === "mind")
    return renderMind();

  if (page === "sleep")
    return renderSleep();
}

function createEmbers() {

  const emberContainer =
    document.getElementById(
      "embers"
    );

  if (
    !emberContainer ||
    emberContainer.children.length
  ) return;

  for (let i = 0; i < 24; i++) {

    const ember =
      document.createElement("div");

    ember.className = "ember";

    ember.style.left =
      Math.random() * 100 + "%";

    ember.style.animationDuration =
      (6 + Math.random() * 8) + "s";

    ember.style.animationDelay =
      Math.random() * 8 + "s";

    ember.style.opacity =
      0.2 + Math.random() * 0.8;

    emberContainer.appendChild(
      ember
    );
  }
}

createEmbers();

showPage("home");
