var ROOTFORM = require("../models/rootForm.js");
var multiparty = require('multiparty');
var Client = require('node-rest-client').Client;
var fs = require('fs');

async function formModel(req, res, next) {
  var form = new ROOTFORM({
    title: req.body.title, //标题
    profiles: req.body.profiles, //简介
    imageUrl: req.body.imageUrl, //封面
    times: req.body.times, //时间
    videoUrl: req.body.videoUrl, //地址
    addr:req.body.addr,//详细
    domains:req.body.domains//更多地址
  });
  try {
    form.save((err) => { //添加
      if (err) {
        res.send({
          status: 300,
          message: '添加失败！'
        })
      } else {
        res.send({
          status: 200,
          message: '添加成功！'
        })
      }
    });
  } catch (err) {
    res.send({
      status: 400,
      message: '添加失败！'
    })
  }
}
async function getUserListPage(req, res, next) {
  try {
    var page = Number(req.query.page);
    var rows = Number(req.query.rows);
    if (page && rows) {
      var total = await ROOTFORM.find({});
      var query = await ROOTFORM.find({}).limit(rows).skip((page - 1) * rows);
      res.send({
        data: query,
        total: total.length,
        status: 200,
        message: '查询成功！'
      })
    } else {
      res.send({
        status: 300,
        message: '查询失败！'
      })
    }
  } catch (err) {
    if (err) {
      console.log("错误:" + err);
    } else {
      res.send({
        status: 400,
        message: "查询失败！"
      })
    }
  }
}
async function img_upload(req, res, next) {
  //生成multiparty对象，并配置上传目标路径
  var form = new multiparty.Form({
    uploadDir: './uploads/images'
  });
  form.parse(req, function(err, fields, files) {
    var filesTmp = JSON.stringify(files, null, 2);
    try {
      if (err) {
        console.log('parse error: ' + err);
        res.send({
          status: 300,
          message: "上传失败！"
        })
      } else {
        console.log('parse files: ' + filesTmp);
        console.log(files);
        var inputFile = files.file[0];
        var uploadedPath = inputFile.path;
        var dstPath = './uploads/images/' + inputFile.originalFilename;
        //重命名为真实文件名
        fs.rename(uploadedPath, dstPath, function(err) {
          if (err) {
            res.send({
              status: 300,
              message: "上传失败！"
            })
          } else {
            res.send({
              data:{url:"http://127.0.0.1/uploads/images/"+inputFile.originalFilename},
              status: 200,
              message: "上传成功！"
            })
          }
        });
      }
    } catch (err) {
      res.send({
        status: 400,
        message: "上传失败！"
      })
    }
  })
}
async function romveList(req, res, next) {
 var id={_id:req.body.id};
 try {
   ROOTFORM.remove(id, function(err, result) {
      if(err)
      {
        res.send({
          status: 300,
          message: "删除失败！"
        })
        return;
      }
      res.send({
        status: 200,
        message: "删除成功！"
      })
    });
 } catch (err) {
   res.send({
     status: 400,
     message: "删除失败！"
   })
 }
}
async function getNewmovies(req, res, next) {
  var client = new Client();
  var query = req.query.query;
  if (query) {
    client.registerMethod("jsonMethod", "http://api.douban.com//v2/movie/search"+"?q="+query, "GET");
    try {
      client.methods.jsonMethod(function (data, response) {
        // parsed response body as js object
        res.send({
          status: 200,
          message: "搜索成功",
          data:data
        })
      });
    } catch (e) {
      res.send({
        status: 400,
        message: "搜索失败"
      })
    }
  }else {
    client.registerMethod("jsonMethod", "http://api.douban.com/v2/movie/in_theaters", "GET");
    try {
      client.methods.jsonMethod(function (data, response) {
        // parsed response body as js object
        res.send({
          status: 200,
          message: "初始搜索成功",
          data:data
        })
      });
    } catch (e) {
      res.send({
        status: 400,
        message: "初始搜索失败"
      })
    }
  }
}
module.exports = {
  formModel: formModel,
  getUserListPage: getUserListPage,
  img_upload: img_upload,
  romveList:romveList,
  getNewmovies:getNewmovies
};
