
//設定 環境變數 process.env.這裡是變數名稱
//這樣就可以接收 從外部接收環境變數的設定
//Power Shell 要設定環境變數要先使用    $env:變數名稱=設定的內容     然後按下ENTER  就設定環境變數了
const DEVICE_PORT = process.env.DEVICE_PORT || 3100; // 使用環境變數 DEVICE_PORT
const DEVICE_MAC = process.env.DEVICE_MAC || 'video=@device_pnp_\\\\?\\usb#vid_1908&pid_2311&mi_00#7&c871309&0&0000#{65e8773d-8f56-11d0-a3b9-00a0c9223196}\\global'; // 使用環境變數 DEVICE_MAC

const DEVICE_DRIVER_NAME =  process.env.DEVICE_DRIVER_NAME || 'E:' ; //儲存影片的主機磁碟機名稱
const DEVICE_DIRECTORY =  process.env.DEVICE_DIRECTORY || 'hls' ; //儲存影片的主機目錄名稱

// let deviceName = 'video=@device_pnp_\\\\?\\usb#vid_1908&pid_2311&mi_00#7&c871309&0&0000#{65e8773d-8f56-11d0-a3b9-00a0c9223196}\\global' ;
let deviceName = DEVICE_MAC ;


console.log(DEVICE_MAC);
console.log(DEVICE_DRIVER_NAME);
console.log(DEVICE_DIRECTORY);
console.log(DEVICE_PORT);

//Cross-Origin Resource Sharing
const cors = require('cors'); 

// 引用簡易伺服器框架功能
const express = require('express');

// 引入 Node.js 的內建模組 path
// 用來  處理、操作  文件路徑
const path = require('path');

//引入子進程的 spawn() 方法給 spawn 變數
const { spawn } = require('child_process'); 

// 引入 FileSystem 模組 
const fs = require('fs');

// 設定伺服器變數 app 之後就會是伺服器了歐!!
const app = express(); 

// 設定伺服器的監聽的阜
const PORT = DEVICE_PORT; 

//電腦中 ffmpeg.exe 檔案位置在這裡，所以是這樣子
// JS 的 \ 跟 C 語言一樣是跳脫字元(控制字元)
// 所以要顯示  \  必須要用 \\
// const ffmpegPath = 'C:\\ffmpeg\\bin\\ffmpeg.exe'; 
// 上面當設定環境變數有問題時，可以先用來測試用
// 下面是環境變數設定好，就可以直間使用
const ffmpegPath = 'ffmpeg.exe'; 

// 定義 ffmpeg 變數
// 這樣比較好操作 ffmpeg 
let ffmpeg; 

// 註冊伺服器使用的位置
// 加入專案目錄下的 public 目錄
// __dirname 是目前專案目錄
// public 是手動自己建立的資料夾
// path.join() 會把內部的參數，變成路徑傳送出來
// 要注意上面有先設定 path LIB 給 path 變數
app.use(express.static(path.join(__dirname, 'public')));

// 註冊伺服器使用的位置
// 當使用者要求  /hls 時，會到這個目錄去處理對應要求的動作
app.use('/hls', express.static(path.join(DEVICE_DRIVER_NAME , DEVICE_DIRECTORY)));

// 註冊伺服器使用 跨資源分享功能 
// 本範例似乎沒用到這個
app.use(cors()); 
// 回應客戶端 request 要求
// 當使用者要訪問 伺服器 IP:PORT 時，伺服器回應的動作
// 在這裡是 response 回應一個網頁檔案回去 index.html
// 只是這個 index.html 在目錄中，所以用 path() 方法
// 當訪問 / 根路由，回應 index.html 檔案
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html' ));
});
// 對於 favicon.ico 的 404 錯誤
app.get('/favicon.ico', (req, res) => res.status(204));

// 設置 MIME 類型並提供動態檔案
// 收到 get 客戶端的 req 要求，伺服端回應 res 檔案
// 而回應的檔案類型，有時若沒有設定，客戶端會發生問題
// 而設定回應的檔案類型，就是 MIME 類型設定
app.get('/hls/output:dynamicId.m3u8', (req, res) => {
    // 獲取動態部分  :dynamicid 這部分變成變數
    const dynamicId = req.params.dynamicId; 
    // 產生包含路徑的動態檔案名稱
    // 儲存檔案名稱為目前時間的 yyyymmddHHMMSS.m3u8
    // 年月日時分秒.m3u8
    const filePath = path.join(DEVICE_DRIVER_NAME , DEVICE_DIRECTORY, `output${dynamicId}.m3u8`); 
    // 設定 MIME 類型為 m3u8 的視訊檔案
    res.set('Content-Type', 'application/vnd.apple.mpegurl'); 
    // 回應檔案，如果發生錯誤就執行 (err){...} 後面段程序
    res.sendFile(filePath, (err) => {
        if (err) {
            res.status(err.status).end(); // 處理錯誤情況
        }
    });
});

