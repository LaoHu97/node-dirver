var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var DB_URL = 'mongodb://cosmos-db:3PtolYiQ0JRKM6SiKVhakE4oNqCDhNuj64TV5O9ARcRRinRP74cAZYHy7SsYWMtv3fPeavIS501HY5fwGTYMIg==@cosmos-db.documents.azure.cn:10255/?ssl=true';

/**
 * 连接
 */
mongoose.connect(DB_URL);

/**
  * 连接成功
  */
mongoose.connection.on('connected', function () {
    console.log('连接成功' + DB_URL);
});

/**
 * 连接异常
 */
mongoose.connection.on('error',function (err) {
    console.log('连接异常' + err);
});

/**
 * 连接断开
 */
mongoose.connection.on('disconnected', function () {
    console.log('连接断开');
});
module.exports = mongoose;
