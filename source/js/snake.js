function snake(width, height) {
    this.score = 3;
    this.dir = 'd';

    this.width = width;
    this.height = height;

    this.occupiedSpace = new Array(height);
    for (var i = 0; i < height; i++) {
        this.occupiedSpace[i] = new Array(width);
        for (var j = 0; j < width; j++) this.occupiedSpace[i][j] = false;
    }


    this.head = {
        x: Math.floor(Math.random() * (width / 2 - 2)) + 3,
        y: Math.floor(Math.random() * height)
    }

    this.tail = {
        x: this.head.x - 2,
        y: this.head.y
    }

    this.lastHead = {
        x: this.head.x - 1,
        y: this.head.y
    }

    this.lastTail = {
        x: this.head.x - 3,
        y: this.head.y
    }

    this.anchors = [];

    this.occupiedSpace[this.head.y][this.head.x] = true;
    this.occupiedSpace[this.head.y][this.head.x - 1] = true;
    this.occupiedSpace[this.head.y][this.head.x - 2] = true;

    this.updatePos = function(dir, game) {
        if (this.anchors.length > 0 && this.tail.x == this.anchors[0].x && this.tail.y == this.anchors[0].y) this.anchors.shift();
        if (dir != this.dir) this.anchors.push({
            x: this.head.x,
            y: this.head.y
        })
        this.dir = dir;
        this.lastHead = {
            x: this.head.x,
            y: this.head.y
        }
        this.lastTail = {
            x: this.tail.x,
            y: this.tail.y
        }
        this.occupiedSpace[this.tail.y][this.tail.x] = false;
        if (this.anchors.length > 0) {
            this.tail = {
                x: ((this.tail.x != this.anchors[0].x) ? this.tail.x + (this.anchors[0].x - this.tail.x) / Math.abs(this.anchors[0].x - this.tail.x) : this.tail.x),
                y: ((this.tail.y != this.anchors[0].y) ? this.tail.y + (this.anchors[0].y - this.tail.y) / Math.abs(this.anchors[0].y - this.tail.y) : this.tail.y)
            }
        }
        else this.tail = {
            x: ((this.tail.x != this.head.x) ? this.tail.x + (this.head.x - this.tail.x) / Math.abs(this.head.x - this.tail.x) : this.tail.x),
            y: ((this.tail.y != this.head.y) ? this.tail.y + (this.head.y - this.tail.y) / Math.abs(this.head.y - this.tail.y) : this.tail.y)
        }
        
        var moveMap = {
            w: {x: 0, y: -1},
            a: {x: -1, y: 0},
            s: {x: 0, y: 1},
            d: {x: 1, y: 0}
        }

        this.head = {
            x: this.head.x + moveMap[dir].x,
            y: this.head.y + moveMap[dir].y
        }

        if (this.head.x >= width || this.head.y >= height || this.head.x < 0 || this.head.y < 0 || this.occupiedSpace[this.head.y][this.head.x]) {
            game.gameOver = true;
            game.gameRunning = false;
            alert("Game over!");
            game.restart();
            return;
        }

        if (this.head.x == game.apple.x && this.head.y == game.apple.y) {
            this.score++;
            game.appleEaten = true;
            this.tail = {
                x: this.lastTail.x,
                y: this.lastTail.y
            }
            this.occupiedSpace[this.tail.y][this.tail.x] = true;
            if (this.score == width * height) {
                game.won = true;
                return;
            }
        }
        this.occupiedSpace[this.head.y][this.head.x] = true;
    }
}