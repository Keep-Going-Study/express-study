var express = require('express');
var app = express();
var cookieParser = require('cookie-parser');

app.use(cookieParser());

app.get('/',function(req,res){
    if(req.cookies.count){ // 기존에 쿠키값이 존재한다면
        var count = parseInt(req.cookies.count);
        // cookie 값은 문자이므로 int로 변환시켜줌
    }
    else{ // 기존에 쿠키가 없다면
        var count = 0;
        res.cookie('count', count+1);
        res.send(`count : ${count}`);
    }
    
    res.cookie('count', count+1);
    res.send(`count : ${req.cookies.count}`);
    
})

app.listen(8080, function(){
    console.log('Connected, 8080 port!!');
})