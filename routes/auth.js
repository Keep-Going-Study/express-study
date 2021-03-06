var fs = require('fs');
var template = require('../lib/template.js');
var path = require('path');
var sanitizeHtml = require('sanitize-html');

var express = require('express');
var router = express.Router();
var db = require('../lib/db');
var shortid = require('shortid');
var bcrypt = require('bcrypt');



module.exports = function(passport){
    
    router.get('/login', function(req,res){
    
    var fmsg = req.flash();
    console.log(fmsg);
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
    
        var fmsg = req.flash();
        var feedback = '';
        if(fmsg.error){
            feedback = fmsg.error[0];
        }
        var title = 'WEB - Register';
        var list = template.list(req.list);
        var html = template.HTML(title,list, 
                    `   <div style="color:red;">${feedback}</div>
                        <form action="/auth/register_process" method="post">
                            <p><input type="text" name="email" placeholder="email"></p>
                            <p><input type="password" name="pwd" placeholder="password"></p>
                            <p><input type="password" name="pwd2" placeholder="password check">
                                <span id='pwCheck' style='margin-left:10px'></span</p>
                            <p><input type="text" name="displayName" placeholder="Nickname"></p>
                            <p><input type="submit" value="register"></p>
                        </form>
                        <script src='/js/pwd_check.js'></script>
                    `,'');
        res.send(html);
    });
     
    router.post('/register_process', function(req,res){
       var post = req.body;
       var email = post.email;
       var pwd = post.pwd;
       var pwd2 = post.pwd2;
       var displayName = post.displayName;
       
       if(pwd !== pwd2){
            req.flash('error','Password must same!');
            res.redirect('/auth/register');
       } 
       else{
           
            bcrypt.hash(pwd,10,function(err,hash_pw){
            
            var user = db.get('users').find({email:email}).value();
            
            if(user){ // google login 한 사용자 계정이 존재할때
                user.password = hash_pw;
                user.displayName = displayName;
                db.get('users').find({id:user.id}).assign(user).write();
            }
            else{ // local 로 최초 회원가입
                var user={
                    id:shortid.generate(),
                    email:email,
                    password:hash_pw,   // hash 처리된 비밀번호를 DB에 저장한다.
                    displayName:displayName
                };
                
                db.get('users').push(user).write();
            }
           
                req.login(user,function(err){
                    return res.redirect('/');
                });
            })
            
         }
       
       
    });

    router.get('/logout', function(req,res){
        req.logout();
        req.session.save(function(){
            res.redirect('/');
        });
    });
    
    return router;
}


