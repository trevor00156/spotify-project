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
      songs.push(element.href.split('/song')[1]);
    }
  } 

  console.log(songs);
  

  return songs;
}

async function main() {
  let songs = await getsongs();
  console.log(songs);

  


  let songList = document.querySelector(".song-list ul");

  for (const song of songs) {
    songList.innerHTML= songList.innerHTML+ `<li>${song.replaceAll('%20',' ')}</li>`
    
  }
  let audio = new Audio(songs[0]);
  audio.play();
}

main();
