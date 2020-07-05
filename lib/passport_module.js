// passport 에 관한 함수들을 모듈로 분리
// app 객체를 입력 파라미터로 받고, passport 객체를 리턴한다.
module.exports = function(app){
    
    var authData = {    // 실제에서는 DB에 저장해야함
        email: 'chs98105@gmail.com',
        password: '9815',
        nickname: 'soul'
    };
    
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
        function(username, password, done) { // 인증 메서드(사용자가 로그인 요청을 보낼 때 이 콜백이 실행됨)
            console.log('LocalStrategy', username, password);
            if(username === authData.email){ // 실제로는 DB 의 사용자정보와 비교
                //console.log(1);
                if(password === authData.password){
                    //console.log(2);
                    return done(null, authData, {
                        message: 'Login Success'
                    });    
                    // 로그인 성공 후에는 serializeUser() 가 실행된다.
                }
                else{
                    //console.log(3);
                    return done(null, false, {
                        message: 'Incorrect password' // Flash message 의 내용으로 넘어감
                    });
                }
            }
            else{
                console.log(4);
                return done(null, false, {
                    message: 'Incorrect username' // Flash message 의 내용으로 넘어감
                });
            }
        }
    ));
    
    // serializeUser : 로그인 성공 후에 사용자 정보를 세션 스토어에 저장하는 함수(최초 1회 호출)
    passport.serializeUser(function(user,done){
        console.log('seraialzeUser Test', user);
        done(null,user.email); // 세션에 user.email 을 저장
    });
    
    // deserializeUser : 로그인이 되어 있을 때 각각의 페이지를 방문할 때 호출되는 함수(페이지 방문 마다 호출)
    passport.deserializeUser(function(user,done){
        //findById(id, function (err, user){ // in MongoDB
        console.log('deserializeUser Test', user);
        done(null, authData); // 실제로는 DB에서 불러와야함
    });
    
    return passport;
};