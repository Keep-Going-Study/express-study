const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const db = low(adapter);

db.defaults({ topic: [], author: [] }).write();

/*
db.get('author').push({
    id:1,
    name:'egoing',
    profile:'developer'
}).write();

db.get('topic').push({
    id:1,
    title:'lowdb',
    description:'lowdb is ...',
    author:1
}).write();

db.get('topic').push({
    id:2,
    title: 'mysql',
    description: 'mysql is ...',
    author: 1
}).write();
*/


// 데이터 읽기
console.log(db.get('topic').value());
console.log(db.get('topic').find({'title':'lowdb', 'author':1}).value());

// 데이터 수정
/*
db.get('topic')
    .find({'id':2})
    .assign({'title':'MySQL & MariaDB'})
    .write();
*/


// 데이터 삭제
db.get('topic')
    .remove({'id':2})
    .write();