// 收到 get 客戶端 hls/:segment 路由請求時，回應視訊檔案給客戶端
app.get('/hls/:segment', (req, res) => {
    // 從路由名稱中取出檔案名稱(包含副檔名) :segment
    // 用 path() 方法，傳回 E:\hls\檔案名稱(包含副檔名)
    const filePath = path.join(DEVICE_DRIVER_NAME , DEVICE_DIRECTORY, req.params.segment); 
    // 設定 MIME 類型
    res.set('Content-Type', 'video/MP2T'); 
    res.sendFile(filePath);
});

// 新增 API 路由以獲取 HLS 目錄中的檔案名稱
app.get('/api/hls-files', (req, res) => {
    const hlsDirectory = path.join(DEVICE_DRIVER_NAME , DEVICE_DIRECTORY);
    fs.readdir(hlsDirectory, (err, files) => {
        if (err) {
            return res.status(500).json({ error: '無法讀取目錄' });
        }
        // 過濾出 m3u8 檔案
        const m3u8Files = files.filter(file => file.endsWith('.m3u8'));
        res.json(m3u8Files); // 返回檔案名稱的 JSON 陣列
    });
});

// 取得新的錄影檔案名稱
function getNewOutputFileName()  {
    // 執行時的日期和時間格式，例如 yyyymmddHHMMSS。
    // 產生一個 Date() 物件，並且指定給 now 變數，now 就是 Date 物件的實體
    const now = new Date(); 
    // 轉換格式為 yyyymmddHHMMSS
    // /[-:T]/g 正則表示法，找尋字串中包含字元 - : T 並用空字串取代     
    const formattedDate = now.toISOString().replace(/[-:T]/g, '').slice(0, 14);
    // 生成新的檔案名稱
    const  outputFileName1 = path.join(DEVICE_DRIVER_NAME , DEVICE_DIRECTORY, `output_${formattedDate}.m3u8`) ; 
    return outputFileName1 ;
}



// 在伺服器啟動時開始錄影和錄音
function startRecording() {
    //取得新的錄影檔案名稱
    const outputFileName1 = getNewOutputFileName() ;
    ffmpeg = spawn(ffmpegPath, [
        '-f', 'dshow',
        //'-framerate', '15', // 幀率   設定後比不設定更慘!!?
        '-video_size', '640x480', // 解析度
        '-rtbufsize', '100M', // 設置視訊緩衝區大小為 50MB        
        '-i', deviceName ,
        '-f', 'dshow',
        '-rtbufsize', '50M', // 設置音訊緩衝區大小為 50MB
        '-i', 'audio=Mic in at rear panel (Pink) (Realtek High Definition Audio)', // 錄音硬體
        // '-i', 'audio=Mic in at front panel (Pink) (Realtek High Definition Audio)', // 錄音硬體
        '-c:v', 'libx264', // 使用 H.264 編碼
        '-c:a', 'aac', // 使用 AAC 編碼
        '-strict', 'experimental', // 允許使用實驗性編碼器 
        
        '-framerate', '15', // 幀率
        '-hls_time', '2', // 每個 HLS 片段的持續時間  設定 5 秒長度
        '-hls_list_size', '0', // 0 生成所有片段   2 代表產生 2 個片段  2 * 上面的設定 的影片長度?!
        '-f', 'hls', // 設置輸出格式為 HLS
        // 'hls/output.m3u8' // 輸出文件名稱
        // 取代上面那行指令
        outputFileName1
    ]);
    // 發生標準錯誤時在終端機顯示訊息
    ffmpeg.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });
    // 發生錯誤事件時在終端機顯示訊息
    ffmpeg.on('error', (error) => {
        console.error(`Failed to start subprocess: ${error}`);
    });
    // 發生關閉事件時在終端機顯示訊息
    ffmpeg.on('close', (code) => {
        console.log(`ffmpeg exited with code ${code}`);
    });
}

// 啟動錄影的路由
app.post( '/start' , (req , res) =>{
    if (ffmpeg){
        //正在錄影狀態
        res.send('正在錄影中');
    }
    else{
        //開始錄影的程序
        startRecording();
        res.send('重新開始錄影');
    }
});

// 停止錄影的路由
app.post('/stop', (req, res) => {
    if (ffmpeg) {
        // 使用 SIGINT 信號來停止 ffmpeg 進程
        ffmpeg.kill('SIGINT');
        ffmpeg = null; // 清空 ffmpeg 變數
        res.send('錄影已停止');
    } else {
        res.send('沒有正在進行的錄影');
    }
});

// 啟動錄影  伺服器執行時  執行
startRecording();

// 啟動伺服器
app.listen(PORT, () => {
    console.log(`伺服器正在運行在 http://localhost:${PORT}`);
});