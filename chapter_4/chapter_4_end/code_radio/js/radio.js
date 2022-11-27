// this javascript is used to add additional functionality to the Code Radio application


// IndexedDB
// retrieving music files

var database = "music_database";
var object_store = "music_files";

/////////////////////////////////////
function getData(song) {
    // open a read/write db transaction, ready for retrieving the data
    const transaction = db.transaction([object_store]);

    // create an object store on the transaction
    const objectStore = transaction.objectStore(object_store);

    // Make a request to get a record by key from the object store
    const objectStoreRequest = objectStore.get(song);

    // Make a request to get a record by key from the object store
    objectStoreRequest.onsuccess = (event) => {
        const myRecord = objectStoreRequest.result;
        console.log(`${myRecord.url}`);
        const audioURL = document.createElement("audio");
        audioURL.src = myRecord.url;
        audioURL.loop = true;
    };
};
/////////////////////////////////////



// adding a click event listener for each code radio button
const classic_audio = document.getElementById('btn-classic');
classic_audio.addEventListener("click", play_classic);

const ambient_audio = document.getElementById('btn-ambient');
ambient_audio.addEventListener("click", play_ambient);

const lofi_audio = document.getElementById('btn-lofi');
lofi_audio.addEventListener("click", play_lofi);

// declare playback variables
// var classic_stream = new Audio("./media/trap_and_ink.wav");
// var ambient_stream = new Audio("./media/trap_and_ink.wav");
// var lofi_stream = new Audio("./media/trap_and_ink.wav");

var classic_playing = false;
var ambient_playing = false;
var lofi_playing = false;

function play_classic() {
    // classic_stream.loop = true;

    // ambient_stream.pause();
    // ambient_stream.currentTime = 0;

    // lofi_stream.pause();
    // lofi_stream.currentTime = 0;

    /////////////////////////////////////
    // Let us open our database
    const DBOpenRequest = window.indexedDB.open(database, 1);
    DBOpenRequest.onsuccess = (event) => {
        db = DBOpenRequest.result;
        // Run the getData() function to get the data from the database
        getData("trap and ink");
    };
    /////////////////////////////////////

    audioURL.pause(); /////////////////////////////////////
    audioURL.currentTime = 0; /////////////////////////////////////

    if (!classic_playing){

        // classic_stream.play();
        audioURL.play(); /////////////////////////////////////
        classic_playing = true;

        // toggle button styling
        document.getElementById("btn-classic").classList.add("playing");
        document.getElementById("btn-ambient").classList.remove("playing");
        document.getElementById("btn-lofi").classList.remove("playing");
    
    } else if (classic_playing){
        // classic_stream.pause();
        classic_playing = false;
        document.getElementById("btn-classic").classList.remove("playing");
    
    } else {pass;}
}

function play_ambient() {

    const DBOpenRequest = window.indexedDB.open(database, 1);
    DBOpenRequest.onsuccess = (event) => {
        db = DBOpenRequest.result;
        // Run the getData() function to get the data from the database
        getData("trap and ink");
    };

    audioURL.pause();
    audioURL.currentTime = 0;

    if (!ambient_playing){
        // configure audio stream
        audioURL.play(); /////////////////////////////////////
        ambient_playing = true;

        // toggle button styling
        document.getElementById("btn-classic").classList.remove("playing");
        document.getElementById("btn-ambient").classList.add("playing");
        document.getElementById("btn-lofi").classList.remove("playing");
    
    } else if (ambient_playing){
        ambient_playing = false;
        document.getElementById("btn-ambient").classList.remove("playing");
    
    } else {pass;}
}

function play_lofi() {

    const DBOpenRequest = window.indexedDB.open(database, 1);
    DBOpenRequest.onsuccess = (event) => {
        db = DBOpenRequest.result;
        // Run the getData() function to get the data from the database
        getData("trap and ink");
    };

    audioURL.pause();
    audioURL.currentTime = 0;

    if (!lofi_playing){
        // configure audio stream
        audioURL.play(); /////////////////////////////////////
        lofi_playing = true;

        // toggle button styling
        document.getElementById("btn-classic").classList.remove("playing");
        document.getElementById("btn-ambient").classList.remove("playing");
        document.getElementById("btn-lofi").classList.add("playing");
    
    } else if (lofi_playing){
        lofi_playing = false;
        document.getElementById("btn-lofi").classList.remove("playing");
    
    } else {pass;}
}
