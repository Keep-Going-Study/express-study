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

app.get('/',function(req,res){
    res.redirect('/topic');
})

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


app.get('/topic/add', function(req,res){
    // topic 목록 보여주기
    var sql = 'SELECT id,title FROM topic';
    db.query(sql, function(err,result){
        res.render('add.pug',{topics: result});
    });
});


app.post('/topic/add',function(req,res){
    var title= req.body.title;
    var description = req.body.description;
    var author = req.body.author;
    
    var sql = 'INSERT INTO topic (title,description,author) VALUES (?,?,?)';
    db.query(sql, [title,description,author] ,function(err,result){
        res.redirect(`/topic/${result.insertId}`); // 결과페이지를 리다이렉트 
    });
    
});

// 수정기능 ( 수정 form 페이지 생성)
app.get( '/topic/:id/edit', function(req,res){
    
    var sql = 'SELECT id,title FROM topic';
    db.query(sql,function(err,result1,fields){ // result1 은 topic 테이블의 모들 레코드 가져옴
        var id = req.params.id;
        
        if(id){ // id 값이 있으면 수정 폼 페이지
            var sql = 'SELECT * FROM topic WHERE id=?';
            db.query(sql, id, function(err,result2){ // result2 는 입력받은 id 의 레코드만 가져옴 
                res.render('edit.pug', {topics:result1, topic:result2[0]});
            })
        }
        
        else{ // id 값이 없으면 메인페이지
            res.render('view.pug',{topics:result1}); 
        }
        
    });
    
});

// 수정기능 ( post 로 데이터 처리)
app.post('/topic/:id/edit', function(req,res){
    
    var title = req.body.title;
    var description = req.body.description;
    var author = req.body.author;
    var id = req.params.id;

    var sql = 'UPDATE topic SET title=?, description=?, author=? WHERE id=?';
    db.query(sql,[title,description,author,id],function(err,result1,fields){ // result1 은 topic 테이블의 모들 레코드 가져옴
        res.redirect(`/topic/${id}`);
    });
    
});

// 실제 삭제하는 과정이 아니라 삭제 여부를 물어보는 페이지
app.get('/topic/:id/delete', function(req,res){
    var sql = 'SELECT id,title FROM topic';
    var id = req.params.id;
    db.query(sql,function(err,result1,fields){
        var sql = 'SELECT * FROM topic WHERE id=?';
        db.query(sql, id, function(err,result2){
            if(result2.length === 0){
               res.render('delete.pug',{topics:result1});
            }
           res.render('delete.pug',{topics:result1, topic:result2[0]});
        });
        
    });
});

// 실제 삭제과정은 post 로 처리해야함
app.post('/topic/:id/delete', function(req,res){
   var id = req.params.id;
   var sql = 'DELETE FROM topic WHERE id=?';
   db.query(sql,id,function(err,result){
        res.redirect('/topic');
   });
});


// 읽기기능 (복수 라우팅 처리)
app.get( ['/topic', '/topic/:id'], function(req,res){
    var sql = 'SELECT id,title FROM topic';
    db.query(sql,function(err,result1,fields){ // result1 은 topic 테이블의 모들 레코드 가져옴
        var id = req.params.id;
        
        if(id){ // id 값이 있으면 상세보기 페이지
            var sql = 'SELECT * FROM topic WHERE id=?';
            //console.log(1);
            db.query(sql, id, function(err,result2){ // result2 는 입력받은 id 의 레코드만 가져옴 
                res.render('view.pug', {topics:result1, topic:result2[0]});
            })
        }
        
        else{ // id 값이 없으면 메인페이지
            //console.log(2);
            res.render('view.pug',{topics:result1}); 
        }
        
    });

});


app.listen(8080,function(){
    console.log('Connected, 8080 port!');
})
