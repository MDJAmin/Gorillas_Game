"use strict"

// State's 

let state = {};

let isDragging = false;
let dragStartX = undefined
let dragStartY = undefined

let previousAnimationTimestamp = undefined;
let animationFrameRequestID = undefined;
let delayTimeoutID = undefined;

let simulationMode = false;
let simulationImpact = {};


// Settings
const settings = {
    numberOfPlayers: 1,
    // if value of numberOfPlayers is 0 it mean that two computers are playing against each other
    mode: "light",
  };


  const blastHoleRadius = 18;

// The main canvas element and its draw context
const canvas = document.querySelector("#game");
canvas.width = window.innerWidth * window.devicePixelRatio;
canvas.height = window.innerHeight * window.devicePixelRatio;
canvas.style.width = window.innerWidth + "px";
canvas.style.height = window.innerHeight + "px";
const ctx = canvas.getContext("2d");

// Windmill elements
const windmillDOM = document.querySelector("#windmill");
const windmillHeadDOM = document.querySelector("#windmill-head");
const windInfoDOM = document.querySelector("#wind-info");
const windSpeedDOM = document.querySelector("#wind-speed");

// Left info panel
const info1DOM = document.querySelector("#info-left");
const name1DOM = document.querySelector("#info-left .name");
const angle1DOM = document.querySelector("#info-left .angle");
const velocity1DOM = document.querySelector("#info-left .velocity");

// Right info panel
const info2DOM = document.querySelector("#info-right");
const name2DOM = document.querySelector("#info-right .name");
const angle2DOM = document.querySelector("#info-right .angle");
const velocity2DOM = document.querySelector("#info-right .velocity");

// Instructions panel
const instructionsDOM = document.querySelector("#instructions");
const gameModeDOM = document.querySelector("#game-mode");

// The bomb's grab area
const bombGrabAreaDOM = document.querySelector("#bomb-grab-area");

// Congratulations panel
const congratulationsDOM = document.querySelector("#congratulations");
const winnerDOM = document.querySelector("#winner");

// Settings toolbar
const settingsDOM = document.querySelector("#settings");
const singlePlayerButtonDOM = document.querySelectorAll(".single-player");
const twoPlayersButtonDOM = document.querySelectorAll(".two-players");
const autoPlayButtonDOM = document.querySelectorAll(".auto-play");
const colorModeButtonDOM = document.querySelector("#color-mode");


colorModeButtonDOM.addEventListener("click", () => {
  if (settings.mode === "dark") {
    settings.mode = "light";
    colorModeButtonDOM.innerText = "Dark Mode";
  } else {
    settings.mode = "dark";
    colorModeButtonDOM.innerText = "Light Mode";
  }
  draw();
});

newGame();


function newGame() {
  // Reset game state
  state = {
    phase: "aiming", // aiming | in flight | celebrating
    currentPlayer: 1,
    round: 1,
    windSpeed: generateWindSpeed(),
    bomb: {
      x: undefined,
      y: undefined,
      rotation: 0,
      velocity: { x: 0, y: 0 },
      highlight: true,
    },

    // Buildings
    backgroundBuildings: [],
    buildings: [],
    blastHoles: [],

    stars: [],

    scale: 1,
    shift: 0,
  };

  // Generate stars
  for (let i = 0; i < (window.innerWidth * window.innerHeight) / 12000; i++) {
    const x = Math.floor(Math.random() * window.innerWidth);
    const y = Math.floor(Math.random() * window.innerHeight);
    state.stars.push({ x, y });
  }

  // Generate background buildings
  for (let i = 0; i < 17; i++) {
    generateBackgroundBuilding(i);
  }

  // Generate buildings
  for (let i = 0; i < 8; i++) {
    generateBuilding(i);
  }

  calculateScaleAndShift();
  initializeBombPosition();
  initializeWindmillPosition();
  setWindMillRotation();

  // Cancel any ongoing animation and timeout
  cancelAnimationFrame(animationFrameRequestID);
  clearTimeout(delayTimeoutID);

  // Reset HTML elements
  if (settings.numberOfPlayers > 0) {
    showInstructions();
  } else {
    hideInstructions();
  }
  hideCongratulations();
  angle1DOM.innerText = 0;
  velocity1DOM.innerText = 0;
  angle2DOM.innerText = 0;
  velocity2DOM.innerText = 0;

  // Reset simulation mode
  simulationMode = false;
  simulationImpact = {};

  draw();

  if (settings.numberOfPlayers === 0) {
    computerThrow();
  }
}

function showInstructions() {
  singlePlayerButtonDOM.checked = true;
  instructionsDOM.style.opacity = 1;
  instructionsDOM.style.visibility = "visible";
}

function hideInstructions() {
  state.bomb.highlight = false;
  instructionsDOM.style.opacity = 0;
  instructionsDOM.style.visibility = "hidden";
}

function showCongratulations() {
  congratulationsDOM.style.opacity = 1;
  congratulationsDOM.style.visibility = "visible";
}

function hideCongratulations() {
  congratulationsDOM.style.opacity = 0;
  congratulationsDOM.style.visibility = "hidden";
}

function generateBackgroundBuilding(index) {
  const previousBuilding = state.backgroundBuildings[index - 1];

  const x = previousBuilding
    ? previousBuilding.x + previousBuilding.width + 4
    : -300;

  const minWidth = 60;
  const maxWidth = 110;
  const width = minWidth + Math.random() * (maxWidth - minWidth);

  const smallerBuilding = index < 4 || index >= 13;

  const minHeight = 80;
  const maxHeight = 350;
  const smallMinHeight = 20;
  const smallMaxHeight = 150;
  const height = smallerBuilding
    ? smallMinHeight + Math.random() * (smallMaxHeight - smallMinHeight)
    : minHeight + Math.random() * (maxHeight - minHeight);

  state.backgroundBuildings.push({ x, width, height });
}

function generateBuilding(index) {
  const previousBuilding = state.buildings[index - 1];

  const x = previousBuilding
    ? previousBuilding.x + previousBuilding.width + 4
    : 0;

  const minWidth = 80;
  const maxWidth = 130;
  const width = minWidth + Math.random() * (maxWidth - minWidth);

  const smallerBuilding = index <= 1 || index >= 6;

  const minHeight = 40;
  const maxHeight = 300;
  const minHeightGorilla = 30;
  const maxHeightGorilla = 150;

  const height = smallerBuilding
    ? minHeightGorilla + Math.random() * (maxHeightGorilla - minHeightGorilla)
    : minHeight + Math.random() * (maxHeight - minHeight);

  // Generate an array of booleans to show if the light is on or off in a room
  const lightsOn = [];
  for (let i = 0; i < 50; i++) {
    const light = Math.random() <= 0.33 ? true : false;
    lightsOn.push(light);
  }

  state.buildings.push({ x, width, height, lightsOn });
}
