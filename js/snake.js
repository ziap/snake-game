const move_map = {
    w: { x: 0, y: -1 },
    a: { x: -1, y: 0 },
    s: { x: 0, y: 1 },
    d: { x: 1, y: 0 }
}

export default class Snake {
    constructor(width, height) {
        this.width = width
        this.height = height
        this.score = 3
        this.dir = 'd'

        this.occupied_space = new Array(height)
        for (let i = 0; i < height; i++) {
            this.occupied_space[i] = new Array(width)
            for (let j = 0; j < width; j++) this.occupied_space[i][j] = false
        }

        this.head = {
            x: Math.floor(Math.random() * (width / 2 - 2)) + 3,
            y: Math.floor(Math.random() * height)
        }

        this.tail = {
            x: this.head.x - 2,
            y: this.head.y
        }

        this.last_head = {
            x: this.head.x - 1,
            y: this.head.y
        }

        this.last_tail = {
            x: this.head.x - 3,
            y: this.head.y
        }

        this.anchors = []

        this.occupied_space[this.head.y][this.head.x] = true
        this.occupied_space[this.head.y][this.head.x - 1] = true
        this.occupied_space[this.head.y][this.head.x - 2] = true
    }

    updatePos(dir, game) {
        if (this.anchors.length > 0 && this.tail.x == this.anchors[0].x && this.tail.y == this.anchors[0].y)
            this.anchors.shift()
        if (dir != this.dir)
            this.anchors.push({
                x: this.head.x,
                y: this.head.y
            })
        this.dir = dir
        this.last_head = {
            x: this.head.x,
            y: this.head.y
        }
        this.last_tail = {
            x: this.tail.x,
            y: this.tail.y
        }
        this.occupied_space[this.tail.y][this.tail.x] = false
        if (this.anchors.length > 0) {
            this.tail = {
                x:
                    this.tail.x != this.anchors[0].x
                        ? this.tail.x + (this.anchors[0].x - this.tail.x) / Math.abs(this.anchors[0].x - this.tail.x)
                        : this.tail.x,
                y:
                    this.tail.y != this.anchors[0].y
                        ? this.tail.y + (this.anchors[0].y - this.tail.y) / Math.abs(this.anchors[0].y - this.tail.y)
                        : this.tail.y
            }
        } else
            this.tail = {
                x:
                    this.tail.x != this.head.x
                        ? this.tail.x + (this.head.x - this.tail.x) / Math.abs(this.head.x - this.tail.x)
                        : this.tail.x,
                y:
                    this.tail.y != this.head.y
                        ? this.tail.y + (this.head.y - this.tail.y) / Math.abs(this.head.y - this.tail.y)
                        : this.tail.y
            }

        this.head = {
            x: this.head.x + move_map[dir].x,
            y: this.head.y + move_map[dir].y
        }

        if (
            this.head.x >= this.width ||
            this.head.y >= this.height ||
            this.head.x < 0 ||
            this.head.y < 0 ||
            this.occupied_space[this.head.y][this.head.x]
        ) {
            game.game_over = true
            return this.score - 3
        }

        if (this.head.x == game.apple.x && this.head.y == game.apple.y) {
            this.score++
            game.apple_eaten = true
            this.tail = {
                x: this.last_tail.x,
                y: this.last_tail.y
            }
            this.occupied_space[this.tail.y][this.tail.x] = true
            if (this.score == this.width * this.height) {
                game.won = true
                return this.score - 3
            }
        }
        this.occupied_space[this.head.y][this.head.x] = true
        return this.score - 3
    }

    obstacleAhead() {
        const new_x = this.head.x + move_map[this.dir].x
        const new_y = this.head.y + move_map[this.dir].y
        return (
            new_x >= this.width || new_x < 0 || new_y >= this.height || new_y < 0 || this.occupied_space[new_y][new_x]
        )
    }
}
