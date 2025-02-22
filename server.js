const express = require('express');
const path = require('path');


const app = express();
const PORT = 25565;

// 정적 파일 제공
app.use(express.static(path.join(__dirname, 'public')));

// 루트 요청 시 index.html 제공
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
