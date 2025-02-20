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

