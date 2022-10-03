// this javascript is used to add additional functionality to the Code Radio application

// adding a click event listener for each code radio button
const classic_audio = document.getElementById('btn-classic');
classic_audio.addEventListener("click", play_classic);

const ambient_audio = document.getElementById('btn-ambient');
ambient_audio.addEventListener("click", play_ambient);

const lofi_audio = document.getElementById('btn-lofi');
lofi_audio.addEventListener("click", play_lofi);

// declare playback variables
var classic_stream = new Audio("./media/trap_and_ink.wav");
var ambient_stream = new Audio("./media/trap_and_ink.wav");
var lofi_stream = new Audio("./media/trap_and_ink.wav");

classic_stream.loop = true;
ambient_stream.loop = true;
lofi_stream.loop = true;

var classic_playing = false;
var ambient_playing = false;
var lofi_playing = false;

function play_classic() {

    ambient_stream.pause();
    ambient_stream.currentTime = 0;

    lofi_stream.pause();
    lofi_stream.currentTime = 0;

    if (!classic_playing){
        // configure audio stream
        classic_stream.play();
        classic_playing = true;

        // toggle button styling
        document.getElementById("btn-classic").classList.add("playing");
        document.getElementById("btn-ambient").classList.remove("playing");
        document.getElementById("btn-lofi").classList.remove("playing");
    
    } else if (classic_playing){
        classic_stream.pause();
        classic_playing = false;
        document.getElementById("btn-classic").classList.remove("playing");
    
    } else {pass;}
}

function play_ambient() {

    classic_stream.pause();
    classic_stream.currentTime = 0;

    lofi_stream.pause();
    lofi_stream.currentTime = 0;

    if (!ambient_playing){
        // configure audio stream
        ambient_stream.play();
        ambient_playing = true;

        // toggle button styling
        document.getElementById("btn-classic").classList.remove("playing");
        document.getElementById("btn-ambient").classList.add("playing");
        document.getElementById("btn-lofi").classList.remove("playing");
    
    } else if (ambient_playing){
        ambient_stream.pause();
        ambient_playing = false;
        document.getElementById("btn-ambient").classList.remove("playing");
    
    } else {pass;}
}

function play_lofi() {

    classic_stream.pause();
    classic_stream.currentTime = 0;

    ambient_stream.pause();
    ambient_stream.currentTime = 0;

    if (!lofi_playing){
        // configure audio stream
        lofi_stream.play();
        lofi_playing = true;
        
        // toggle button styling
        document.getElementById("btn-classic").classList.remove("playing");
        document.getElementById("btn-ambient").classList.remove("playing");
        document.getElementById("btn-lofi").classList.add("playing");
    
    } else if (lofi_playing){
        lofi_stream.pause();
        lofi_playing = false;
        document.getElementById("btn-lofi").classList.remove("playing");
    
    } else {pass;}
}
