"use strict";

const videoElem = document.getElementById("video");
const logElem = document.getElementById("log");
const startElem = document.getElementById("start");
const stopElem = document.getElementById("stop");

// timer
const timeDisplay = document.querySelector("#timeDisplay");
const startBtn = document.querySelector("#startBtn");
const pauseBtn = document.querySelector("#pauseBtn");
const resetBtn = document.querySelector("#resetBtn");

// timer
let startTime = 0;
let elapsedTime = 0;
let currentTime = 0;
let paused = true;
let intervalId;
let hrs = 0;
let mins = 0;
let secs = 0;

// Options for getDisplayMedia()

var displayMediaOptions = {
  video: {
    cursor: "always"
  },
  audio: false
};

// Set event listeners for the start and stop buttons
startElem.addEventListener("click", function (evt) {
  startCapture();
}, false);

stopElem.addEventListener("click", function (evt) {
  stopCapture();
}, false);

// timer
startBtn.addEventListener("click", () => {
  if(paused){
    paused = false;
    startTime = Date.now() - elapsedTime;
    intervalId = setInterval(updateTime,75); 
  }
});
pauseBtn.addEventListener("click", () => {
  if(!paused){
    paused = true;
    elapsedTime = Date.now() - startTime
    clearInterval(intervalId);
  }
});
resetBtn.addEventListener("click", () => {
  paused =true;
  clearInterval(intervalId);
  startTime = 0;
  elapsedTime = 0;
  currentTime = 0;
  hrs = 0;
  mins = 0;
  secs = 0;
  timeDisplay.textContent = "00:00:00"
});

console.log = msg => logElem.innerHTML += `${msg}<br>`;
console.error = msg => logElem.innerHTML += `<span class="error">${msg}</span><br>`;
console.warn = msg => logElem.innerHTML += `<span class="warn">${msg}<span><br>`;
console.info = msg => logElem.innerHTML += `<span class="info">${msg}</span><br>`;

async function startCapture() {
  logElem.innerHTML = "";

  try {
    videoElem.srcObject = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
    dumpOptionsInfo();
  } catch (err) {
    console.error("Error: " + err);
  }
}

function stopCapture(evt) {
  let tracks = videoElem.srcObject.getTracks();

  tracks.forEach(track => track.stop());
  videoElem.srcObject = null;
}

function dumpOptionsInfo() {
  const videoTrack = videoElem.srcObject.getVideoTracks()[0];

  console.info("Track settings:");
  console.info(JSON.stringify(videoTrack.getSettings(), null, 2));
  console.info("Track constraints:");
  console.info(JSON.stringify(videoTrack.getConstraints(), null, 2));
}

// timer
function updateTime(){
  elapsedTime = Date.now() - startTime;

  secs = Math.floor((elapsedTime/1000)%60);
  mins = Math.floor((elapsedTime/(1000*60))%60);
  hrs = Math.floor((elapsedTime/(1000*60*60))%60);

  secs = pad(secs);
  mins = pad(mins);
  hrs = pad(hrs);
  timeDisplay.textContent = `${hrs}:${mins}:${secs}`;


  function pad(unit){
    return (("0") + unit).length > 2 ? unit : "0" + unit;
  }
}