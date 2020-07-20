var template = require('../lib/template.js');

var express = require('express');
var router = express.Router();
var auth = require('../lib/auth_module.js');


router.get('/', (req,res) => {
    console.log('/ req.user :', req.user);
    var fmsg = req.flash();
    var feedback = '';
    if(fmsg.success){
        feedback = fmsg.success[0];
    }
    if(fmsg.error){
        feedback = fmsg.error[0];
    }
    var title = 'Welcome';
    var description = 'Hello, Node.js';
    var list = template.list(req.list);
    var html = template.HTML(title, list,
      `<br></br><div style="color:blue;">${feedback}</div>
      <h2>${title}</h2>${description}
      <img src="/images/welcome.jpg" style="width:300px; 
      display:block; margin-top:10px;">`,
      `<a href="/topic/create">create</a>`,
      auth.SetAuthStatusUI(req,res)
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