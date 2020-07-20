var fs = require('fs');
var template = require('../lib/template.js');
var path = require('path');
var sanitizeHtml = require('sanitize-html');

var express = require('express');
var router = express.Router();
var auth = require('../lib/auth_module.js');

var db = require('../lib/db');
var shortid = require('shortid');

router.get('/create', function(req, res){
    if(!auth.IsOwner(req,res)){
       res.redirect('/auth/login'); 
       return false;
    }
    var title = 'WEB - create';
    var list = template.list(req.list);
    var html = template.HTML(title, list, `
      <form action="/topic/create_process" method="post">
        <p><input type="text" name="title" placeholder="title"></p>
        <p>
          <textarea name="description" placeholder="description"></textarea>
        </p>
        <p>
          <input type="submit">
        </p>
      </form>
    `, '',
    auth.SetAuthStatusUI(req,res));
    res.send(html);
  
});

router.post('/create_process', function(req, res){
    if(!auth.IsOwner(req,res)){
       res.redirect('/auth/login'); 
       return false;
    }
    //console.log('req.body: ',req.body);
    var post = req.body;
    var title = post.title;
    var description = post.description;
    
    var id = shortid.generate();
    
    db.get('topics').push({
        'id': id,   // 글 자체의 id
        'title': title,
        'description' : description,
        'user_id': req.user.id // 글 작성자의 id
    }).write();
    
    res.redirect(`/topic/${id}`);
    
    /*
    var body = '';
      req.on('data', function(data){
          body = body + data;
      });
      req.on('end', function(){
          var post = qs.parse(body);
          var title = post.title;
          var description = post.description;
          fs.writeFile(`data/${title}`, description, 'utf8', function(err){
            res.redirect(302, `/page/${title}`);
          });
      });
    */
});

router.get('/update/:pageId', function(req, res){
    
    // 비로그인 유저일때 접근 통제
    if(!auth.IsOwner(req,res)){
       res.redirect('/auth/login'); 
       return false;
    }
    
    var topic = db.get('topics').find({
        'id':req.params.pageId
    }).value();
    
    // 해당 유저가 글 작성자가 아니면 수정 페이지 접근 통제
    if(topic.user_id !== req.user.id){
        req.flash('error','Not yours!');
        return res.redirect('/');
    }
    var title = topic.title;
    var description = topic.description;
    var list = template.list(req.list);
    var html = template.HTML(title, list,
        `
        <form action="/topic/update_process" method="post">
          <input type="hidden" name="id" value="${topic.id}">
          <p><input type="text" name="title" placeholder="title" value="${title}"></p>
          <p>
            <textarea name="description" placeholder="description">${description}</textarea>
          </p>
          <p>
            <input type="submit">
          </p>
        </form>
        `,
        `<a href="/topic/create">create</a> <a href="/topic/update/${topic.id}">update</a>`,
        auth.SetAuthStatusUI(req,res)
      );
      res.send(html);
    
      
});

router.post('/update_process', function(req, res){
    if(!auth.IsOwner(req,res)){
       res.redirect('/auth/login');  
       return false;
    }
    var post = req.body;
    var id = post.id;
    var title = post.title;
    var description = post.description;
    
    var topic = db.get('topics').find({
        'id': id
    }).value();
    
    // 작성자가 아니면 접근 통제하고 홈으로 리다이렉트
    if(topic.user_id !== req.user.id){
        req.flash('error','Not yours!');
        return res.redirect('/');
    }
    
    // 수정해주고 수정된 글로 리다이렉트
    else{
        db.get('topics')
            .find({'id':id})
            .assign({'title':title,
                     'description':description
            }).write();
        
        res.redirect(`/topic/${topic.id}`);
    
    }
    
    /*
    fs.rename(`data/${id}`, `data/${title}`, function(error){
      fs.writeFile(`data/${title}`, description, 'utf8', function(err){
        res.redirect(302, `/topic/${title}`);
      });
    });
    */
});

router.post('/delete_process', function(req, res){
    if(!auth.IsOwner(req,res)){
       res.redirect('/auth/login');  
       return false;
    }
    var post = req.body;
    var id = post.id;
    var filteredId = path.parse(id).base;
    fs.unlink(`data/${filteredId}`, function(error){
      res.redirect(302, '/');
    });
});

// 글 읽기
// :pageId 는 topic 의 id 값
router.get('/:pageId', function(req,res,next){
    if(!auth.IsOwner(req,res)){
       res.redirect('/auth/login'); 
       return false;
    }
  
    //console.log(req.params);
    //console.log(req.list);
    
    var topic = db.get('topics').find({
        'id': req.params.pageId
    }).value();
    
    var user = db.get('users').find({
        'id': topic.user_id
    }).value();
    
    console.log('topic : ',topic);
    console.log('user : ',user);
    
    var sanitizedTitle = sanitizeHtml(topic.title);
    var sanitizedDescription = sanitizeHtml(topic.description, {
        allowedTags:['h1']
    });
    var list = template.list(req.list);
    var html = template.HTML(sanitizedTitle, list,
    `<h2>${sanitizedTitle}</h2>${sanitizedDescription}
     <p>by ${user.displayName}</p>
    `,
    ` <a href="/topic/create">create</a>
    
      <a href="/topic/update/${topic.id}">update</a>
      <form action="/topic/delete_process" method="post">
        <input type="hidden" name="id" value="${sanitizedTitle}">
        <input type="submit" value="delete">
      </form>`,
      auth.SetAuthStatusUI(req,res)
    );
    res.send(html);

});


module.exports = router;