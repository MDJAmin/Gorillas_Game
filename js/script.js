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