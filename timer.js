const timerCircle = document.querySelector('circle.mm');
const timerMinutes = document.querySelector('.minutes');
const radius = timerCircle.r.baseVal.value;
const circumference = 2 * radius * Math.PI;

const stopBtn = document.querySelector('.stop-btn');
const startBtn = document.querySelector('.start-btn');

const decreaseBtn = document.querySelector('.decrease-btn');
const increaseBtn = document.querySelector('.increase-btn');
const timeSelectedDiv = document.querySelector('.time-selected');

// active time selected
let timeSelected = parseInt(timeSelectedDiv.innerHTML); 

decreaseBtn.addEventListener('click', decreaseTime);
increaseBtn.addEventListener('click', increaseTime);

function decreaseTime(){
    // if it's less than 15, stop
    if(timeSelected == 15 ) return;
    timeSelected -= 15;
    timeSelectedDiv.innerHTML = timeSelected;
    // timerMinutes.innerHTML = timeSelected + '<span>mins</min>';
}
function increaseTime(){
    if(timeSelected == 240) return;
    timeSelected += 15;
    timeSelectedDiv.innerHTML = timeSelected;
    // timerMinutes.innerHTML = timeSelected + '<span>mins</min>';
}

let count = 7200;
let startingtime = count/60; // time to reference overall time


function countdown(){
    // count = timeSelected*60;
    if(count >= 0){
        // count--; // test
        count-=600; // test
        let minutes = Math.floor(count / 60);
        let seconds = count % 60;
        console.log(minutes, seconds);
        // update values
        timerMinutes.innerHTML = minutes + '<span>mins</min>';
    
        // display stroke
        if(minutes < 0){
            timerMinutes.innerHTML = 0 + '<span>mins</min>';
            console.log("done");
            return;
        };
        // timerCircle.style.strokeDashoffset = -(440 - (440*minutes)/60);
        const percent = (minutes/startingtime)*100;
        const offset = circumference - (percent / 100) * circumference;
        console.log(percent + '%', offset);
        timerCircle.style.strokeDashoffset = offset;
        console.log(timerCircle.style.strokeDashoffset);
    }
}


let interval = setInterval(countdown, 1000);


// stopBtn.addEventListener('click', stopTimer);
// startBtn.addEventListener('click', startTimer);

