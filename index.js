console.log("hello world");

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

// getsong function fetch the songs folder and return songs
async function getsongs() {
  let a = await fetch("http://127.0.0.1:5500/songs/");
  let response = await a.text();

  let div = document.createElement("div");
  div.innerHTML = response;

  let as = div.getElementsByTagName("a");

  let songs = [];
  console.log(as);

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
  let songList = document.querySelector(".song-list ul");
  let songs = await getsongs(); // assuming this returns an array of song URLs

  let currentsong = null; //current song declares null
  let currentsongUrl = null; // currentsong Url declares null

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

          currentsong.currentTime = 0;
          playButton.src = "play button.svg";
        }

        // It play new song
        currentsong = new Audio(songUrl);
        currentsongUrl = songUrl;
        currentsong.play();
        playButton.src = "pause.svg";

        // listen for timeUpdate event

        currentsong.addEventListener("timeupdate", () => {
          console.log(currentsong.currentTime, currentsong.duration);

          document.querySelector(".songDuration").innerHTML = `${formatTime(
            currentsong.currentTime
          )}:${formatTime(currentsong.duration)}`;
          document.querySelector(".songinfo").innerHTML = `${decodedName}`;
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
}

main();
