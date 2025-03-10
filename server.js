// 這個範例是使用 npm install node-webcam express
// node-webcam 是 CommandCam.exe 的 API
// 透過這個 node-webcam API 就可以操作 CommandCam.exe 的各種功能
// 主要設定的參數要注意的地方是 device
// device: 0 代表自動會取得 0 沒有 USBCAM
// device: 1 代表取得順序第 1 個 USBCAM
// device: 2 代表取得順序第 2 個 USBCAM
// ...

const express = require('express');
const path = require('path');
const NodeWebcam = require('node-webcam');
const fs = require('fs');

const app = express();
const port = 3000;

// 設定攝影機選項
const opts = {
    width: 320,
    height: 240,
    quality: 50,
     // 捕獲之前的延遲時間（毫秒），可以用來避免拍攝時的抖動。
    delay: 0,
    saveShots: false,
    //輸出檔案格式
    output: "png",
    //電腦 USB 抓到的第一台攝影機，依照硬體的順序!?  應該吧!
    device: 1, 
    // buffer   返回捕獲圖片的二進位緩衝區  
    // base64   返回捕獲圖片的 Base64 編碼字符串 這對於在網頁中直接嵌入圖片非常方便，
    //          因為你可以將 Base64 字符串直接用於 <img> 標籤的 src 屬性。
    // location 返回捕獲圖片的檔案路徑。這是最常用的選項，適合需要直接使用圖片檔案的情況。
    callbackReturn: "location",
    // 如果為 true 會傳回，執行的命令
    verbose: false
};

// 創建攝影機實例
const Webcam = NodeWebcam.create(opts);

// 提供靜態文件
app.use(express.static('public'));

// 捕獲圖片的路由
app.get('/capture', async (req, res) => {
    
    //拍攝照片
    Webcam.capture( "current_frame"); 

    //傳回照片檔案
    res.sendFile(path.join(__dirname,"current_frame.png"));
});


// 啟動伺服器
app.listen(port, () => {
    console.log(`伺服器運行在 http://localhost:${port}`);
});