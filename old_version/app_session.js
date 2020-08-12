var express = require('express');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.urlencoded({ extended: false}));

// MySQL 세션store 사용 옵션
var options = {
    host: 'localhost',
    port: 3306,
    user: 'soul4927',
    password: '9815chs',
    database: 'session'
};
 
var sessionStore = new MySQLStore(options);

app.use(session({
    secret: 'sdf43jhsdfog', // 아무값이 넣으면 됨
    resave: false,
    saveUninitialized: true,
    store: sessionStore
}));


// 세션을 이용한 카운터 프로그램
/*
app.get('/count', function(req,res){
    if(req.session.count){
        req.session.count++;
    }
    else{
        req.session.count = 1;
    }
    console.log(req.session.count);
    res.send(`count: ${req.session.count}`);
    
    
});

app.listen(8080,function(){
    console.log('connected!');
})

*/

// 세션활용 로그인 구현

app.get('/',function(req,res){
    res.redirect('/auth/login');
})

app.get('/auth/login', function(req,res){
    var output = `
    <h1>Login</h1>
    <form action='/auth/login' method='post'>
        <p>
            <input type='text' name='username' placeholder='username'><br><br>
            <input type='password' name='password' placeholder='password'><br><br>
            <input type='submit'>
        </p>
    </form>
    `;
    res.send(output);
})

app.post('/auth/login', function(req,res){
    var user = {
        username:'soul',
        password:'9815',
        displayName:'choi'
    };
    var uname = req.body.username;
    var pwd = req.body.password;
    
    if(uname === user.username && pwd === user.password){
        req.session.displayName = user.displayName;
        console.log(req.session);
        res.redirect('/welcome');
    }
    else{
        res.send('Login error <a href="/">login</a>');
    }
    
});

// 로그아웃 기능 : session 에서 displayName 프로퍼티를 삭제
app.get('/auth/logout', function(req,res){
    delete req.session.displayName; // delete : JS 의 객체 프로퍼티 삭제 연산자
    req.session.save(function(){
        res.redirect('/welcome');   
    })
    
})

app.get('/welcome', function(req,res){
    if(req.session.displayName){ // 로그인한 유저가 접속한 경우
        res.send(`
        <h1>Hello, ${req.session.displayName}</h1>
        <a href='/auth/logout'>Logout</a>
        `);
    }
    else{ // 로그인 안한 유저가 접속한 경우
        res.send(`
        <h1>Welcome</h1>
        <a href="/auth/login">Login</a>
        `);
    }
})

app.listen(8080,function(){
    console.log('connected!');
})

// multl user 부터 보면됨

