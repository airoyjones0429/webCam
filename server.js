const express = require('express') ;
const path = require('path') ;
const app = express();
const PORT = 1000 ;

app.get('/' , (req,res ) =>{
    res.sendFile( path.join( __dirname, 'public' , 'ctrol.html') )
} );

app.listen(PORT , ()=> {
    console.log(`影像伺服器正在 ${PORT} 執行中 `);
} ) ;