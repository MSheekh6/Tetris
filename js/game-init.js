import { Game } from './game.js';

let game;
let animationId;

function updateDisplay() {
    document.getElementById('score').textContent = game.score;
    document.getElementById('highScore').textContent = game.highScore;
    document.getElementById('level').textContent = game.level;
    document.getElementById('lines').textContent = game.lines;
    document.getElementById('timer').textContent = game.getFormattedTime();
}

function showGameOver() {
    document.getElementById('finalScore').textContent = game.score;
    document.getElementById('gameOverlay').classList.remove('hidden');
}

function gameLoop(timestamp = 0) {
    const deltaTime = timestamp - game.lastTime;
    game.lastTime = timestamp;

    game.update(deltaTime);
    game.render();
    updateDisplay();

    if (game.isGameOver) {
        showGameOver();
        cancelAnimationFrame(animationId);
        return;
    }

    animationId = requestAnimationFrame(gameLoop);
}

function setupControls() {
    document.addEventListener('keydown', (e) => {
        if (game.isGameOver) return;

        switch (e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                game.moveLeft();
                break;
            case 'ArrowRight':
                e.preventDefault();
                game.moveRight();
                break;
            case 'ArrowDown':
                e.preventDefault();
                game.moveDown();
                break;
            case 'ArrowUp':
                e.preventDefault();
                game.rotate();
                break;
            case ' ':
                e.preventDefault();
                game.hardDrop();
                break;
            case 'Escape':
                e.preventDefault();
                game.togglePause();
                break;
        }
    });
}

function updateUserInfo() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const userInfoElement = document.getElementById('userInfo');
    const userInitialElement = document.getElementById('userInitial');
    const userNameElement = document.getElementById('userName');

    if (currentUser) {
        const displayName = currentUser.displayName || currentUser.username;
        const initial = displayName.charAt(0).toUpperCase();
        
        if (userInfoElement) {
            userInfoElement.textContent = `Player: ${displayName}`;
        }
        if (userInitialElement) {
            userInitialElement.textContent = initial;
        }
        if (userNameElement) {
            userNameElement.textContent = displayName;
        }
    } else {
        if (userInitialElement) {
            userInitialElement.textContent = '?';
        }
        if (userNameElement) {
            userNameElement.textContent = 'Guest';
        }
    }
}

function initGame() {
    const gameCanvas = document.getElementById('gameCanvas');
    const nextCanvas = document.getElementById('nextCanvas');

    game = new Game(gameCanvas, nextCanvas);
    setupControls();
    updateUserInfo();
    updateDisplay();

    animationId = requestAnimationFrame(gameLoop);
}

window.addEventListener('DOMContentLoaded', initGame);
