var fs = require('fs');
var template = require('../lib/template.js');
var path = require('path');
var sanitizeHtml = require('sanitize-html');

var express = require('express');
var router = express.Router();

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

module.exports = router;