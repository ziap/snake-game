import Snake from './snake.js'
import Draw from './draw.js'

export default class Game {
    constructor(speed = 0.1) {
        this.renderer = new Draw()
        this.counter = document.getElementById('counter')
        this.speed = speed
        window.addEventListener(
            'resize',
            () => {
                this.renderer.resizeCanvas(this.grid_size.x, this.grid_size.y)
                this.renderer.renderSnake(this.snake, this.apple, this.frame)
                if (this.game_over) this.renderer.showMessage(this.won ? 'You win!' : 'Game over!')
            },
            false
        )
        this.restart()
        this.listen()
    }

    restart() {
        this.frame = 0.4
        this.won = false
        this.game_running = false
        this.game_over = false
        this.renderer.tile_size = this.renderer.default_tile_size
        this.grid_size = this.renderer.getSize()
        this.counter.innerHTML = `Score: 0`
        this.renderer.resizeCanvas(this.grid_size.x, this.grid_size.y)

        this.snake = new Snake(this.grid_size.x, this.grid_size.y)

        this.apple_eaten = false
        this.apple = null

        this.ctrl_queue = ''
        this.placeApple()
        this.gameLoop()
    }

    placeApple() {
        do {
            this.apple = {
                x: Math.floor(Math.random() * this.grid_size.x),
                y: Math.floor(Math.random() * this.grid_size.y)
            }
        } while (this.snake.occupied_space[this.apple.y][this.apple.x])
    }

    listen() {
        const map = {
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
            65: 'a' // A
        }
        document.addEventListener('keydown', event => {
            const modifiers = event.altKey || event.ctrlKey || event.metaKey || event.shiftKey
            const mapped = map[event.which]
            if (!modifiers && mapped != undefined) {
                event.preventDefault()
                this.ctrl_queue += mapped
                if (!this.game_running && !this.game_over) {
                    this.game_running = true
                    this.gameLoop()
                }
            }
        })
        let touch_start_client_x, touch_start_client_y
        const canvas = this.renderer.canvas
        canvas.addEventListener('touchstart', event => {
            if (event.touches.length > 1) return
            touch_start_client_x = event.touches[0].pageX
            touch_start_client_y = event.touches[0].pageY
            if (!this.game_over) event.preventDefault()
        })
        canvas.addEventListener('touchmove', event => event.preventDefault())
        canvas.addEventListener('touchend', event => {
            if (event.touches.length > 1) return
            const touchEndClientX = event.changedTouches[0].pageX
            const touchEndClientY = event.changedTouches[0].pageY
            const dx = touchEndClientX - touch_start_client_x
            const absDx = Math.abs(dx)
            const dy = touchEndClientY - touch_start_client_y
            const absDy = Math.abs(dy)
            if (Math.max(absDx, absDy) > 10) {
                // (right : left) : (down : up)
                this.ctrl_queue += absDx > absDy ? (dx > 0 ? 'd' : 'a') : dy > 0 ? 's' : 'w'
                if (!this.game_running && !this.game_over) {
                    this.game_running = true
                    this.gameLoop()
                }
            }
        })
    }

    waitAndRestart(message) {
        this.renderer.showMessage(message)
        new Promise(resolve => this.renderer.canvas.addEventListener('click', e => resolve())).then(() => this.restart())
    }

    gameLoop() {
        if (this.ctrl_queue || !this.snake.obstacleAhead()) this.frame += this.speed
        else this.frame += this.speed / 5
        if (this.frame >= 1) {
            if (this.apple_eaten) {
                if (this.won) {
                    this.game_over = true
                    this.waitAndRestart('You win!')
                    return
                }
                this.apple_eaten = false
                this.placeApple()
            }
            const oppositeDir = { w: 's', a: 'd', s: 'w', d: 'a' }
            while (
                (this.ctrl_queue[0] == this.snake.dir || oppositeDir[this.ctrl_queue[0]] == this.snake.dir) &&
                this.ctrl_queue.length > 0
            )
                this.ctrl_queue = this.ctrl_queue.substring(1)

            const new_dir = this.ctrl_queue[0] || this.snake.dir
            this.counter.innerHTML = `Score: ${this.snake.updatePos(new_dir, this)}`
            this.frame = 0
        }
        this.renderer.renderSnake(this.snake, this.apple, this.frame)
        if (!this.game_over) {
            if (this.game_running) requestAnimationFrame(() => this.gameLoop())
        } else this.waitAndRestart('Game over!')
    }
}
