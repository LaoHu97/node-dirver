// /**
//  * 用户信息
//  */
// var mongoose = require('./db.js'),
//     Schema = mongoose.Schema;
//
// var UserSchema = new Schema({
//     username : { type: String },                    //用户账号
//     userpwd: {type: String},                        //密码
// });
// // UserSchema.index({id: 1});
//
// module.exports = mongoose.model('Admin',UserSchema);
// //增
// goodinsert:'INSERT INTO `good` (`id`,`name`,`desc`,`price`,`sum`) VALUES(0,?,?,?,?)',
// //删
// gooddelete: 'delete from good where id=?',
// //改
// goodupdate:'UPDATE `good` SET `name`=?,`desc`=?,`price`=?,`sum`=? WHERE `id`=?',
//   //查
var admin={
  adminAll: 'select * from admin',
  adminByusername: 'select * from admin where username=?'
}

module.exports=admin;
