// nodejs 에서의 mysql 실행 연습

var mysql = require('mysql');
var db = mysql.createConnection({
    host: 'localhost', // db 서버의 주소 
    user: 'soul4927',
    password: '9815chs',
    database: 'o2'
});

db.connect();

// READ
//var sql = 'SELECT * FROM topic';

/* CREATE
var sql = 'INSERT INTO topic (title,description,author) VALUES(?,?,?)';
var params = ['Supervisor', 'Watcher', 'guru'];
*/

/* UPDATE
var sql = 'UPDATE topic SET title=?, author=? WHERE id=?';
var params = ['NPM', 'mark', 2 ];
*/

/* DELETE */
var sql = 'DELETE FROM topic WHERE id=?';
var params = [4];

db.query(sql, params, function(err,result){
    console.log(result);
});

db.end();