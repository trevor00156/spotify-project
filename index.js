console.log("hello world");

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
      songs.push(element.href.split("/song")[1]);
    }
  }

  console.log(songs);

  return songs;
}

async function main() {
  let songList = document.querySelector(".song-list ul");
  let songs = await getsongs(); // assuming this returns an array of song URLs

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

                <img class="invert" src="play button.svg" alt="" />
              `;
    let a = document.createElement("a");
    // a.href = songUrl;
    // a.innerText = decodedName;

    li.appendChild(a);
    songList.appendChild(li);

    let audio = new Audio(songUrl);
    audio.play();
  });
}

main();
