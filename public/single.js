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
        this.jumpPower = -10;
        this.gravity = 0.5;
        this.dir = 1; // 오른쪽
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    isCollidingWith(other) {
        return (
            this.x < other.x + other.width &&
            this.x + this.width > other.x &&
            this.y < other.y + other.height &&
            this.y + this.height > other.y
        );
    }
}

class Player extends Entity {
    constructor() {
        super(50, canvas.height - 100, 50, 50, "red", 100);
        this.speed = 5;
        this.jumpPower = -10;
        this.gravity = 0.5;
        this.attacking = false;
        this.attackFrame = 0;
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
        
        if (this.attacking) {
            this.attackFrame++;
            if (this.attackFrame > 10) {
                this.attacking = false;
                this.attackFrame = 0;
            }
        }
    }

    draw() {
        if (this.attacking) {
            ctx.fillStyle = "red"; // 공격 시 색상 변경
        } else {
            ctx.fillStyle = this.color;
        }
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // 공격 범위 표시
        if (this.attacking) {
            ctx.fillStyle = "rgba(255, 0, 0, 0.3)";
            if (this.dir===1){
                ctx.fillRect(this.x + this.width, this.y, 60, this.height);
            } else{
                ctx.fillRect(this.x - this.width, this.y, 60, this.height);
            }
        }
    }
}

class Enemy extends Entity {
    constructor(x, y) {
        super(x, y, 50, 50, "green", 50);
        this.maxHealth = this.health; // 최대 체력 저장
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

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // 체력 바 위치 설정
        const healthBarWidth = this.width; // 전체 체력 바 너비
        const healthBarHeight = 5; // 체력 바 높이
        const healthBarX = this.x;
        const healthBarY = this.y - 10; // 적 위에 배치

        // 체력 바 배경 (빨간색: 손실된 체력)
        ctx.fillStyle = "red";
        ctx.fillRect(healthBarX, healthBarY, healthBarWidth, healthBarHeight);

        // 체력 바 (초록색: 남은 체력)
        ctx.fillStyle = "green";
        const currentHealthWidth = (this.health / this.maxHealth) * healthBarWidth; // 현재 체력 비율 적용
        ctx.fillRect(healthBarX, healthBarY, currentHealthWidth, healthBarHeight);
 
    }
}


const player = new Player();
const enemies = [
    new Enemy(300, canvas.height - 200),
    new Enemy(600, canvas.height - 200)
];

const keys = {};
window.addEventListener("keydown", (e) => {
    keys[e.key] = true;
    if (e.key === "ArrowUp" || e.key === " ") {
        if (player.onGround) {
            player.dy = player.jumpPower;
            player.onGround = false;
        }
    }
    if (e.key === "a" && !player.attacking) {
        player.attacking = true;
        enemies.forEach(enemy => {
            if (Math.abs(player.x - enemy.x) < 150) {
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
    
    if (keys["ArrowLeft"]) {
        player.dx = -player.speed;
        player.dir = -1;
    }
    else if (keys["ArrowRight"]) {
        player.dx = player.speed;
        player.dir = 1;
    }
    else player.dx = 0;
    
    player.update();
    player.draw();

    // for (const e of enemies){
    //     e.update();
    //     e.draw();
    // }
    
    enemies.forEach(enemy => {
        enemy.update();
        enemy.draw();
    });
    
    requestAnimationFrame(gameLoop);
}

gameLoop();
