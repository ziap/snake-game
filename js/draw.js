export default class Draw {
    constructor() {
        this.default_tile_size = 48
        this.header_height = 64
        this.tile_size = this.default_tile_size
        this.canvas = document.getElementById('canvas')
        this.ctx = canvas.getContext('2d')
    }

    getSize() {
        return {
            x: Math.floor(innerWidth / this.tile_size),
            y: Math.floor((innerHeight - this.header_height) / this.tile_size)
        }
    }

    setCanvasSize(width, height) {
        this.canvas.width = width * this.tile_size
        this.canvas.height = height * this.tile_size
    }

    resizeCanvas(width, height) {
        if (innerWidth / (innerHeight - this.header_height) > width / height) {
            this.tile_size = (innerHeight - this.header_height) / height
        } else {
            this.tile_size = innerWidth / width
        }
        this.setCanvasSize(width, height)
    }

    drawCircle(vector, radius, color) {
        this.ctx.beginPath()
        this.ctx.arc(
            vector.x * this.tile_size + this.tile_size / 2,
            vector.y * this.tile_size + this.tile_size / 2,
            (this.tile_size / 2) * radius,
            0,
            2 * Math.PI
        )
        this.ctx.fillStyle = color
        this.ctx.fill()
    }

    connect(vector1, vector2, width, color) {
        if (vector1.x > vector2.x || vector1.y > vector2.y) {
            this.connect(vector2, vector1, width, color)
            return
        }
        this.ctx.beginPath()
        this.ctx.rect(
            vector1.x * this.tile_size + this.tile_size / 2,
            vector1.y * this.tile_size + (this.tile_size / 2) * (1 - width),
            (vector2.x - vector1.x) * this.tile_size,
            this.tile_size * width
        )
        this.ctx.fillStyle = color
        this.ctx.fill()

        this.ctx.beginPath()
        this.ctx.rect(
            vector1.x * this.tile_size + (this.tile_size / 2) * (1 - width),
            vector1.y * this.tile_size + this.tile_size / 2,
            this.tile_size * width,
            (vector2.y - vector1.y) * this.tile_size
        )
        this.ctx.fillStyle = color

        this.ctx.fill()
    }

    renderSnake(snake, apple, frame) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

        this.drawCircle(apple, 0.64, '#FF0000')

        const snake_head = {
            x: snake.last_head.x + (snake.head.x - snake.last_head.x) * (frame / 9),
            y: snake.last_head.y + (snake.head.y - snake.last_head.y) * (frame / 9)
        }

        const snake_tail = {
            x: snake.last_tail.x + (snake.tail.x - snake.last_tail.x) * (frame / 9),
            y: snake.last_tail.y + (snake.tail.y - snake.last_tail.y) * (frame / 9)
        }

        this.drawCircle(snake_tail, 0.8, '#1dbfea')
        this.drawCircle(snake_head, 0.8, '#1dbfea')

        if (snake.anchors.length == 0) this.connect(snake_tail, snake_head, 0.8, '#1dbfea')
        else {
            this.connect(snake_tail, snake.anchors[0], 0.8, '#1dbfea')
            this.connect(snake_head, snake.anchors[snake.anchors.length - 1], 0.8, '#1dbfea')
            for (let i = 0; i < snake.anchors.length; i++) {
                this.drawCircle(snake.anchors[i], 0.8, '#1dbfea')
                if (i < snake.anchors.length - 1) this.connect(snake.anchors[i], snake.anchors[i + 1], 0.8, '#1dbfea')
            }
        }
    }

    showMessage(message) {
        this.ctx.beginPath()
        this.ctx.rect(0, 0, this.canvas.width, this.canvas.height)
        this.ctx.globalAlpha = 0.8
        this.ctx.fillStyle = '#121212'
        this.ctx.fill()
        this.ctx.globalAlpha = 1

        this.ctx.font = '48px sans-serif'
        this.ctx.textAlign = 'center'
        this.ctx.fillStyle = '#ffffff'
        this.ctx.fillText(message, this.canvas.width / 2, this.canvas.height / 2 - 20)

        this.ctx.font = '24px sans-serif'
        this.ctx.fillStyle = '#ffffff'
        this.ctx.fillText('Press any key to restart', this.canvas.width / 2, this.canvas.height / 2 + 20)
    }
}
