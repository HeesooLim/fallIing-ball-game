let ball = document.getElementById('ball');

let game = document.getElementById('game');

let interval;
let playGameInterval;

let both = 0; // both key
let counter = 0;
let ballBlockCount = 0;

let blockContainer = [];
let holeContainer = [];

let lastBlockTop = 100;
let lastHoleTop = 100;
let gameMsg = document.createElement('h2');
let gameBtn = document.createElement('button');


function moveLeft() {
    let left = parseInt(window.getComputedStyle(ball).getPropertyValue("left"));

    /* BALL SPEED */
    if(left > 0) {
        ball.style.left = left - 4 + "px";
    }
}

function moveRight() {
    let left = parseInt(window.getComputedStyle(ball).getPropertyValue("left"));

    /* BALL SPEED */
    if(left < 380) {
        ball.style.left = left + 4 + "px";
    }
}

document.addEventListener('keydown', event => {
    if(both == 0) {
        both++;
        if(event.key === 'ArrowLeft') {
            interval = setInterval(moveLeft, 1);
        }
        if(event.key === 'ArrowRight') {
            interval = setInterval(moveRight, 1);
        }
    }   
});

document.addEventListener('keyup', event => {
    both = 0;
    clearInterval(interval);
});

playGameInterval = setInterval(playGame, 10);

/* remove blocks, holes and ball & clear interval */
function endGame() {
    for (let index = 0; index < blockContainer.length; index++) {
        blockContainer[index].remove();
        holeContainer[index].remove();
    }

    blockContainer = [];
    holeContainer = [];

    ball.remove();
    clearInterval(playGameInterval);
}

/* add game over txt and btn */
function loseGame() {
    endGame();

    gameBtn.setAttribute('onclick', 'restartGame()');
    gameBtn.innerText = 'Try Again';

    gameMsg.setAttribute('id', 'game-msg');
    gameMsg.innerText = 'Game Over';
    
    game.appendChild(gameMsg);
    game.appendChild(gameBtn);
}

/* add you win txt */
function winGame() {
    endGame();

    gameMsg.setAttribute('id', 'game-msg');
    gameMsg.innerText = 'You Win!';
    
    game.appendChild(gameMsg);
}

/* reset counter and ballBlockCount, create a ball and set play game interval */
function restartGame() {
    counter = 0;
    ballBlockCount = 0;

    ball = document.createElement('div');
    ball.setAttribute('id', 'ball');

    ball.style.top = '330px';
    game.appendChild(ball);

    gameMsg.remove();
    gameBtn.remove();

    playGameInterval = setInterval(playGame, 10);
}

function playGame() {
    moveElementsUpward();

    removeOldBlockAndHole();

    dropBall();

    checkIfBallOut();
}

function checkIfBallOut() {
    let ballTop = parseInt(window.getComputedStyle(ball).getPropertyValue("top"));
    if(ballTop < -20) {
        loseGame();
    }
    if(ballTop > 335) {
        winGame();
    }
}

function moveElementsUpward() {
    let lastBlock = document.getElementById('block-' + (counter - 1));
    let lastHole = document.getElementById('hole-' + (counter - 1));

    if(counter > 0) {
        lastBlockTop = parseInt(window.getComputedStyle(lastBlock).getPropertyValue("top"));
        lastHoleTop = parseInt(window.getComputedStyle(lastHole).getPropertyValue('top'));
    }
    
    if(lastBlockTop < 300 || counter == 0) {
        generateElements(lastBlockTop, lastHoleTop);
    }

    blockContainer.forEach(block => {
        let top = parseInt(window.getComputedStyle(block).getPropertyValue("top"));
        block.style.top = top - 1 + "px";
    });

    holeContainer.forEach(hole => {
        let top = parseInt(window.getComputedStyle(hole).getPropertyValue("top"));
        hole.style.top = top - 1 + "px";
    });

    let ballTop = parseInt(window.getComputedStyle(ball).getPropertyValue("top"));

    ball.style.top = ballTop - 1 + 'px';
}

function removeOldBlockAndHole() {
    let firstBlockTop = parseInt(window.getComputedStyle(blockContainer[0]).getPropertyValue("top"));
    let firstHoleTop = parseInt(window.getComputedStyle(holeContainer[0]).getPropertyValue("top"));

    if(firstBlockTop < 0 && firstHoleTop < 0) {
        blockContainer[0].remove();
        holeContainer[0].remove();

        blockContainer.splice(0, 1);
        holeContainer.splice(0, 1);
    }
}

function dropBall() {
    let ballLeft = parseInt(window.getComputedStyle(ball).getPropertyValue("left"));
    let ballTop = parseInt(window.getComputedStyle(ball).getPropertyValue("top"));
    let hole = document.getElementById('hole-' + ballBlockCount);

    if(hole) {
        let holeLeftStart = parseInt(window.getComputedStyle(hole).getPropertyValue("left"));
        let holeLeftEnd = parseInt(window.getComputedStyle(hole).getPropertyValue("left")) + 40;

        if(ballLeft > holeLeftStart && ballLeft + 20 < holeLeftEnd) {
            ball.style.top = ballTop + 50 + "px";
            ballBlockCount++;
        }
    }
}

function generateElements(lastBlockTop, lastHoleTop) {
    let block = document.createElement("div");
    let hole = document.createElement("div");

    block.setAttribute('class', 'block');
    hole.setAttribute('class', 'hole');
    
    block.setAttribute('id', 'block-' + counter);
    hole.setAttribute('id', 'hole-' + counter);

    block.style.top = lastBlockTop + 50 + 'px';
    hole.style.top = lastHoleTop + 50 + 'px';

    let random = Math.floor(Math.random() * 360);
    hole.style.left = random + "px";

    game.appendChild(block);
    game.appendChild(hole);
    
    blockContainer.push(block);
    holeContainer.push(hole);

    console.log(blockContainer);

    counter++;
}