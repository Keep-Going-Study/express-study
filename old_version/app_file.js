var express = require('express');
var app = express();
var bodyParser= require('body-parser');
var fs = require("fs");

app.use(bodyParser.urlencoded({extended: false}));

app.set('views','./views_file');
app.set('view engine', 'pug');

app.get('/topic/new', function(req,res){
    res.render('new.pug');
});

app.get('/topic',function(req,res){
    fs.readdir('data',function(err, files){
        if(err){
            console.log(err);
            res.status(500).send('Server Error');
        }
        else
            res.render('view.pug', {topics:files});
    })
    
})

app.post('/topic',function(req,res){
    var title= req.body.title;
    var description = req.body.description;
    fs.writeFile(`data/${title}`, description, function(err){
        if(err){
            console.log(err);
            res.status(500).send('Server Error');
        }
        else
            res.send('Success');
    });
});

app.listen(8080,function(){
    console.log('Connected, 8080 port!');
})
