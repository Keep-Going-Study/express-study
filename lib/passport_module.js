var db = require('../lib/db');
var bcrypt = require('bcrypt');

// passport 에 관한 함수들을 모듈로 분리
// app 객체를 입력 파라미터로 받고, passport 객체를 리턴한다.
module.exports = function(app){
    
    var passport = require('passport');
    var LocalStrategy = require('passport-local').Strategy;

    app.use(passport.initialize());
    app.use(passport.session());

    // 로컬전략 객체 생성
    passport.use(new LocalStrategy(
        {
              usernameField: 'email',
              passwordField: 'pwd'
        },
        function(email, password, done) { // 인증 메서드(사용자가 로그인 요청을 보낼 때 이 콜백이 실행됨)
            console.log('LocalStrategy : ', email,' / ' ,password);
            
            var user = db.get('users').find({
                'email':email,
            }).value();
            
            
            if(user){ 
                
                bcrypt.compare(password, user.password, function(err,result){
                    
                    console.log('before bcrypt :',password);
                    console.log('after bcrypt :',user.password);
                    
                    if(result){
                        return done(null,user,{
                            message: 'Welcome!'
                        });
                    }
                    
                    else{
                        return done(null,false,{
                            message: 'Password error'
                        });
                    }
                });
            }
            else{ 
                return done(null,false,{
                    message: 'Email error'
                });
            }
            
        }
    ));
    
    // serializeUser : 로그인 성공 후에 사용자 정보를 세션 스토어에 저장하는 함수(최초 1회 호출)
    passport.serializeUser(function(user,done){
        //console.log('seraialzeUser Test', user);
        done(null,user.id); // 세션에 user.id (short id) 을 저장
        // done 의 2번째인자는 deserializeUser 의 콜백 첫 번째 인자로 들어간다.
    });
    
    // deserializeUser : 로그인이 되어 있을 때 각각의 페이지를 방문할 때 호출되는 함수(페이지 방문 마다 호출)
    passport.deserializeUser(function(id,done){
        var user = db.get('users').find({'id':id}).value();
        //console.log('deserializeUser Test ', 'id : ', id, ',user : ', user);
        done(null, user); 
    });
    
    return passport;
};