"use strict";

import {createNotification} from './notification.js';

const timerCircle = document.querySelector('circle.mm');
const timerMinutes = document.querySelector('.minutes');
const radius = timerCircle.r.baseVal.value;
const circumference = 2 * radius * Math.PI;

const stopBtn = document.querySelector('.stop-btn');
const startBtn = document.querySelector('.start-btn');

// hide the stop btn
stopBtn.classList.add('inactive');

const decreaseBtn = document.querySelector('.decrease-btn');
const increaseBtn = document.querySelector('.increase-btn');
const timeSelectedDiv = document.querySelector('.time-selected');
const timeSelection = document.querySelector('.time-select'); // parent div of the above

const sound = '../assets/alarm.mp3'; // notification sound
const icon = '../assets/alarm-clock.png'; // alarm icon

// active time selected
let timeSelected = parseInt(timeSelectedDiv.innerHTML); 

// variable for mode change 
let activeMode = 'deepWork';

decreaseBtn.addEventListener('click', decreaseTime);
increaseBtn.addEventListener('click', increaseTime);

function decreaseTime(){
    timeSelected = parseInt(timeSelectedDiv.innerHTML);
    // if it's less than 15, stop
    if(activeMode == 'deepWork'){
        if(timeSelected == 15 ) return;
        timeSelected -= 15;
    }else{
        if(timeSelected == 5) return;
        timeSelected -= 5;
    }

    timeSelectedDiv.innerHTML = timeSelected;
    getTime();
}

function increaseTime(){
    timeSelected = parseInt(timeSelectedDiv.innerHTML)
    if(activeMode == 'deepWork'){
        if(timeSelected == 240 ) return;
        timeSelected += 15;
    }else{
        if(timeSelected == 60) return;
        timeSelected += 5;
    }
   
    timeSelectedDiv.innerHTML = timeSelected;
    getTime();
}

let count = timeSelected * 60;
let startingtime = timeSelected; // time to reference overall time
let interval;

let intervalBreak;

let sessionDuration = localStorage.getItem('sessionDuration') || 0;
if(!localStorage.getItem('sessionDuration')){
    localStorage.setItem('sessionDuration', 0);
}
let streak = localStorage.getItem('streak') || 0;
if(!localStorage.getItem('streak')){
    localStorage.setItem('streak', streak);
}

// display user's progress
displayProgress();
displayMode(activeMode);

window.addEventListener('resize', ()=>{
    displayMode(activeMode);
});

// display mode
function displayMode(mode){
    const focusTextDivs = document.querySelectorAll('.focus-session');
    const meditationTexts = document.querySelectorAll('.meditation-session');
    if(mode == 'deepWork'){
        focusTextDivs.forEach(div=>{
            div.style.display = 'block';
            if(window.innerWidth >= 900){
                if(div.classList.contains('mobile')){
                    div.style.display = 'none';
                }
            }else{
                if(div.classList.contains('desktop')){
                    div.style.display = 'none';
                }
            }
        });
        meditationTexts.forEach(text=>{
            text.style.display = 'none';
        });
    }else{ // meditation mode
        focusTextDivs.forEach(div=>{
            div.style.display = 'none';
        });
        meditationTexts.forEach(text=>{
            text.style.display = 'block';
            if(window.innerWidth >= 900){
                if(text.classList.contains('mobile')){
                    text.style.display = 'none';
                }
            }else{
                if(text.classList.contains('desktop')){
                    text.style.display = 'none';
                }
            }
        });
    }
}

// this function will set meditation time to 10
// and timer to 60, when switching modes
function switchMode(activeMode){
    if(activeMode == 'deepWork'){
        timeSelectedDiv.innerHTML = 60;
    }else{
        timeSelectedDiv.innerHTML = 10;
    }
    getTime();
}

function countdown(){
    let halfwayPoint = Math.floor(timeSelected*60/2);
    if(count >= 0){
        if(activeMode == 'deepWork'){
            sessionDuration++;
            localStorage.setItem('sessionDuration', sessionDuration); // add to local storage
        }
        count--;

        let minutes = Math.floor(count / 60);
        let seconds = count % 60;
        // update values
        timerMinutes.innerHTML = minutes + '<span>min</span>';
    

        if(minutes<1 && seconds > 0){
            timerMinutes.innerHTML = '0:' + seconds;
            if(seconds<10){
                timerMinutes.innerHTML = '0:0' + seconds;
            }
        }else if(minutes < 0){// display stroke
            timerMinutes.innerHTML = 0 + '<span>min</span>';
            if(activeMode == 'deepWork'){
                createNotification("Focus session done", {
                    body: "Well done, you've just finished a session",
                    icon: icon,
                    sound: sound
                });
            }else{
                createNotification("Meditation session done", {
                    body: "Well done, you've just finished a session",
                    icon: icon,
                    sound: sound
                });
            }
           
            stopTimer();
        }else{
            timerMinutes.innerHTML = minutes + '<span>min</span>'
        }

        if(count == halfwayPoint && startingtime > 30){
            clearInterval(interval, countdown);// stop at half
            // display break over notification
            createNotification("Half of the session done", {
                body: "Well done, now you have a 5 minute break",
                icon: icon,
                sound: sound
            });
            intervalBreak = setInterval(countdownBreak, 1000);
        }
        const percent = (count/60) /startingtime *100;
        const offset = circumference - (percent / 100) * circumference;
        timerCircle.style.strokeDashoffset = offset;
    }else{
        clearInterval(interval, countdown); // stop the function
    }
}

