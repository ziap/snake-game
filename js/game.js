new function game() {
    var self = this;

    this.restart = function() {
        this.won = false;
        this.gameRunning = false;
        this.gameOver = false;
        this.renderer = new draw();
        this.gridSize = this.renderer.getSize();
        this.renderer.setCanvasSize(this.gridSize.x, this.gridSize.y);
        
        this.snake = new snake(this.gridSize.x, this.gridSize.y);
    
        this.appleEaten = false;
        this.apple = null;

        this.ctrlQueue = "";
        this.listen();
        this.placeApple();
        this.gameLoop(4);
    }
    
    window.addEventListener('resize', function() {
        self.renderer.resizeCanvas(self.gridSize.x, self.gridSize.y);
        self.renderer.renderSnake(self.snake, self.apple, 0);
    }, false);

    this.placeApple = function() {
        do {
            self.apple = {
                x: Math.floor(Math.random() * self.gridSize.x),
                y: Math.floor(Math.random() * self.gridSize.y)
            }
        } while(self.snake.occupiedSpace[self.apple.y][self.apple.x]);
    }

    this.listen = function() {
        var self = this;
        var map = {
            38: 'w', // Up
            39: 'd', // Right
            40: 's', // Down
            37: 'a', // Left
            75: 'w', // Vim up
            76: 'd', // Vim right
            74: 's', // Vim down
            72: 'a', // Vim left
            87: 'w', // W
            68: 'd', // D
            83: 's', // S
            65: 'a'  // A
        };
        document.addEventListener("keydown", function (event) {
            var modifiers = event.altKey || event.ctrlKey || event.metaKey || event.shiftKey;
            var mapped = map[event.which];
            if (!modifiers && (mapped != undefined)) {
                self.ctrlQueue += mapped;
                if (!self.gameRunning && !self.gameOver) {
                    self.gameRunning = true;
                    self.gameLoop(5);
                }
            }
        });
    }

    this.gameLoop = function(frame) {
        if (frame == 0) {
            if (this.appleEaten) {
                if (this.won) {
                    alert("You win!");
                    this.restart();
                }
                this.appleEaten = false;
                this.placeApple();
            }
            var oppositeDir = {w: 's', a: 'd', s: 'w', d: 'a'};
            var newDir = this.snake.dir;
                while ((this.ctrlQueue[0] == this.snake.dir || oppositeDir[this.ctrlQueue[0]] == this.snake.dir) && this.ctrlQueue.length > 0)
                    this.ctrlQueue = this.ctrlQueue.substring(1);
            
            if (this.ctrlQueue.length > 0) newDir = this.ctrlQueue[0]; 
            this.snake.updatePos(newDir, this);
        }
        this.renderer.renderSnake(this.snake, this.apple, frame);
        if (this.gameRunning) setTimeout(function() {self.gameLoop((frame + 1) % 10)}, 50/3);
    }


    this.restart();
};