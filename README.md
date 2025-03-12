嘗試想要不要有 LAG 可以看錄影的實況   目前嘗試的結果  是會延遲10秒  但是可以錄影
這個版本測試環境是在 WINDOW10 下  
影片儲存在 E:\hls\  與 E:\hls1\ 
在 VS CODE 下使用 start node server.js 就可以執行
然後進入到  localhost:1000 就可以看到 二 台攝影機的即時錄影的影像

用下面指令  找出可用的裝置名稱
ffmpeg -list_devices true -f dshow -i dummy  

[dshow @ 000001944b227200] "USB2.0 PC CAMERA" (video)
[dshow @ 000001944b227200]   Alternative name "@device_pnp_\\?\usb#vid_1908&pid_2311&mi_00#7&14e0e638&0&0000#{65e8773d-8f56-11d0-a3b9-00a0c9223196}\global"
[dshow @ 000001944b227200] "USB2.0 PC CAMERA" (video)
[dshow @ 000001944b227200]   Alternative name "@device_pnp_\\?\usb#vid_1908&pid_2311&mi_00#7&c871309&0&0000#{65e8773d-8f56-11d0-a3b9-00a0c9223196}\global"
[dshow @ 000001944b227200] "Mic in at front panel (Pink) (Realtek High Definition Audio)" (audio)
[dshow @ 000001944b227200]   Alternative name "@device_cm_{33D9A762-90C8-11D0-BD43-00A0C911CE86}\wave_{4D026BA1-6B18-43F9-A95A-AE8E47D03E25}"
[dshow @ 000001944b227200] "Mic in at rear panel (Pink) (Realtek High Definition Audio)" (audio)
[dshow @ 000001944b227200]   Alternative name "@device_cm_{33D9A762-90C8-11D0-BD43-00A0C911CE86}\wave_{2EB313FA-8FD1-4328-9079-1A618835FCFF}"

video="@device_pnp_\\?\usb#vid_1908&pid_2311&mi_00#7&14e0e638&0&0000#{65e8773d-8f56-11d0-a3b9-00a0c9223196}\global"
或
video=@device_pnp_\\?\usb#vid_1908&pid_2311&mi_00#7&14e0e638&0&0000#{65e8773d-8f56-11d0-a3b9-00a0c9223196}\global
都可能會發生錯誤 也都可能可以執行  發生問題時要多嘗試  就會知道箇中道理  !? 哪有道理!!

下次就要用 nginx 嘗試看看
