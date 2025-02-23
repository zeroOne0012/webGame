const express = require('express');
const app = express();
require("dotenv").config();
const config = require('./gameLogic/config');
const Player = require('./gameLogic/Object/player');

const Platform = require('./gameLogic/Object/Platform');

const AABB = require('./gameLogic/AABB');

const http = require('http');
const { Server } = require('socket.io');

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: [`${process.env.URL}:25565`],
        methods: ["GET", "POST"],
        // credentials: true
      },
});

let players = {};
let entities = {};

let platforms = [
    new Platform(100, 200, 100, 100),
    new Platform(300, 250, 100, 100),
    new Platform(250, 300, 100, 100)
];

function createSocket(){
    io.on('connection', (socket) => {
        console.log(`${socket.id} connected`); // 이름 설정 페이지 구현 후 변경
    



        // 클라이언트에서 메시지 수신 이벤트 처리
        // [위 오른 왼 a 공백] 만 받음
        socket.on('keydown', (k) => {
            try{
                // if(!players[socket.id]) return;
                players[socket.id].keys[k] = true;


                if (k === "ArrowUp" || k === " ") {
                    if (players[socket.id].onGround) {
                        players[socket.id].dy = players[socket.id].jumpPower;
                        players[socket.id].onGround = false;
                    }
                }
                if (k === "a" && !players[socket.id].attack.attacking && players[socket.id].attack.coolTime==config.attackCool) {
                    players[socket.id].attack.attacking = true;
                    players[socket.id].update(); // 분리하면 빼도 될 듯한 코드 (0,0,50,50)
                    Object.values(players).forEach(player => {
                        if (player.id === players[socket.id].id) return;
                        if (
                            AABB(
                                players[socket.id].attack.x, 
                                players[socket.id].attack.y,
                                players[socket.id].attack.width, 
                                players[socket.id].attack.height,
                                player.x, 
                                player.y,
                                player.width, 
                                player.height
                            )
                        ) { // AABB 수정 필요
                            player.health -= 10;
                            if (player.health <= 0) {
                                delete players[player.id];
                                const killed = io.sockets.sockets.get(player.id);
                                if (killed){
                                    killed.emit("gameover");
                                    killed.disconnect(true);
                                }
                                // players.splice(players.indexOf(player), 1); XXXXX
                            } // 죽음
                        }
                    });
                }
            }catch(err){
                    
            }

        });
        socket.on('keyup', (k) => {
            // if(!players[socket.id]) return;
            try{
                players[socket.id].keys[k] = false;
            }catch(err){

            }
        });



    
        // 사용자 연결 해제 시 로그 출력
        socket.on('disconnect', () => {
            delete players[socket.id];
            console.log(`${socket.id} disconnected`);
        });

        socket.on('login', (msg)=>{
            // console.log("DEBUG", msg);
            const x= Math.floor(Math.random() * 800); // 랜덤 위치
            const y= Math.floor(Math.random() * 600);
            const color= `hsl(${Math.random() * 360}, 100%, 50%)`; // 랜덤 색상
            players[socket.id] = new Player(socket.id, x,y,color, msg.nickname);
            // console.log(players);
            
        });
    });

    setInterval(() => {
        Object.values(players).forEach(p => {
            if (p.keys["ArrowLeft"]) {
                p.dx = -p.speed;
                p.dir = -1;
            }
            else if (p.keys["ArrowRight"]) {
                p.dx = p.speed;
                p.dir = 1;
            }
            else p.dx = 0;
            p.update();
        });

        playerData = Object.values(players).map(p=>({
                id: p.id,
                x: p.x,
                y: p.y,
                width: p.width,
                height: p.height,
                color: p.color,
                health: p.health,
                maxHealth: p.maxHealth,
                dir: 1, // 오른쪽
                attack: p.attack,
                nickname: p.nickname
            }
        ));
        // playerData.forEach(p=>{
        //     console.log(p.x, p.y);
        // });

        io.emit('updatePlayers', playerData); // 모든 플레이어 정보 전송
    }, 15); // 50ms 간격 (1초 = 1000ms)
    
    server.listen(process.env.SOCKET_PORT, ()=>{});

}

module.exports = createSocket;