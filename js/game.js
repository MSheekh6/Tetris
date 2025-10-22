import { Tetromino } from './tetromino.js';
import { Board } from './board.js';
import { Renderer } from './renderer.js';

export class Game {
    constructor(gameCanvas, nextCanvas) {
        this.board = new Board(10, 20);
        this.gameRenderer = new Renderer(gameCanvas, 30);
        this.nextRenderer = new Renderer(nextCanvas, 30);

        this.currentTetromino = null;
        this.nextTetromino = null;

        this.score = 0;
        this.lines = 0;
        this.level = 1;
        this.highScore = this.loadHighScore();

        this.isGameOver = false;
        this.isPaused = false;
        this.dropCounter = 0;
        this.dropInterval = 1000;
        this.lastTime = 0;

        this.startTime = Date.now();
        this.elapsedTime = 0;

        this.setupNextTetromino();
        this.spawnTetromino();
    }

    setupNextTetromino() {
        this.nextTetromino = new Tetromino(Tetromino.getRandomType());
    }

    spawnTetromino() {
        this.currentTetromino = this.nextTetromino;
        this.currentTetromino.x = 3;
        this.currentTetromino.y = 0;
        this.setupNextTetromino();

        if (!this.board.isValidPosition(this.currentTetromino)) {
            this.gameOver();
        }
    }

    moveLeft() {
        if (this.isGameOver || this.isPaused) return;

        this.currentTetromino.moveLeft();
        if (!this.board.isValidPosition(this.currentTetromino)) {
            this.currentTetromino.moveRight();
        }
    }

    moveRight() {
        if (this.isGameOver || this.isPaused) return;

        this.currentTetromino.moveRight();
        if (!this.board.isValidPosition(this.currentTetromino)) {
            this.currentTetromino.moveLeft();
        }
    }

    moveDown() {
        if (this.isGameOver || this.isPaused) return;

        this.currentTetromino.moveDown();
        if (!this.board.isValidPosition(this.currentTetromino)) {
            this.currentTetromino.moveUp();
            this.lockTetromino();
        } else {
            this.score += 1;
        }
    }

    rotate() {
        if (this.isGameOver || this.isPaused) return;

        this.currentTetromino.rotate();
        if (!this.board.isValidPosition(this.currentTetromino)) {
            this.currentTetromino.rotateBack();
        }
    }

    hardDrop() {
        if (this.isGameOver || this.isPaused) return;

        while (this.board.isValidPosition(this.currentTetromino)) {
            this.currentTetromino.moveDown();
            this.score += 2;
        }
        this.currentTetromino.moveUp();
        this.score -= 2;
        this.lockTetromino();
    }

    lockTetromino() {
        this.board.placeTetromino(this.currentTetromino);

        const linesCleared = this.board.clearLines();

        if (linesCleared > 0) {
            this.lines += linesCleared;
            this.score += this.calculateScore(linesCleared);
            this.level = Math.floor(this.lines / 10) + 1;
            this.dropInterval = Math.max(100, 1000 - (this.level - 1) * 100);
        }

        this.spawnTetromino();
    }

    calculateScore(linesCleared) {
        const baseScores = [0, 100, 300, 500, 800];
        return baseScores[linesCleared] * this.level;
    }

    update(deltaTime) {
        if (this.isGameOver || this.isPaused) return;

        this.elapsedTime = Date.now() - this.startTime;
        this.dropCounter += deltaTime;

        if (this.dropCounter > this.dropInterval) {
            this.moveDown();
            this.dropCounter = 0;
        }
    }

    render() {
        const ghost = this.board.getGhostPosition(this.currentTetromino);
        this.gameRenderer.drawBoard(this.board, this.currentTetromino, ghost);

        this.nextRenderer.clear();
        this.nextRenderer.drawTetromino(this.nextTetromino);
    }

    togglePause() {
        if (this.isGameOver) return;
        this.isPaused = !this.isPaused;

        if (!this.isPaused) {
            this.startTime = Date.now() - this.elapsedTime;
        }
    }

    gameOver() {
        this.isGameOver = true;
        this.saveScore();
    }

    loadHighScore() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) return 0;

        const users = JSON.parse(localStorage.getItem('tetrisUsers')) || [];
        const user = users.find(u => u.email === currentUser.email);

        return user && user.highScore ? user.highScore : 0;
    }

    saveScore() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) return;

        const users = JSON.parse(localStorage.getItem('tetrisUsers')) || [];
        const userIndex = users.findIndex(u => u.email === currentUser.email);

        if (userIndex !== -1) {
            if (!users[userIndex].highScore || this.score > users[userIndex].highScore) {
                users[userIndex].highScore = this.score;
                users[userIndex].level = this.level;
                users[userIndex].lines = this.lines;
                localStorage.setItem('tetrisUsers', JSON.stringify(users));
            }
        }
    }

    getFormattedTime() {
        const totalSeconds = Math.floor(this.elapsedTime / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
}
