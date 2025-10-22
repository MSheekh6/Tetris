export class Board {
    constructor(width = 10, height = 20) {
        this.width = width;
        this.height = height;
        this.grid = this.createEmptyGrid();
    }

    createEmptyGrid() {
        return Array(this.height).fill(null).map(() => Array(this.width).fill(0));
    }

    isValidPosition(tetromino) {
        const shape = tetromino.getCurrentShape();

        for (let row = 0; row < shape.length; row++) {
            for (let col = 0; col < shape[row].length; col++) {
                if (shape[row][col]) {
                    const newX = tetromino.x + col;
                    const newY = tetromino.y + row;

                    if (newX < 0 || newX >= this.width || newY >= this.height) {
                        return false;
                    }

                    if (newY >= 0 && this.grid[newY][newX]) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    placeTetromino(tetromino) {
        const shape = tetromino.getCurrentShape();

        for (let row = 0; row < shape.length; row++) {
            for (let col = 0; col < shape[row].length; col++) {
                if (shape[row][col]) {
                    const x = tetromino.x + col;
                    const y = tetromino.y + row;

                    if (y >= 0 && y < this.height && x >= 0 && x < this.width) {
                        this.grid[y][x] = tetromino.color;
                    }
                }
            }
        }
    }

    clearLines() {
        let linesCleared = 0;

        for (let row = this.height - 1; row >= 0; row--) {
            if (this.grid[row].every(cell => cell !== 0)) {
                this.grid.splice(row, 1);
                this.grid.unshift(Array(this.width).fill(0));
                linesCleared++;
                row++;
            }
        }

        return linesCleared;
    }

    getGhostPosition(tetromino) {
        const ghost = tetromino.clone();

        while (this.isValidPosition(ghost)) {
            ghost.moveDown();
        }

        ghost.moveUp();
        return ghost;
    }

    reset() {
        this.grid = this.createEmptyGrid();
    }
}
