


const Attack = require('./attack.js');
const config = require('../config.js');
class Player {
    constructor(id, x, y, color, nickname) {
        this.id = id;

        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 50;
        this.color = color;
        this.health = 100;
        this.maxHealth = 100;
        this.dx = 0;
        this.dy = 0;
        this.onGround = false;
        this.dir = 1; // 오른쪽

        this.nickname = nickname;

        this.speed = 5;
        this.jumpPower = -10;
        this.gravity = 0.5;

        this.attack = new Attack();
        this.keys = {}; // 이벤트; 눌린 키 true or false
    }

    update(platforms) {
        // 충돌 판정을 위한 헬퍼 함수 (Axis-Aligned Bounding Box)
        const isColliding = (a, b) => {
            return (
                a.x < b.x + b.width &&
                a.x + a.width > b.x &&
                a.y < b.y + b.height &&
                a.y + a.height > b.y
            );
        };
    
        // 수평 이동 및 충돌 검사
        this.x += this.dx;
        for (let platform of platforms) {
            if (isColliding(this, platform)) {
                if (this.dx > 0) {
                    // 오른쪽으로 이동 중, 플랫폼의 왼쪽 면에 충돌
                    this.x = platform.x - this.width;
                } else if (this.dx < 0) {
                    // 왼쪽으로 이동 중, 플랫폼의 오른쪽 면에 충돌
                    this.x = platform.x + platform.width;
                }
                this.dx = 0;
            }
        }
    
        // 수직 이동 및 충돌 검사
        this.y += this.dy;
        // 기본적으로 공중에 있다고 가정
        this.onGround = false;
        for (let platform of platforms) {
            if (isColliding(this, platform)) {
                if (this.dy > 0) {
                    // 낙하 중: 플랫폼의 위쪽 면에 충돌
                    this.y = platform.y - this.height;
                    this.onGround = true;
                } else if (this.dy < 0) {
                    // 상승 중: 플랫폼의 아래쪽 면에 충돌
                    this.y = platform.y + platform.height;
                }
                this.dy = 0;
            }
        }
    
        // 공중에 있을 경우 중력 적용
        if (!this.onGround) {
            this.dy += this.gravity;
        }
    
        // 바닥 충돌 검사 (config.floor)
        if (this.y + this.height >= config.floor) {
            this.y = config.floor - this.height;
            this.dy = 0;
            this.onGround = true;
        }
    
        // attack 쿨타임 관리
        if (this.attack.coolTime != config.attackCool) {
            this.attack.coolTime++;
        }
        
        // 공격 로직 처리
        if (this.attack.attacking) {
            if (this.attack.attackFrame === -1) { // 공격 시작 시 초기 위치 설정
                this.attack.coolTime = -1;
                if (this.dir === 1) this.attack.update(this.x + this.width, this.y);
                else this.attack.update(this.x - this.width, this.y);
            }
            this.attack.attackFrame++;
            if (this.attack.attackFrame > config.attackFrame) {
                this.attack.attacking = false;
                this.attack.attackFrame = -1;
                this.attack.update(0, 0);
            }
        }
    }
    
    // draw() {
    //     ctx.fillStyle = this.color;
    //     ctx.fillRect(this.x, this.y, this.width, this.height);
    // }
    // isCollidingWith(other) {
    //     return (
    //         this.x < other.x + other.width &&
    //         this.x + this.width > other.x &&
    //         this.y < other.y + other.height &&
    //         this.y + this.height > other.y
    //     );
    // }
}

module.exports = Player;