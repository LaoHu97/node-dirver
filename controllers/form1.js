var multiparty = require('multiparty');
var querystring = require('querystring');
var mysql = require('mysql');
var db = require('../models/db.js');
var util = require('../util/util.js');
var ROOTFORM1 = require("../models/rootForm1.js");

//使用连接池
var pool = mysql.createPool(util.extend({}, db.mysql));

//增
async function submitForm1(req, res, next) {
  pool.getConnection(function(err, connection) {
    // 获取前台页面传过来的参数
    var form = req.body;
    form.profiles = JSON.stringify(form.profiles);
    form.domains = JSON.stringify(form.domains);
    // 建立连接，向表中插入值
    connection.query(ROOTFORM1.addSurfaceForm, [form._id, form.title, form.profiles, form.imageUrl, form.times, form.videoUrl, form.videoUrlPass, form.addr, form.domains, form.average, form.data], function(err, result) {
      try { //添加
        if (result) {
          res.send({
            status: 200,
            message: '添加成功！'
          })
          // 释放连接
          connection.release();
        } else {
          res.send({
            status: 300,
            message: '添加失败！'
          })
          // 释放连接
          connection.release();
        }
      } catch (err) {
        res.send({
          status: 400,
          message: '添加失败！'
        })
        // 释放连接
        connection.release();
      }
    });
  });
}
//查
async function getRestrictedListPage(req, res, next) {
  try {
    var page = Number(req.query.page);
    var rows = Number(req.query.rows);
    var title = req.query.title;
    if (page && rows) {
      pool.getConnection(function(err, connection) {
        var start = (page - 1) * rows;
        var sql = 'select * from moviesSurfaceR WHERE title LIKE ? order by data DESC limit ' + start + ',' + rows;
        var count = 'select count(*) from moviesSurfaceR WHERE title LIKE ?';
        var total = '';
        connection.query(count, ['%' + title + '%'], function(err, result) {
          return total = result[0]['count(*)']
        });
        connection.query(sql, ['%' + title + '%'], function(err, result) {
          res.send({
            data: result,
            total: total,
            status: 200,
            message: '查询成功！'
          })
          connection.release();
        });
      });
    } else {
      res.send({
        status: 300,
        message: '查询失败！'
      })
      // 释放连接
      connection.release();
    }
  } catch (err) {
    res.send({
      status: 400,
      message: "查询失败！"
    })
    // 释放连接
    connection.release();
  }
}
//删
async function romveRestrictedList(req, res, next) {
  var id = req.body.id;
  var delSql = 'DELETE FROM moviesSurfaceR where id=' + id;
  try {
    pool.getConnection(function(err, connection) {
      connection.query(delSql, function(err, result) {
        if (err) {
          res.send({
            status: 300,
            message: "删除失败！"
          })
          return;
        } else {
          res.send({
            status: 200,
            message: "删除成功！"
          })
        }
        // 释放连接
        connection.release();
      });
    });
  } catch (err) {
    res.send({
      status: 400,
      message: "删除失败！"
    })
    // 释放连接
    connection.release();
  }
}
async function getRestrictedID(req, res, next) {
  try {
    var ID = req.query.id;
    if (ID) {
      pool.getConnection(function(err, connection) {
        connection.query(ROOTFORM1.RestrictedID, ID, function(err, result) {
          res.send({
            data: result[0],
            status: 200,
            message: '查询成功！'
          })
          connection.release();
        });
      });
    } else {
      res.send({
        status: 300,
        message: '查询失败！'
      })
      // 释放连接
      connection.release();
    }
  } catch (err) {
    res.send({
      status: 400,
      message: "查询失败！"
    })
    // 释放连接
    connection.release();
  }
}
module.exports = {
  submitForm1: submitForm1,
  getRestrictedListPage:getRestrictedListPage,
  romveRestrictedList:romveRestrictedList,
  getRestrictedID:getRestrictedID
};
