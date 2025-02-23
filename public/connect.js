SOCKET_PORT = 25566;
// const socket = io();

// function sendMessage() {
//     const input = document.getElementById('messageInput');
//     socket.emit('message', input.value);
//     input.value = ''; // 입력창 초기화
// }

// socket.on('message', (msg) => {
//     const li = document.createElement('li');
//     li.textContent = msg;
//     document.getElementById('messages').appendChild(li);
// });
// console.log(config.socketUrl);
const socket = io('http://givemepresent.servegame.com:25566'); // 서버 주소로 연결
// 서버와 연결되었을 때
socket.on("connect", () => {
    const userData = {
        nickname: "hi"
    }
    socket.emit("login",userData);
});

// // 서버에서 메시지를 받을 때
// socket.on("message", (data) => {
//     console.log("Received message:", data);
// });

// // 서버에 메시지를 보낼 때
// function sendMessage(msg) {
//     socket.emit("message", msg);
//     console.log("Sent message:", msg);
// }

// // 버튼 클릭 시 메시지 보내기 (HTML과 연동할 경우)
// document.getElementById("sendBtn").addEventListener("click", () => {
//     const msg = document.getElementById("messageInput").value;
//     sendMessage(msg);
// });
