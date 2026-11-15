// o player de musica toca junto com o video: play no video toca, pausa ou fim do video para
const video = document.querySelector("video");
const musica = document.querySelector("audio");
musica.volume = 0.5;

video.addEventListener("play", function () {
    musica.play();
});

video.addEventListener("pause", function () {
    musica.pause();
});

video.addEventListener("ended", function () {
    musica.pause();
});
