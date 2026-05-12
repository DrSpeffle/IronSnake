const panels = {

  character: {
    title: "Character",
    body:
      "XP, level progression, discipline state and Snake evolution."
  },

  cooking: {
    title: "Cooking Record",
    body:
      "Meals, protein, hydration, calorie control and cooking streaks."
  },

  fitness: {
    title: "Fitness Record",
    body:
      "Walking, conditioning, movement and fitness progression."
  },

  strength: {
    title: "Strength Record",
    body:
      "Lifts, overload tracking and strength milestones."
  },

  mind: {
    title: "Mind",
    body:
      "Mindfulness, calm, emotional control and recovery."
  },

  soul: {
    title: "Soul",
    body:
      "Motorcycle routes, freedom, exploration and social recovery."
  }

};

function showPanel(name) {

  const panel = panels[name];

  document.getElementById("content-panel").innerHTML = `
    <h3>${panel.title}</h3>
    <p>${panel.body}</p>
  `;

}
