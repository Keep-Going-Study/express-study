var express = require('express');
var app = express();
var cookieParser = require('cookie-parser');

app.use(cookieParser('armhohwa')); // 쿠키암호화를 키 값 대입

// 간단한 카운터 프로그램 실습 

/*
app.get('/count',function(req,res){
    if(req.signedCookies.count){ // 기존에 쿠키값이 존재한다면
    // signedCookies : 암호화된 쿠키
        var count = parseInt(req.signedCookies.count);
        // cookie 값은 문자이므로 int로 변환시켜줌
    }
    else{ // 기존에 쿠키가 없다면
        var count = 0;
        res.cookie('count', count+1 , {signed:true});
        res.send(`count : ${count}`);
    }
    
    res.cookie('count', count+1, {signed:true});
    res.send(`count : ${count}`);
    
});

app.listen(8080, function(){
    console.log('Connected, 8080 port!!');
});
*/


// 쿠키를 활용한 장바구니 구현

var products = {
    1:{
        title: 'Cayenne'
    },
    2:{
        title: 'Range Rover'
    }
}
app.get('/',function(req,res){
    res.redirect('/products');
})

app.get('/products', function(req,res){
    var output = '';
    
    for(var name in products){
        output += `
            <li>
                <a href="/cart/${name}">${products[name].title}</a>
            </li>`;
        //console.log(name);
        console.log(products[name].title);
    }
    res.send(`<h1>Products</h1>
            <ul>${output}</ul>
            <a href="/cart">Cart</a>`); 
});

app.get('/cart/:id', function(req,res){
    var id = req.params.id;
    if(req.signedCookies.cart){ // 기존 쿠키가 있을 때
        var cart = req.signedCookies.cart;
    }
    else{ // 쿠키가 없을 때
        var cart = {}; // cart 를 객체로 설정
    }
    
    if(!cart[id]){
        cart[id] = 0;
    }
    cart[id] = parseInt(cart[id])+1;
    res.cookie('cart',cart,{signed:true});
    res.redirect('/cart');
    
});

app.get('/cart', function(req,res){
   var cart = req.signedCookies.cart;
   if(!cart){
       res.send('Empty');
   }
   else{
       var output = '';
       for(var id in cart){
           output += `<li>${products[id].title} : ${cart[id]} 개</li>`;
       }
   }
   
   res.send(`<h1>Cart</h1>
            <ul>${output}</ul>
            <a href='/products'> Products List</a>`);
});

app.listen(8080, function(){
    console.log('Connected, 8080 port!!');
});




