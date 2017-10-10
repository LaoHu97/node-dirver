/**
 * 用户信息
 */
var mongoose = require('./db.js'),
    Schema = mongoose.Schema;

var UserSchema = new Schema({
    username : { type: String },                    //用户账号
    userpwd: {type: String},                        //密码
});
// UserSchema.index({id: 1});

module.exports = mongoose.model('Admin',UserSchema);
