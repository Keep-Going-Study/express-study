var express = require('express');
var app = express();
var bodyParser= require('body-parser');
var fs = require("fs");

var mysql = require('mysql');
var conn = mysql.createConnection({
    host: 'localhost', // db 서버의 주소 
    user: 'soul4927',
    password: '9815chs',
    database: 'o2'
});

conn.connect();


app.use(bodyParser.urlencoded({extended: false}));

app.set('views','./views_file');
app.set('view engine', 'pug');

app.get('/upload',function(req,res){
    res.render('upload.pug')
});

app.post('/upload', upload.single('userfile'), function(req,res){
    /* upload.single('userfile') 미들웨어의 역할 : 제출된 form 데이터에
        파일이 포함돼있다면, req.file 프로퍼티를 추가한다.
        userfile 은 form 양식에서의 name 값이다.
    */
    res.send(`Uploaded : ${req.file.filename}`);
})

app.get('/topic/new', function(req,res){
    fs.readdir('data',function(err, files){
        res.render('new.pug', {topics:files});
    });
});

// 복수 라우팅 처리
app.get( ['/topic', '/topic/:topic_title'], function(req,res){
    fs.readdir('data',function(err, files){
        var topic_title = req.params.topic_title;
        if(topic_title){ // topic 페이지 접속 시
                fs.readdir('data',function(err, files){
                fs.readFile(`data/${topic_title}`, 'utf8', function(err,data){
                    res.render('view.pug', {topics:files, 
                                            title:topic_title,
                                            description:data
                                            });
                    });
                    
            });    
        }
        
        else{ // topic_title 값 없을 시
            res.render('view.pug', {topics:files,
                                    title: 'Welcome',
                                    description: "Hello Node.js"
                                    });   
        }
        
    });

});


app.post('/topic',function(req,res){
    var title= req.body.title;
    var description = req.body.description;
    fs.writeFile(`data/${title}`, description, function(err){
        if(err){
            console.log(err);
            res.status(500).send('Server Error');
        }
        else
            res.redirect(`/topic/${title}`);
    });
});

app.listen(8080,function(){
    console.log('Connected, 8080 port!');
})
