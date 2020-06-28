var fs = require('fs');
var template = require('../lib/template.js');
var path = require('path');
var sanitizeHtml = require('sanitize-html');

var express = require('express');
var router = express.Router();

var authData = {
    email: 'chs98105@gmail.com',
    password: '9815',
    nickname: 'soul'
};

router.get('/login', function(request,response){
    var title = 'WEB - login';
    var list = template.list(request.list);
    var html = template.HTML(title,list, 
                `
                    <form action="/auth/login_process" method="post">
                        <p><input type="text" name="email" placeholder="email"></p>
                        <p><input type="password" name="pwd" placeholder="password"></p>
                        <p><input type="submit" value="login"></p>
                    </form>
                `,'');
    response.send(html);
});

router.post('/login_process', function(request,response){
    var post = request.body;
    var email = post.email;
    var password = post.pwd;
    
    if(email === authData.email && password === authData.password){
        response.send('Welcome!');
    } else{
        response.send('Who?');
    }
});

module.exports = router;