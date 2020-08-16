const express = require('express');
const app = express();

var fs = require('fs');
var template = require('./lib/template.js');
var qs = require('querystring');
var bodyParser = require('body-parser');
var compression = require('compression');
var helmet = require('helmet');
var session = require('express-session')
var FileStore = require('session-file-store')(session);
var flash = require('connect-flash');

var topicRouter = require('./routes/topic');
var indexRouter = require('./routes/index');

var db = require('./lib/db');



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

var passport = require('./lib/passport_module')(app);
var authRouter = require('./routes/auth')(passport);

app.use(flash());

app.get('/flash',function(req,res){
    req.flash('msg','Flash is back!!'); // session에 데이터 삽입
    res.send('flash');
});

app.get('/flash-display', function(req,res){
    var fmsg = req.flash();
    console.log('fmsg : ',fmsg);
    res.send(fmsg);
});





/******* 미들웨어 작성***********/
// '*' 는 모든 URL 을 뜻함
// 이 라우터는 맨 위에 있어야함
app.get('*', function(req, res, next){
    req.list = db.get('topics').value();
    next();
});
/********************************/


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

