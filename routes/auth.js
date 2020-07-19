var fs = require('fs');
var template = require('../lib/template.js');
var path = require('path');
var sanitizeHtml = require('sanitize-html');

var express = require('express');
var router = express.Router();

var low = require('lowdb');
var FileSync = require('lowdb/adapters/FileSync');
var adapter = new FileSync('db.json');
var db = low(adapter);

db.defaults({users:[]}).write();

module.exports = function(passport){
    
    router.get('/login', function(req,res){
    
    var fmsg = req.flash();
    var feedback = '';
    if(fmsg.error){
        feedback = fmsg.error[0];
    }
    
    var title = 'WEB - login';
    var list = template.list(req.list);
    var html = template.HTML(title,list, 
                `   <div style="color:red;">${feedback}</div>
                    <form action="/auth/login_process" method="post">
                        <p><input type="text" name="email" placeholder="email"></p>
                        <p><input type="password" name="pwd" placeholder="password"></p>
                        <p><input type="submit" value="login"></p>
                    </form>
                `,'');
    res.send(html);
    });
    
    router.post('/login_process',
        passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/auth/login',
            failureFlash:true,
            successFlash:true
        })
     );
     
    router.get('/register', function(req,res){
    
        var title = 'WEB - Register';
        var list = template.list(req.list);
        var html = template.HTML(title,list, 
                    `  
                        <form action="/auth/register_process" method="post">
                            <p><input type="text" name="email" placeholder="email" value="chs98105@gmail.com"></p>
                            <p><input type="password" name="pwd" placeholder="password" value="9815"></p>
                            <p><input type="password" name="pwd2" placeholder="password check" value="9815"></p>
                            <p><input type="text" name="displayName" placeholder="Nickname" value="soul"></p>
                            <p><input type="submit" value="register"></p>
                        </form>
                    `,'');
        res.send(html);
    });
     
    router.post('/register_process', function(req,res){
       var post = req.body;
       var email = post.email;
       var pwd = post.pwd;
       var pwd2 = post.pwd2;
       var displayName = post.displayName;
       
       db.get('users').push({
           email:email,
           password:pwd,
           displayName:displayName
       }).write();
       
       res.redirect('/');
    });

    router.get('/logout', function(req,res){
        req.logout();
        req.session.save(function(){
            res.redirect('/');
        });
    });
    
    return router;
}


