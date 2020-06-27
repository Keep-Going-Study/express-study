var express = require('express')
var parseurl = require('parseurl')
var session = require('express-session')
 
var app = express()
 
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))
 
app.get('/', function (req, res, next) {
  res.send('Hello Session');
})

app.listen(8080, function(){
    console.log('8080!');
});