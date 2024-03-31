console.log("starting js")
let currentSong = new Audio()
let songs
let currFolder

function secondsToMinutesAndSeconds(seconds) {
    // Ensure the input is a positive number
    seconds = Math.abs(seconds);

    // Calculate minutes and seconds
    var minutes = Math.floor(seconds / 60);
    var remainingSeconds = Math.floor(seconds % 60);

    // Add leading zeros if needed
    var minutesStr = minutes < 10 ? '0' + minutes : minutes;
    var secondsStr = remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds;

    // Concatenate minutes and seconds with a colon
    var formattedTime = minutesStr + ':' + secondsStr;

    return formattedTime;
}

async function getSongs(folder) {
    currFolder = folder


    let a = await fetch(`http://127.0.0.1:5500/${folder}/`)
    let response = await a.text()
    // console.log(response)
    let div = document.createElement("div")
    div.innerHTML = response
    let as = div.getElementsByTagName("a")
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }
    return songs
}
const playMusic = (track, pause = false) => {
    // let audio = new Audio("/songs/" + track)
    currentSong.src = `/${folder}/` + track
    if (!pause) {
        currentSong.play()
        play.src = "pause.svg"
    }


    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"

}


    // show all songs in the playlist
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    songUL.innerHTML = ""
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li> 

        
        <img class="invert" src="music.svg" alt="" srcset="">
        <div class="info">
            <div>  ${song.replaceAll("%20", " ")}</div>
            <div>Darshan</div>
        </div>
        <div class="playnow">
            <span>Play now</span>
            <img class="invert" src="play.svg" alt="" srcset="">
        </div>
       
    
        
       </li>`
    }
    // event listener for each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", e => {

            // above line is targeting div of 36th line to get individual song
            playMusic(document.querySelector(".info").firstElementChild.innerHTML.trim())
        })



    })
    // return songs



async function displayAlbums() {
    let a = await fetch(`http://127.0.0.1:5500/songs/`)
    let response = await a.text()

    let div = document.createElement("div")
    div.innerHTML = response
    let anchors = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".cardContainer")
   let array =  Array.from(anchors)
        for (let index = 0; index < array.length; index++) {
            const e = array[index];
            
        
        if (e.href.includes("/songs")) {
            let folder = e.href.split("/").slice(-2)[0]
            //    now get the metadata for folder
            let a = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`)
            let response = await a.json()
            console.log(response)
            cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="cs" class="card ">
        <div class="play">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
                <circle cx="20" cy="20" r="18" fill="#00ff00" />
                <g transform="translate(10, 10)">
                    <polygon points="7,3 17,10 7,17" fill="#000000" />
                </g>
            </svg>

        </div>
        <img src="/songs/${folder}/cover.jpg" alt="" srcset="">
        <h2>${response.title}</h2>
        <p>${response.description}</p>
    </div>`
        }
    }

     //  loading the library after card is clicked
     Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {

            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
            playMusic(songs[0])

        })
    })

}



async function main() {

   await getSongs("songs/ncs")
    playMusic(songs[0], true)

    // code to display album
    await displayAlbums()

    // event listener for playbar buttons
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "pause.svg"
        } else {
            currentSong.pause()
            play.src = "play.svg"
        }
    })

    // eventlistener for timeupdate
    currentSong.addEventListener("timeupdate", () => {

        document.querySelector(".songtime").innerHTML = `${secondsToMinutesAndSeconds(currentSong.currentTime)}/ ${secondsToMinutesAndSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%"
    })

    // eventlistener for seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        // percent: how much percent the song moves ahead on a click to seekbar
        document.querySelector(".circle").style.left = percent + "%"
        //    above event listener is used to move the circle where the user has clicked
        // getBoundingClientRect will give total width and height of my seekbar, inbuilt function
        currentSong.currentTime = ((currentSong.duration) * percent) / 100
    })

    // eventlistener for hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })

    // eventlistener for close
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"
    })

    // eventlistener for previous and next
    previous.addEventListener("click", () => {
        console.log("previous clicked")
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        console.log(songs, index)
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }
        else {
            console.log("no previous songs available")
        }
    })
    next.addEventListener("click", () => {
        currentSong.pause()
        console.log("next clicked")
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        console.log(songs, index)
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }
        else {
            console.log("no next songs to play")
        }
    })

    // eventlistener for volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log("setting volume to", e.target.value, "/100")
        currentSong.volume = parseInt(e.target.value) / 100
    })

   

}
main()  
