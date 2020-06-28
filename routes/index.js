var template = require('../lib/template.js');

var express = require('express');
var router = express.Router();

function authIsOwner(req, res){
    if(req.session.is_logined){
        return true;
      } 
      else{
        return false;
      }
      
}

function SetauthStatusUI(req,res){ // 로그인 상태 UI 를 설정하는 함수
    var authStatusUI = `<a href="/auth/login">login</a>`;
    if(authIsOwner(req,res)){
       authStatusUI = `Hi , <strong>${req.session.nickname}</strong> | <a href="/auth/logout">logout</a>`; 
    }
    return authStatusUI;
  
}

router.get('/', (req,res) => {
    var title = 'Welcome';
    var description = 'Hello, Node.js';
    var list = template.list(req.list);
    var html = template.HTML(title, list,
      `<h2>${title}</h2>${description}
      <img src="/images/welcome.jpg" style="width:300px; 
      display:block; margin-top:10px;">`,
      `<a href="/topic/create">create</a>`,
      SetauthStatusUI(req,res)
    );

    /* Node.js 의 response 객체
    res.writeHead(200);
    res.end(html);
    */

    // express 의 response 객체
    res.status(200).send(html);
    // 또는 res.send(html);

});

module.exports = router;