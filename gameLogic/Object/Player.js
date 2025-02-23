


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

    update() {
        this.x += this.dx;
        this.y += this.dy;
        
        // 낙하
        if (!this.onGround) {
            this.dy += this.gravity;
        }
        
        // 바닥 멈춤
        if (this.y + this.height >= config.floor) {
            this.y = config.floor - this.height;
            this.dy = 0;
            this.onGround = true;
        }

        

        // atack 쿨타임
        if (this.attack.coolTime!=config.attackCool){
            this.attack.coolTime++;
        }
        
        // 공격
        if (this.attack.attacking) {
            if(this.attack.attackFrame === -1){ // 초기 공격 위치 설정
                this.attack.coolTime=-1;
                if (this.dir===1) this.attack.update(this.x + this.width, this.y);
                else this.attack.update(this.x-this.width, this.y);
            }
            this.attack.attackFrame++;
            if (this.attack.attackFrame > config.attackFrame) {
                this.attack.attacking = false;
                this.attack.attackFrame = -1;
                this.attack.update(0,0);
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