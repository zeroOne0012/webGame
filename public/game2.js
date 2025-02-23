const socket = io('http://givemepresent.servegame.com:25566'); // 서버 주소로 연결
// 서버와 연결되었을 때
socket.on("connect", () => {
    const userData = {
        nickname: "hi"
    }
    socket.emit("login",userData);
});
socket.on("updatePlayers", (players) => { // EventLoop
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.fillRect(0,300,3000,3000); /////////////// 바닥
    // 화면에 플레이어 상태 업데이트
    players.forEach(player=>{
        drawPlayer(player);
    });
});

socket.on("gameover", ()=>{
    alert("gameover");
    location.reload();
});

const regs = (key)=>{
    return (
        key == "ArrowRight" ||
        key == "ArrowLeft" ||
        key == "ArrowUp" ||
        key == " " ||
        key == "a"
    );
};

document.addEventListener("keydown", (event) => {
    if(regs(event.key))
        socket.emit("keydown", event.key);
});

document.addEventListener("keyup", (event) => {
    if(regs(event.key))
        socket.emit("keyup", event.key);
});

/////////////////

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function drawPlayer(p){
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x, p.y, p.width, p.height);
    drawHealthBar(p);
    drawAttack(p);
}
function drawHealthBar(p){
    // 체력 바 위치 설정
    const healthBarWidth = p.width; // 전체 체력 바 너비
    const healthBarHeight = 5; // 체력 바 높이
    const healthBarX = p.x;
    const healthBarY = p.y - 10; // 위에 배치

    // 체력 바 배경 (빨간색: 손실된 체력)
    ctx.fillStyle = "red";
    ctx.fillRect(healthBarX, healthBarY, healthBarWidth, healthBarHeight);

    // 체력 바 (초록색: 남은 체력)
    ctx.fillStyle = "green";
    const currentHealthWidth = (p.health / p.maxHealth) * healthBarWidth; // 현재 체력 비율 적용
    ctx.fillRect(healthBarX, healthBarY, currentHealthWidth, healthBarHeight);
}
function drawAttack(p){
    // attack시 entity body 색상 변경 -> 없앰
    if (p.attack.attacking) {
        console.log("HEHEHE");
        ctx.fillStyle = "rgba(255, 0, 0, 0.3)";
        ctx.fillRect(p.attack.x, p.attack.y, p.attack.attackRange, p.attack.height);
    }

}

