// var mongoose = require('mongoose');
// mongoose.Promise = global.Promise;
// var DB_URL = 'mongodb://localhost:27017/logo';
//
// /**
//  * 连接
//  */
// mongoose.connect(DB_URL,{useMongoClient:true});
//
// /**
//   * 连接成功
//   */
// mongoose.connection.on('connected', function () {
//     console.log('连接成功' + DB_URL);
// });
//
// /**
//  * 连接异常
//  */
// mongoose.connection.on('error',function (err) {
//     console.log('连接异常' + err);
// });
//
// /**
//  * 连接断开
//  */
// mongoose.connection.on('disconnected', function () {
//     console.log('连接断开');
// });
// module.exports = mongoose;
// conf/db.js
// MySQL数据库联接配置
module.exports = {
    mysql: {
        host: 'rm-wz9gob6h6w2vf4prwo.mysql.rds.aliyuncs.com',
        user: 'root',
        password: 'Lhsgdd123',
        database:'node-video', // 前面建的user表位于些数据库中
        port: 3306
    }
};