const breakTime = 5; // minutes
let breakCount = breakTime * 60;
// timer for 5 minutes, then return to the timer countdown

function countdownBreak(){
    if(breakCount > 0){
        breakCount--;

        let minutes = Math.floor(breakCount / 60);
        let seconds = breakCount % 60;
        
        if(seconds != 0){
            timerMinutes.innerHTML = minutes + ':' + seconds;
        }else if(minutes<1 && seconds > 0){
            timerMinutes.innerHTML = '0:' + seconds;
            if(seconds<10){
                timerMinutes.innerHTML = '0:0' + seconds;
            }
        }else{
            timerMinutes.innerHTML = minutes + '<span>min</span>'
        }
       
        if(minutes < 0){
            timerMinutes.innerHTML = 0 + '<span>min</span>';
        };
        const percent = (breakCount /  (breakTime * 60)) * 100;
        const offset = circumference - (percent / 100) * circumference;
        timerCircle.style.strokeDashoffset = offset;
    }else{
        createNotification("Break over", {
            body: "Start the second part of the session",
            icon: icon,
            sound: sound
        });
        clearInterval(intervalBreak, countdownBreak);
        interval = setInterval(countdown, 1000);
    }
}


function getTime(){
    const time = timeSelectedDiv.innerHTML;
    count = time * 60;
    startingtime = time;
    // display in timer itself
    timerMinutes.innerHTML = time + '<span>min</min>';
}


startBtn.addEventListener('click', startTimer);
stopBtn.addEventListener('click', stopTimer);

function startTimer(){
    // update last session
    interval = setInterval(countdown, 1000); // start countdown
    // display stopbtn & hide startbtn
    stopBtn.classList.remove('inactive');
    startBtn.classList.add('inactive');
    // hide time selection
    timeSelection.classList.add('inactive');

    // remove event listeners
    meditationBtn.removeEventListener('click', toggleMode);
    deepWorkBtn.removeEventListener('click', toggleMode);
}

function stopTimer(){
    clearInterval(interval, countdown); // stop countdown
    // stop break countdown
    clearInterval(intervalBreak, countdownBreak); 

    // display startbtn
    startBtn.classList.remove('inactive');
    stopBtn.classList.add('inactive');
    // display time selection
    timeSelection.classList.remove('inactive');
    // re-enable event listeners 
    deepWorkBtn.addEventListener('click', toggleMode);
    meditationBtn.addEventListener('click', toggleMode);

    resetTimer();
    // update local storage
    localStorage.setItem('sessionDuration', sessionDuration);
    displayProgress();
}

function resetTimer(){
    timerMinutes.innerHTML = startingtime + '<span>min</span>';
    count = startingtime*60; // reset count to starting time
    timerCircle.style.strokeDashoffset = 0; // reset progress line
}

function displayProgress(){
    const seconds = localStorage.getItem('sessionDuration'); // seconds
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const completed = document.querySelector('.completed');
    completed.innerHTML = `${hours} hours, ${minutes} minutes`;
    // display streak
    document.querySelector('.streak').innerHTML = localStorage.getItem('streak');
}

const deepWorkBtn = document.querySelector('.deep-work-mode');
const meditationBtn = document.querySelector('.meditation-mode');

deepWorkBtn.addEventListener('click', toggleMode);
meditationBtn.addEventListener('click', toggleMode);

function toggleMode(){ 
    [...this.parentElement.children].forEach(element=>{
        element.classList.remove('mode-picked');
    });
    this.classList.add('mode-picked');
    activeMode = this.classList.contains('deep-work-mode') ? 'deepWork' : 'meditation';
    displayMode(activeMode);
    switchMode(activeMode);
}

function updateStreak() {
    let today = new Date();
    let lastUse = localStorage.getItem("lastUse");
    let lastUpdate = localStorage.getItem("lastUpdate");
    let streak = localStorage.getItem("streak");
  
    if (!lastUse) {
      lastUse = today;
      streak = 1;
    }
  
    if (!lastUpdate || (today.toDateString() !== new Date(lastUpdate).toDateString())) {
      let diff = (today - new Date(lastUse)) / (1000 * 60 * 60 * 24);
      if (diff >= 1) {
        streak = 0;
        sessionDuration = 0;
        localStorage.setItem('sessionDuration', sessionDuration); // reset daily streak
      } else if (diff < 1 && sessionDuration >= 15*60) {
        sessionDuration = 0;
        localStorage.setItem('sessionDuration', sessionDuration);
        streak++;
      }
      localStorage.setItem("lastUpdate", today);
    }
  
    localStorage.setItem("lastUse", today);
    localStorage.setItem("streak", streak);
  
    console.log("Current streak: " + streak);
    displayProgress();
}
  
// Check and update streak every time the app is opened
window.addEventListener("load", function() {
    updateStreak();
});