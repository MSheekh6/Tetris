export class Renderer {
    constructor(canvas, blockSize = 30) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.blockSize = blockSize;
    }

    drawBlock(x, y, color, isGhost = false) {
        const pixelX = x * this.blockSize;
        const pixelY = y * this.blockSize;

        if (isGhost) {
            this.ctx.strokeStyle = color;
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(pixelX + 2, pixelY + 2, this.blockSize - 4, this.blockSize - 4);
        } else {
            this.ctx.fillStyle = color;
            this.ctx.fillRect(pixelX, pixelY, this.blockSize, this.blockSize);

            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            this.ctx.fillRect(pixelX + 2, pixelY + 2, this.blockSize / 2, this.blockSize / 2);

            this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(pixelX, pixelY, this.blockSize, this.blockSize);
        }
    }

    drawBoard(board, currentTetromino, ghostTetromino) {
        this.clear();

        for (let row = 0; row < board.height; row++) {
            for (let col = 0; col < board.width; col++) {
                if (board.grid[row][col]) {
                    this.drawBlock(col, row, board.grid[row][col]);
                }
            }
        }

        if (ghostTetromino) {
            const ghostShape = ghostTetromino.getCurrentShape();
            for (let row = 0; row < ghostShape.length; row++) {
                for (let col = 0; col < ghostShape[row].length; col++) {
                    if (ghostShape[row][col]) {
                        const x = ghostTetromino.x + col;
                        const y = ghostTetromino.y + row;
                        if (y >= 0) {
                            this.drawBlock(x, y, ghostTetromino.color, true);
                        }
                    }
                }
            }
        }

        if (currentTetromino) {
            const shape = currentTetromino.getCurrentShape();
            for (let row = 0; row < shape.length; row++) {
                for (let col = 0; col < shape[row].length; col++) {
                    if (shape[row][col]) {
                        const x = currentTetromino.x + col;
                        const y = currentTetromino.y + row;
                        if (y >= 0) {
                            this.drawBlock(x, y, currentTetromino.color);
                        }
                    }
                }
            }
        }
    }

    drawTetromino(tetromino, offsetX = 0, offsetY = 0) {
        if (!tetromino) return;

        const shape = tetromino.getCurrentShape();
        const startX = offsetX + (4 - shape[0].length) / 2;
        const startY = offsetY + (4 - shape.length) / 2;

        for (let row = 0; row < shape.length; row++) {
            for (let col = 0; col < shape[row].length; col++) {
                if (shape[row][col]) {
                    this.drawBlock(startX + col, startY + row, tetromino.color);
                }
            }
        }
    }

    clear() {
        this.ctx.fillStyle = 'rgba(10, 14, 39, 0.8)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
}
