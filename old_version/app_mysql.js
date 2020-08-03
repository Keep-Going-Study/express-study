var express = require('express');
var app = express();
var bodyParser= require('body-parser');
var fs = require('fs');
var multer = require('multer'); // 

var _storage = multer.diskStorage({
    destination: function(req,file,cb){ // cb : callback
        cb(null, './uploads/')
    },
    filename: function(req,file,cb){ 
        cb(null,file.originalname);
    }
});
var upload = multer({storage: _storage}); 

var mysql = require('mysql');
var db = mysql.createConnection({
    host: 'localhost', // db 서버의 주소 
    user: 'soul4927',
    password: '9815chs',
    database: 'o2'
});

db.connect();


app.use(bodyParser.urlencoded({extended: false}));

app.set('views','./views_mysql');
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
app.get( ['/topic', '/topic/:id'], function(req,res){
    var sql = 'SELECT id,title FROM topic';
    db.query(sql,function(err,result1,fields){ // result1 은 topic 테이블의 모들 레코드 가져옴
        var id = req.params.id;
        
        if(id){ // id 값이 있으면 상세보기 페이지
            var sql = 'SELECT * FROM topic WHERE id=?';
            db.query(sql, id, function(err,result2){ // result2 는 입력받은 id 의 레코드만 가져옴 
                res.render('view.pug', {topics:result1, topic:result2[0]});
            })
        }
        
        else{ // id 값이 없으면 메인페이지
            res.render('view.pug',{topics:result1}); 
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
