let health = 100;
let sanity = 100;
let inventory = [];

const storyEl = document.getElementById("story");
const choicesEl = document.getElementById("choices");
const imageEl = document.getElementById("scene-image");
const overlay = document.getElementById("analog-overlay");

const whisperSounds = [
  document.getElementById("whisper1"),
  document.getElementById("whisper2")
];

const locations = {
  forest: {
    image: "images/forest.jpg",
    text: "The forest hums with a signal only you can hear.",
    choices: [
      { text: "Follow the sound", sanity: -10 },
      { text: "Collect strange soil", item: "Black Soil" }
    ]
  },
  hospital: {
    image: "images/hospital.jpg",
    text: "The hospital lights flicker. Someone is breathing behind you.",
    choices: [
      { text: "Talk to the Shadow Nurse", npc: true },
      { text: "Search the morgue", sanity: -15, item: "Old Key" }
    ]
  },
  tower: {
    image: "images/forest.jpg",
    text: "The signal is strongest here.",
    choices: [
      { text: "Broadcast yourself", ending: true },
      { text: "Destroy the equipment", ending: true }
    ]
  }
};

function goLocation(loc) {
  playClick();
  const l = locations[loc];
  imageEl.src = l.image;
  storyEl.textContent = l.text;
  choicesEl.innerHTML = "";

  l.choices.forEach(choice => {
    const btn = document.createElement("button");
    btn.className = "choice";
    btn.textContent = choice.text;
    btn.onclick = () => handleChoice(choice);
    choicesEl.appendChild(btn);
  });
}

function handleChoice(choice) {
  if (choice.sanity) sanity += choice.sanity;
  if (choice.health) health += choice.health;
  if (choice.item) inventory.push(choice.item);

  updateStats();

  if (choice.npc) npcDialogue();
  if (choice.ending) triggerEnding();
}

function npcDialogue() {
  storyEl.textContent = "NPC: 'You already died once. This is just the echo.'";
  sanity -= 10;
  updateStats();
}

function updateStats() {
  document.getElementById("health").textContent = health;
  document.getElementById("sanity").textContent = sanity;
  document.getElementById("inventory").textContent = inventory.join(", ");

  if (sanity <= 40) {
    overlay.style.opacity = 0.2;
    document.body.classList.add("low-sanity");
    playWhisper();
  }

  if (sanity <= 0 || health <= 0) triggerEnding(true);
}

function playClick() {
  document.getElementById("clickSound").play();
}

function playWhisper() {
  whisperSounds[Math.floor(Math.random()*whisperSounds.length)].play();
}
const endings = Array.from({ length: 60 }, (_, i) => ({
  title: `ENDING ${i+1}`,
  text: [
    "You become part of the signal.",
    "The signal wears your face.",
    "You escape, but the broadcast continues.",
    "They were using you to tune reality.",
    "Your voice replaces the static."
  ][i % 5]
}));

function triggerEnding(death = false) {
  const ending = endings[Math.floor(Math.random() * endings.length)];
  storyEl.innerHTML = `<h2>${ending.title}</h2><p>${ending.text}</p>`;
  choicesEl.innerHTML = "<button onclick='location.reload()'>Restart</button>";
  overlay.style.opacity = 0.4;
}
