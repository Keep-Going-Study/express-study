var express = require('express');
var app = express();
var bodyParser= require('body-parser');
var fs = require("fs");

app.use(bodyParser.urlencoded({extended: false}));

app.set('views','./views_file');
app.set('view engine', 'pug');

app.get('/topic/new', function(req,res){
    fs.readdir('data',function(err, files){
        res.render('new.pug', {topics:files});
    });
});

app.get( ['/topic', '/topic/:topic_title'], function(req,res){
    fs.readdir('data',function(err, files){
        var topic_title = req.params.topic_title;
        if(topic_title){ // topic 페이지 접속 시
                fs.readdir('data',function(err, files){
                fs.readFile(`data/${topic_title}`, 'utf8', function(err,data){
                    res.render('view.pug', {topics:files, 
                                            title:topic_title,
                                            description:data
                                            });
                    });
                    
            });    
        }
        
        else{ // topic_title 값 없을 시
            res.render('view.pug', {topics:files,
                                    title: 'Welcome',
                                    description: "Hello Node.js"
                                    });   
        }
        
    });

});


app.post('/topic',function(req,res){
    var title= req.body.title;
    var description = req.body.description;
    fs.writeFile(`data/${title}`, description, function(err){
        if(err){
            console.log(err);
            res.status(500).send('Server Error');
        }
        else
            res.redirect(`/topic/${title}`);
    });
});

app.listen(8080,function(){
    console.log('Connected, 8080 port!');
})
