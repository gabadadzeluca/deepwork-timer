const timerCircle = document.querySelector('circle.mm');
const timerMinutes = document.querySelector('.minutes');



let count = 3600;


function countdown(){
    if(count >= 0){
        count-=600; // test
        let minutes = Math.floor(count / 60);
        let seconds = count % 60;
        console.log(minutes, seconds);
        // update values
        timerMinutes.innerHTML = minutes;
    
        // display stroke
        if(minutes < 0){
            timerMinutes.innerHTML = 0;
            console.log("done");
            return;
        };
        timerCircle.style.strokeDashoffset = -(440 - (440*minutes)/60);
    }
}

setInterval(countdown, 1000);
