const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Entity {
    constructor(x, y, width, height, color, health) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.health = health;
        this.dx = 0;
        this.dy = 0;
        this.onGround = false;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

class Player extends Entity {
    constructor() {
        super(50, canvas.height - 100, 50, 50, "red", 100);
        this.speed = 5;
        this.jumpPower = -10;
        this.gravity = 0.5;
    }

    update() {
        this.x += this.dx;
        this.y += this.dy;
        
        if (!this.onGround) {
            this.dy += this.gravity;
        }
        
        if (this.y + this.height >= canvas.height) {
            this.y = canvas.height - this.height;
            this.dy = 0;
            this.onGround = true;
        }
    }
}

class Enemy extends Entity {
    constructor(x, y) {
        super(x, y, 50, 50, "green", 50);
    }
}

const player = new Player();
const enemies = [new Enemy(300, canvas.height - 200)];

const keys = {};
window.addEventListener("keydown", (e) => {
    keys[e.key] = true;
    if (e.key === "ArrowUp" || e.key === " ") {
        if (player.onGround) {
            player.dy = player.jumpPower;
            player.onGround = false;
        }
    }
    if (e.key === "a") {
        enemies.forEach(enemy => {
            if (Math.abs(player.x - enemy.x) < 60) {
                enemy.health -= 10;
                if (enemy.health <= 0) {
                    enemies.splice(enemies.indexOf(enemy), 1);
                }
            }
        });
    }
});

window.addEventListener("keyup", (e) => {
    keys[e.key] = false;
});

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (keys["ArrowLeft"]) player.dx = -player.speed;
    else if (keys["ArrowRight"]) player.dx = player.speed;
    else player.dx = 0;
    
    player.update();
    player.draw();
    
    enemies.forEach(enemy => enemy.draw());
    
    requestAnimationFrame(gameLoop);
}

gameLoop();