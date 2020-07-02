var fs = require('fs');
var template = require('./lib/template.js');
var qs = require('querystring');
var bodyParser = require('body-parser');
var compression = require('compression');
var helmet = require('helmet');
var session = require('express-session')
var FileStore = require('session-file-store')(session);


var topicRouter = require('./routes/topic');
var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');

const express = require('express');
const app = express();

/*
app.get('/', (req,res) => res.send('Hello World'));

위와 같은 코드

app.get('/', function(req,res){
  return res.send('/');
});
*/

app.use(express.static(__dirname +'/public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(compression());
app.use(helmet());

app.use(session({   // session 미들웨어 장착
  secret: '@#@$MYSIGN#@$#$',
  resave: false,
  saveUninitialized: true,
  store: new FileStore()
}));


var authData = {    // 실제에서는 DB에 저장해야함
    email: 'chs98105@gmail.com',
    password: '9815',
    nickname: 'soul'
};


/******* 미들웨어 작성***********/
// '*' 는 모든 URL 을 뜻함
// 이 라우터는 맨 위에 있어야함
app.get('*', function(req, res, next){
    fs.readdir('./data', function(error, filelist){
        req.list = filelist;
        next();
    });
});
/********************************/

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

app.use(passport.initialize());
app.use(passport.session());

// 로컬전략 객체 생성
passport.use(new LocalStrategy(
    
    {
          usernameField: 'email',
          passwordField: 'pwd'
    },
    function(username, password, done) { // 인증 메서드(사용자가 로그인 요청을 보낼 때 이 콜백이 실행됨)
        console.log('LocalStrategy', username, password);
        if(username === authData.email){ // 실제로는 DB 의 사용자정보와 비교
            //console.log(1);
            if(password === authData.password){
                //console.log(2);
                return done(null, authData);    
                // 로그인 성공 후에는 serializeUser() 가 실행된다.
            }
            else{
                //console.log(3);
                return done(null, false, {
                    message: 'Incorrect password'
                });
            }
        }
        else{
            console.log(4);
            return done(null, false, {
                message: 'Incorrect username'
            });
        }
    }
));

// serializeUser : 로그인 성공 후에 사용자 정보를 세션 스토어에 저장하는 함수(최초 1회 호출)
passport.serializeUser(function(user,done){
    console.log('seraialzeUser Test', user);
    done(null,user.email); // 세션에 user.email 을 저장
});

// deserializeUser : 로그인이 되어 있을 때 각각의 페이지를 방문할 때 호출되는 함수(페이지 방문 마다 호출)
passport.deserializeUser(function(user,done){
    //findById(id, function (err, user){ // in MongoDB
    console.log('deserializeUser Test', user);
    done(null, authData); // 실제로는 DB에서 불러와야함
})

app.post('/auth/login_process',
    passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/auth/login'
  }));
  

app.use('/', indexRouter);
app.use('/topic', topicRouter);
app.use('/auth', authRouter);


app.use(function(req,res,next){
   res.status(404).send("404 error"); 
});


app.use(function(err,req,res,next){
   console.error(err.stack);
   res.status(500).send('500 error');
});


app.listen(8080, ()=> console.log('Example app listening at 8080 port'));

