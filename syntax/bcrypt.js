const bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = '111111';
const someOtherPlaintextPassword = '222222';

bcrypt.hash(myPlaintextPassword, saltRounds, function(err,hash_pw){
    console.log(hash_pw);
    
    bcrypt.compare(myPlaintextPassword, hash_pw, function(err, result1){
        console.log('my password :', result1);
    });
    
    bcrypt.compare(someOtherPlaintextPassword, hash_pw, function(err, result2){
        console.log('other password :', result2);
    })
    
})