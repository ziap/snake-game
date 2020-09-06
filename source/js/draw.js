function draw() {
    this.tile_size = 48;
    this.canvasSize = 0.9;
    this.canvas = document.getElementById("canvas");
    this.contex = canvas.getContext("2d"),
    this.getSize = function(){
        return  {
            x: Math.floor((innerWidth * this.canvasSize) / this.tile_size),
            y: Math.floor((innerHeight * this.canvasSize) / this.tile_size)
        }
    }

    this.setCanvasSize = function(width, height) {
        this.canvas.width = width * this.tile_size;
        this.canvas.height = height * this.tile_size;
    }

    this.resizeCanvas = function(width, height) {
        if (((innerWidth * this.canvasSize) / (innerHeight * this.canvasSize)) > (width / height)) {
            this.tile_size = (innerHeight * this.canvasSize) / height;
        }
        else {
            this.tile_size = (innerWidth * this.canvasSize) / width;
        }
        this.setCanvasSize(width, height);
    }

    this.drawCircle = function(vector, radius, color) {
        this.contex.beginPath();
        this.contex.arc(vector.x * this.tile_size + this.tile_size / 2, vector.y * this.tile_size + this.tile_size / 2, (this.tile_size / 2) * radius, 0, 2 * Math.PI);
        this.contex.fillStyle = color;
        this.contex.fill();
    }

    this.connect = function(vector1, vector2, width, color) {
        if (vector1.x > vector2.x || vector1.y > vector2.y) {
            this.connect(vector2, vector1, width, color)
            return;
        }
        this.contex.beginPath();
        this.contex.fillRect(vector1.x * this.tile_size + this.tile_size / 2, vector1.y * this.tile_size + (this.tile_size / 2) * (1 - width), (vector2.x - vector1.x) * this.tile_size, this.tile_size * width);
        this.contex.fillStyle = color;
        this.contex.fill();

        this.contex.beginPath();
        this.contex.fillRect(vector1.x * this.tile_size + (this.tile_size /2) * (1 - width), vector1.y * this.tile_size + this.tile_size / 2, this.tile_size * width, (vector2.y - vector1.y) * this.tile_size);
        this.contex.fillStyle = color;
        
        this.contex.fill();
    }

    this.renderSnake = function(snake, apple, frame) {
        this.contex.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.drawCircle(apple, 0.64, "#FF0800");

        var snakeHead = {
            x: snake.lastHead.x + (snake.head.x - snake.lastHead.x) * (frame / 9),
            y: snake.lastHead.y + (snake.head.y - snake.lastHead.y) * (frame / 9)
        }

        var snakeTail = {
            x: snake.lastTail.x + (snake.tail.x - snake.lastTail.x) * (frame / 9),
            y: snake.lastTail.y + (snake.tail.y - snake.lastTail.y) * (frame / 9)
        }

        this.drawCircle(snakeTail, 0.8, "#1d8cea");
        this.drawCircle(snakeHead, 0.8, "#1d8cea");

        if (snake.anchors.length == 0) {
            this.connect(snakeTail, snakeHead, 0.8, "#1d8cea")
        }
        else {
            this.connect(snakeTail, snake.anchors[0], 0.8, "#1d8cea");
            this.connect(snakeHead, snake.anchors[snake.anchors.length - 1], 0.8, "#1d8cea");
            for (var i = 0; i < snake.anchors.length; i++) {
                this.drawCircle(snake.anchors[i], 0.8, "#1d8cea");
                if (i < snake.anchors.length - 1) this.connect(snake.anchors[i], snake.anchors[i + 1], 0.8, "#1d8cea");
            }
        }
    }
}