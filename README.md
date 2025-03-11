嘗試改變傳回的資料型態為 base64 讓 index.html 接收    

或是使用  canvas  都沒辦法處理延遲的問題

但至至少知道 node-webcam 其實是使用 commandcam.exe 來處理

使用上感覺  似乎這個工具  沒辦法很快的回應資料  單純照相也要等約 1 秒

下次要改用 FFMpeg 的 node.js API 來處理
