let currentsong = null; //current song declares null
let currentsongUrl = null; // currentsong Url declares null

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

let songs;

let currentFolder;

// getsong function fetch the songs folder and return songs
async function getsongs(folder) {
  currentFolder = folder;
  let a = await fetch(`http://127.0.0.1:5500/${folder}/`);
  let response = await a.text();

  let div = document.createElement("div");
  div.innerHTML = response;

  let as = div.getElementsByTagName("a");

  // List of songs in that folder
  songs = [];
  // console.log(as);

  for (let index = 0; index < as.length; index++) {
    const element = as[index];

    if (element.href.endsWith(".mp3")) {
      //this if checks if the songurl ends with .mp3 and push it in songs
      songs.push(element.href);
    }
  }

  console.log(songs);

  return songs;
}

async function main() {
  let songList = document.querySelector(".song-list ul"); // assuming this returns an array of song URLs

  songs = [];

  
  //Add an event listener to card and load the folder on basis of album clicked

  Array.from(document.querySelectorAll(".cards")).forEach((card) => {
    card.addEventListener("click", async () => {
      console.log("card is clicked", card.dataset.folder);
      let folder = card.dataset.folder;

      songs = await getsongs(`songs/${folder}`);
      songList.innerHTML="";

      songs.forEach((songUrl) => {
        // Extract filename from URL
        let rawFileName = songUrl.split("/").pop(); // gets "Avaan%20Jaavan%20Song%20.mp3"

        // Decode URL encoding (e.g. %20 -> space, %2C -> comma)
        let decodedName = decodeURIComponent(rawFileName);

        // Remove prefix and suffix (like "s/" and ".mp3")
        decodedName = decodedName.replace("s/", "").replace(".mp3", "");

        // Create <li> and <a>
        let li = document.createElement("li");

        li.innerHTML = `
                <img class="invert" src="music.svg" alt="" />

                <div class="song-info">
                  <div class="song-name">${decodedName}</div>
                  <div class="song-artist">rohan</div>
                </div>

                <img class="invert play-button " src="play button.svg" alt="" />
              `;

        let playButton = li.querySelector(".play-button");

        //when we click on play button it play the song
        playButton.addEventListener("click", () => {
          if (currentsong && currentsongUrl === songUrl) {
            if (!currentsong.paused) {
              currentsong.pause();
              playButton.src = "play button.svg";
            } else {
              currentsong.play();
              playButton.src = "pause.svg";
            }
          } else {
            // pause previous song if current song plays

            if (currentsong) {
              currentsong.pause();
              playButton.src = "pause.svg";
              currentsong.currentTime = 0;
            }

            // It play new song
            currentsong = new Audio(songUrl);
            currentsongUrl = songUrl;
            currentsong.play();
            playButton.src = "pause.svg";

            // listen for timeUpdate event

            currentsong.addEventListener("timeupdate", () => {
              document.querySelector(".songDuration").innerHTML = `${formatTime(
                currentsong.currentTime
              )}/${formatTime(currentsong.duration)}`;
              document.querySelector(".songinfo").innerHTML = `${decodedName}`;

              document.querySelector(".circle").style.left =
                (currentsong.currentTime / currentsong.duration) * 100 + "%";
            });
          }
        });

        //attach an event listener to play , pause and previous

        play.addEventListener("click", () => {
          if (currentsong.paused) {
            currentsong.play();
            play.src = "pause.svg";
          } else {
            currentsong.pause();
            play.src = "play button.svg";
          }
        });

        songList.appendChild(li);
      });
    });
  });

  //Add an event listener to seekbar

  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = e.offsetX / e.target.getBoundingClientRect().width;
    document.querySelector(".circle").style.left = percent * 100 + "%";
    currentsong.currentTime = currentsong.duration * percent;
  });

  // Add an event listener to next button

  next.addEventListener("click", () => {
    console.log(songs);
    let currentSongindex = songs.indexOf(currentsongUrl);
    console.log(currentSongindex);
    let nextIndex = (currentSongindex + 1) % songs.length;
    console.log(nextIndex);
    currentsong.pause();
    currentsong.currentTime = 0;
    currentsong = new Audio(songs[nextIndex]);
    currentsongUrl = songs[nextIndex];

    currentsong.play();
    // update the name and duration of song with the next song
    currentsong.addEventListener("timeupdate", () => {
      let rawFileName = currentsongUrl.split("/").pop();
      let songName = decodeURIComponent(rawFileName).replace(".mp3", "");

      document.querySelector(".songinfo").innerHTML = songName;
      document.querySelector(".songDuration").innerHTML = `${formatTime(
        currentsong.currentTime
      )}/${formatTime(currentsong.duration)}`;
      document.querySelector(".circle").style.left =
        (currentsong.currentTime / currentsong.duration) * 100 + "%";
    });
  });

  // Add an event Listener to previous button

  previous.addEventListener("click", () => {
    console.log(songs);
    let currentSongindex = songs.indexOf(currentsongUrl);
    console.log(currentSongindex);
    let prevIndex = currentSongindex - 1;
    console.log(prevIndex);

    currentsong.pause();

    if (prevIndex < 0) {
      prevIndex = songs.length - 1;
    }
    currentsong.currentTime = 0;
    currentsong = new Audio(songs[prevIndex]);
    currentsongUrl = songs[prevIndex];

    currentsong.play();

    // update the name and duration of song with the previous song
    currentsong.addEventListener("timeupdate", () => {
      let rawFileName = currentsongUrl.split("/").pop();
      let songName = decodeURIComponent(rawFileName).replace(".mp3", "");

      document.querySelector(".songinfo").innerHTML = songName;
      document.querySelector(".songDuration").innerHTML = `${formatTime(
        currentsong.currentTime
      )}/${formatTime(currentsong.duration)}`;
      document.querySelector(".circle").style.left = 0;
      document.querySelector(".circle").style.left =
        (currentsong.currentTime / currentsong.duration) * 100 + "%";
    });
  });

  //Add an event listener to volume button

  document
    .querySelector(".range")
    .getElementsByTagName("input")[0]
    .addEventListener("change", (e) => {
      if (currentsong) {
        currentsong.volume = e.target.value / 100;
      }
    });
}

main();
