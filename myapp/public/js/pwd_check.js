// 회원가입 시 pwd 와 pwd2 가 같은지 체크하는 모듈
// 프론트 단에서 실시간으로 검사

const pwd = document.getElementsByName('pwd')[0]; 
const pwd2 = document.getElementsByName('pwd2')[0]; 
const msg = document.getElementById('pwCheck');

pwd2.addEventListener('keyup', function(e){
    if(pwd.value !== pwd2.value){
        msg.innerHTML = '비밀번호가 일치하지 않습니다';
        msg.style.color = 'red';
    }
    else{
        msg.innerHTML = '비밀번호가 일치합니다';
        msg.style.color = 'blue';
    }

});

pwd.addEventListener('keyup', function(e){
    if(pwd.value !== pwd2.value){
        msg.innerHTML = '비밀번호가 일치하지 않습니다';
        msg.style.color = 'red';
    }
    else{
        msg.innerHTML = '비밀번호가 일치합니다';
        msg.style.color = 'blue';
    }

});