let score =0;
let canAddScore = true; 
let gameOver = false;

const gameAudio = new Audio('./assets/game.mp3');
gameAudio.loop = true; 
gameAudio.play();
const jumpAudio = new Audio('./assets/jump.mp3');
jumpAudio.loop = false; 
jumpAudio.volume = 0.1;

const mario = document.querySelector('.mario');
const pipe = document.querySelector('.pipe');
const clouds = document.querySelector('.clouds');
const clouds2 = document.querySelector('.clouds2');
const scoretxt = document.querySelector('.score');
const btnreset = document.getElementById('btn-reset');
const jump = () =>{
if(gameOver)return;
jumpAudio.play();
mario.classList.add('jump');
setTimeout(() =>{
    mario.classList.remove('jump');
},500);
}

const loop = setInterval(() =>{

const cloudPosition = clouds.offsetLeft;
const cloudPosition2 = clouds2.offsetLeft;
const pipePosition = pipe.offsetLeft;
const marioPosition = +window.getComputedStyle(mario).bottom.replace('px','');

if(pipePosition <= 120 && pipePosition >0 && marioPosition <80 && !gameOver){
        gameAudio.pause();
    gameAudio.currentTime = 0;
pipe.style.animation = 'none';
pipe.style.left = `${pipePosition}px`;

mario.style.animation = 'none';
mario.style.bottom = `${marioPosition}px`;

mario.src ='assets/game-over.png';
mario.style.width = '75px';
mario.style.marginLeft = '50px';
clouds.style.animation = 'none';
clouds.style.left = `${cloudPosition}px`;
clouds2.style.animation = 'none';
clouds2.style.left = `${cloudPosition2}px`;
btnreset.style.display ='block';
playAudio('down');
setTimeout(() => playAudio('gameover'),2500);
    gameOver = true;

 
}

if(pipePosition <= 120 && marioPosition >=100  && canAddScore ){
    score++;
    scoretxt.innerHTML = `score: ${score}`;
   canAddScore =false;
   setTimeout(() => canAddScore =  true,300);

}

},10);
document.addEventListener('keydown', jump)

function reset(){
      location.reload();
}
async function playAudio(typeaudio) {
const audio = new Audio(`./assets/${typeaudio}.mp3`);
try{
audio.play();
} catch{}

}
