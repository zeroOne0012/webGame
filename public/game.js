const attackCool= 40;
const floor= 350;

const socket = io('http://givemepresent.servegame.com:25566'); // 서버 주소로 연결
// 서버와 연결되었을 때
// socket.on("connect", () => {
//     const userData = {
//         nickname: "hi"
//     }
//     socket.emit("login", userData);
// });

// 최초 접속 시 닉네임 모달 표시
socket.on("connect", () => {
    showNicknameModal();
});

// 기존 코드
// socket.on("gameover", () => {
//     alert("gameover");
//     location.reload();
// });
// 게임오버 시 모달로 메시지 표시 후 재닉네임 입력 요청
socket.on("gameover", () => {
    showGameOverModal();
});

let platforms;
let nickname;
/////////////////////////////
// 모달 생성 함수 (HTML 요소 직접 생성)

function showNicknameModal() {
    // 모달 오버레이 생성
    const overlay = document.createElement("div");
    overlay.style.cssText =
        "position:fixed; top:0; left:0; width:100vw; height:100vh; background: rgba(0,0,0,0.5); display:flex; justify-content:center; align-items:center; z-index:1000;";
    
    // 모달 박스 생성
    const modal = document.createElement("div");
    modal.style.cssText =
        "background:white; padding:20px; border-radius:5px; text-align:center; min-width:300px;";
    
    // 제목 생성
    const title = document.createElement("h2");
    title.innerText = "닉네임 입력";
    
    // 입력창 생성
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "닉네임을 입력하세요";
    input.style.cssText = "margin:10px 0; width:80%; padding:5px;";
    
    // 버튼 생성
    const button = document.createElement("button");
    button.innerText = "시작";
    button.style.cssText = "padding:5px 10px;";
    
    button.onclick = function() {
        nickname = input.value.trim();
        if(nickname !== "") {
            socket.emit("login", { nickname: nickname });
            document.body.removeChild(overlay);
        } else {
            alert("닉네임을 입력해주세요.");
        }
    };
    
    // 모달 조립 및 DOM 추가
    modal.appendChild(title);
    modal.appendChild(input);
    modal.appendChild(document.createElement("br"));
    modal.appendChild(button);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
}

function showGameOverModal() {
    // 모달 오버레이 생성
    const overlay = document.createElement("div");
    overlay.style.cssText =
        "position:fixed; top:0; left:0; width:100vw; height:100vh; background: rgba(0,0,0,0.5); display:flex; justify-content:center; align-items:center; z-index:1000;";
    
    // 모달 박스 생성
    const modal = document.createElement("div");
    modal.style.cssText =
        "background:white; padding:20px; border-radius:5px; text-align:center; min-width:300px;";
    
    // 게임오버 메시지 생성
    const message = document.createElement("p");
    message.innerText = "Game Over";
    
    // 재시작 버튼 생성
    const button = document.createElement("button");
    button.innerText = "다시 시작";
    button.style.cssText = "padding:5px 10px; margin-top:10px;";
    button.onclick = function() {
        location.reload();
        // document.body.removeChild(overlay);
        // 재시작 시 닉네임 입력 모달 다시 표시
        // socket.connect();
        // showNicknameModal();
    };
    
    // 모달 조립 및 DOM 추가
    modal.appendChild(message);
    modal.appendChild(button);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
}


socket.on("updatePlayers", (players) => { // EventLoop
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.fillRect(0,floor,3000,3000); /////////////// 바닥
    platforms.forEach(pl=>{
        ctx.fillRect(pl.x, pl.y, pl.width, pl.height);
    });
    
    // 화면에 플레이어 상태 업데이트
    players.forEach(player=>{
        drawPlayer(player);
    });
});

socket.on("updateFlatforms", (pls)=>{
    platforms = pls;

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

    drawNickname(p);

    drawHealthBar(p);
    drawAttack(p);
    drawAttackCoolTime(p);
}

function drawNickname(p){
    ctx.font = '20px Arial';
    ctx.fillStyle = 'white';       // 텍스트 색상
    ctx.textAlign = 'center';      // 텍스트 수평 중앙 정렬
    ctx.textBaseline = 'middle';   // 텍스트 수직 중앙 정렬
  
    // 텍스트 그리기: 사각형의 중앙 위치 (x: 50+200/2, y: 50+100/2)
    ctx.fillText(p.nickname, p.x + 0.5*p.width, p.y+ 0.5*p.height);
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

    if(p.id===socket.id){ // 자신 체력 상단 표시
        const myWidth = p.width*3;
        const myHeight = 30;
        const myX=10;
        const myY=10;

        ctx.fillStyle = "red";
        ctx.fillRect(myX, myY, myWidth, myHeight);

        ctx.fillStyle = "green";
        const currentHealthWidth = (p.health / p.maxHealth) * myWidth; // 현재 체력 비율 적용
        ctx.fillRect(myX, myY, currentHealthWidth, myHeight);



        // 체력 표기
        ctx.font = '20px Arial';
        ctx.fillStyle = 'white';       // 텍스트 색상
        ctx.textAlign = 'center';      // 텍스트 수평 중앙 정렬
        ctx.textBaseline = 'middle';   // 텍스트 수직 중앙 정렬
        ctx.fillText(`${p.health}/${p.maxHealth}`, myX+myWidth*0.5, myY+myHeight*0.5);
    }
}
function drawAttack(p){
    // attack시 entity body 색상 변경 -> 없앰
    if (p.attack.attacking) {
        ctx.fillStyle = "rgba(255, 0, 0, 0.3)";
        ctx.fillRect(p.attack.x, p.attack.y, p.attack.attackRange, p.attack.height);
    }

}

function drawAttackCoolTime(p){
    const skillX = p.width*3 + 10*2;
    const skillY = 10;
    const leng = p.width;
    ctx.fillStyle = "white";
    ctx.globalAlpha = 0.5;
    ctx.fillRect(skillX, skillY, leng, leng);
    
    // ctx.fillStyle = "white";
    ctx.globalAlpha = 1;
    ctx.fillRect(skillX, skillY+leng-p.attack.coolTime/attackCool*leng, leng, p.attack.coolTime/attackCool * leng);
    
    ctx.fillStyle = 'black';      
    ctx.fillText("a", skillX+leng*0.5, skillY+leng*0.5);
}
