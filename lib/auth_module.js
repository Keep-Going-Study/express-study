module.exports = {
    IsOwner:function(req, res){
        if(req.user){
            return true;
          } 
          else{
            return false;
          }
      
    },

    SetAuthStatusUI:function(req,res){ // 로그인 상태 UI 를 설정하는 함수
    var authStatusUI = `<a href="/auth/login">login</a> | <a href="/auth/register">Register</a>`;
    if(this.IsOwner(req,res)){
       authStatusUI = `Hi , <strong>${req.user.nickname}</strong> | <a href="/auth/logout">logout</a>`; 
    }
    return authStatusUI;
  
    }
};