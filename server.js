const express = require('express');
const path = require('path');
require("dotenv").config();


const app = express();








// 정적 파일 제공
app.use(express.static(path.join(__dirname, 'public')));

// 루트 요청 시 index.html 제공
app.get('/', (req, res) => {

    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(process.env.SERVER_PORT, () => {
    console.log(`Server is running`);
});

const createSocket = require('./socket');

createSocket();