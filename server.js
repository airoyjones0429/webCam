const express = require('express');
const { spawn } = require('child_process');
const path = require('path');
const app = express();
const PORT = 1000;

const JSFile1 = 'record.js';
const JSFile2 = 'record1.js';

// 定義啟動子進程的函數
function startProcess(jsFile) {
    const process = spawn('node', [jsFile]);

    // 監聽進程的輸出
    process.stdout.on('data', (data) => {
        console.log(`${jsFile} 輸出: ${data}`);
    });

    // 監聽進程的錯誤
    process.stderr.on('data', (data) => {
        console.error(`${jsFile} 錯誤: ${data}`);
    });

    // 監聽進程的結束
    process.on('close', (code) => {
        console.log(`${jsFile} 結束，退出碼: ${code}`);
    });

    return process;
}

// 伺服器啟動時啟動子進程
app.listen(PORT, () => {
    console.log(`影像伺服器正在 ${PORT} 執行中`);
    startProcess(JSFile1);
    startProcess(JSFile2);
});

// 設定根路由
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'ctrol.html'));
});