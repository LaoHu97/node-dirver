//实现与mysql交互
var mysql = require('mysql');
var db = require('../models/db.js');
var util = require('../util/util.js');
var ROOTLOGO = require("../models/rootLogo.js");

//使用连接池
var pool = mysql.createPool(util.extend({}, db.mysql));



async function logo(req, res, next) {
  const {username, password} = req.body;
  try {
    pool.getConnection(function(err, connection) {
      connection.query(ROOTLOGO.adminByusername, username, function(err, result) {
        if (result[0] == undefined) {
          res.send({
            status: 300,
            message: '帐号不存在！'
          })
        } else {
          if (result[0].password === password) {
            res.send({
              status: 200,
              message: '登录成功！'
            })
            req.session.userinfo=username
          } else {
            res.send({
              status: 300,
              message: '密码错误！'
            })
          }
        };
        connection.release();
      });
    });
  } catch (err) {
    res.send({
      status: 400,
      message: '登录失败!'
    })
  }
}
module.exports = {
  logo: logo
};
