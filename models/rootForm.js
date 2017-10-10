/**
 * 表单提交
 */
var mongoose = require('./db.js'),
    Schema = mongoose.Schema;

var FormSchema = new Schema({
    title : { type: String },//标题
    profiles: {type: String},//简介
    imageUrl : {type: String},//封面
    times : {type: String},//时间
    videoUrl : {type: String},//地址
    addr : {type:String},//详细
    domains : {type:Array}
});
// UserSchema.index({id: 1});

module.exports = mongoose.model('Form',FormSchema);
