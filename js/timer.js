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

decreaseBtn.addEventListener('click', decreaseTime);
increaseBtn.addEventListener('click', increaseTime);

function decreaseTime(){
    // if it's less than 15, stop
    if(timeSelected == 15 ) return;
    timeSelected -= 15;
    timeSelectedDiv.innerHTML = timeSelected;
    // timerMinutes.innerHTML = timeSelected + '<span>min</min>';
    getTime();
}
function increaseTime(){
    if(timeSelected == 240) return;
    timeSelected += 15;
    timeSelectedDiv.innerHTML = timeSelected;
    // timerMinutes.innerHTML = timeSelected + '<span>min</min>';
    getTime();
}

let count = timeSelected * 60;
let startingtime = timeSelected; // time to reference overall time
let interval;

let intervalBreak;

function countdown(){
    let halfwayPoint = Math.floor(timeSelected*60/2);
    console.log('HALFWAY:',halfwayPoint)
    console.log("COUNT:",count);
    if(count >= 0){
        // count--; // test
        // count-=600; // test
        count-=10; // test

        let minutes = Math.floor(count / 60);
        let seconds = count % 60;
        console.log(minutes, seconds);
        // update values
        timerMinutes.innerHTML = minutes + '<span>min</span>';
    
        // display stroke
        if(minutes < 0){
            timerMinutes.innerHTML = 0 + '<span>min</span>';
            console.log("done");
            createNotification("Focus session done", {
                body: "Well done, you've just finished a session",
                icon: icon,
                sound: sound
            });
            stopTimer();
            return;
        };
        if(count == halfwayPoint){
            console.log("BREAK TIME");
            clearInterval(interval, countdown);// stop at half
            intervalBreak = setInterval(countdownBreak, 1000); // TEST
        }
        // timerCircle.style.strokeDashoffset = -(440 - (440*minutes)/60);
        const percent = (minutes/startingtime)*100;
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
        // count--; // test
        breakCount-=10; // test

        let minutes = Math.floor(breakCount / 60);
        let seconds = breakCount % 60;
        console.log(minutes, seconds);
        // update values
        
        if(seconds != 0){
            timerMinutes.innerHTML = minutes + ':' + seconds;
        }else{
            timerMinutes.innerHTML = minutes + '<span>min</span>'
        }

       
        if(minutes < 0){
            timerMinutes.innerHTML = 0 + '<span>min</span>';
            console.log("done");
        };
        const percent = ((minutes/60) / breakTime*60)*100;
        console.log(percent,"%");
        const offset = circumference - (percent / 100) * circumference;
        timerCircle.style.strokeDashoffset = offset;
    }else{
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
    // interval = setInterval(countdown, 1000); // start countdown
    interval = setInterval(countdown, 1); // TEST
    // display stopbtn & hide startbtn
    stopBtn.classList.remove('inactive');
    startBtn.classList.add('inactive');
    // hide time selection
    timeSelection.classList.add('inactive');
}

function stopTimer(){
    clearInterval(interval, countdown); // stop countdown
    // stop break countdown
    //(if it's on break when pressed);
    clearInterval(intervalBreak, countdownBreak); 

    // display startbtn
    startBtn.classList.remove('inactive');
    stopBtn.classList.add('inactive');
    // display time selection
    timeSelection.classList.remove('inactive');
    resetTimer();
}

function resetTimer(){
    timerMinutes.innerHTML = startingtime + '<span>min</span>';
    count = startingtime*60; // reset count to starting time
    timerCircle.style.strokeDashoffset = 0; // reset progress line
}

