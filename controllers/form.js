var multiparty = require('multiparty');
var Client = require('node-rest-client').Client;
var fs = require('fs');
var request = require('request');
var querystring = require('querystring');
var mysql = require('mysql');
var db = require('../models/db.js');
var util = require('../util/util.js');
var ROOTFORM = require("../models/rootForm.js");

//使用连接池
var pool = mysql.createPool(util.extend({}, db.mysql));

//增
async function formModel(req, res, next) {
  pool.getConnection(function(err, connection) {
    // 获取前台页面传过来的参数
    var form = req.body;
    form.profiles = JSON.stringify(form.profiles);
    form.domains = JSON.stringify(form.domains);
    // 建立连接，向表中插入值
    connection.query(ROOTFORM.videoForm, [form._id, form.title, form.profiles, form.imageUrl, form.times, form.videoUrl, form.videoUrlPass, form.addr, form.domains, form.average, form.data], function(err, result) {
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
//改
async function addImages(req, res, next) {
  pool.getConnection(function(err, connection) {
    // 获取前台页面传过来的参数
    var form = req.body;
    // 建立连接，向表中插入值
    connection.query(ROOTFORM.addImages,[form.type, form.topImg, form.id],function (err, result) {
      try { //添加
        if (result.affectedRows==1) {
          res.send({
            status: 200,
            message: '置顶成功！'
          })
        } else {
          res.send({
            status: 300,
            message: '置顶失败！'
          })
        }
      } catch (err) {
        res.send({
          status: 400,
          message: '置顶失败！'
        })
      }
      // 释放连接
      connection.release();
    });
  });
}
async function statusTopImages(req, res, next) {
  pool.getConnection(function(err, connection) {
    // 获取前台页面传过来的参数
    var form = req.body;
    // 建立连接，向表中插入值
    connection.query(ROOTFORM.statusImages,[form.type, form.id],function (err, result) {
      try { //添加
        if (result.affectedRows==1) {
          res.send({
            status: 200,
            message: '更新成功！'
          })
        } else {
          res.send({
            status: 300,
            message: '更新失败！'
          })
        }
      } catch (err) {
        res.send({
          status: 400,
          message: '更新失败！'
        })
      }
      // 释放连接
      connection.release();
    });
  });
}
//查
async function getUserListPage(req, res, next) {
  try {
    var page = Number(req.query.page);
    var rows = Number(req.query.rows);
    if (page && rows) {
      pool.getConnection(function(err, connection) {
        var start = (page - 1) * rows;
        var sql = 'select * from videoInsert order by data DESC limit ' + start + ',' + rows;
        var count = 'select count(*) from videoInsert';
        var total = '';
        connection.query(count, function(err, result) {
          return total = result[0]['count(*)']
        });
        connection.query(sql, function(err, result) {
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
//查
async function getMoviesID(req, res, next) {
  try {
    var ID = req.query.id;
    if (ID) {
      pool.getConnection(function(err, connection) {
        connection.query(ROOTFORM.moviesID, ID, function(err, result) {
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
//查
async function getMoviesTopImages(req, res, next) {
  try {
    var type = req.query.type;
    if (type) {
      pool.getConnection(function(err, connection) {
        connection.query(ROOTFORM.moviesType, type, function(err, result) {
          res.send({
            data: result,
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
//上传图片
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
        var inputFile = files.file[0];
        var uploadedPath = inputFile.path;
        var dstPath = '../html/uploads/images/' + inputFile.originalFilename;
        //重命名为真实文件名
        fs.rename(uploadedPath, dstPath, function(err) {
          if (err) {
            res.send({
              status: 300,
              message: "上传失败！"
            })
          } else {
            res.send({
              data: {
                url: "https://lao47.xin/uploads/images/" + inputFile.originalFilename
              },
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
//删
async function romveList(req, res, next) {
  var id = req.body.id;
  var delSql = 'DELETE FROM videoInsert where id=' + id;
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
      });
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
    client.registerMethod("jsonMethod", "http://api.douban.com/v2/movie/search" + "?q=" + query, "GET");
    try {
      client.methods.jsonMethod(function(data, response) {
        // parsed response body as js object
        res.send({
          status: 200,
          message: "搜索成功",
          data: data
        })
      });
    } catch (e) {
      res.send({
        status: 400,
        message: "搜索失败"
      })
    }
  } else {
    client.registerMethod("jsonMethod", "http://api.douban.com/v2/movie/in_theaters", "GET");
    try {
      client.methods.jsonMethod(function(data, response) {
        // parsed response body as js object
        res.send({
          status: 200,
          message: "初始搜索成功",
          data: data
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
async function getMoviesMessage(req, res, next) {
  // var oss = new OSS({
  //   region: 'oss-cn-hangzhou',
  //   accessKeyId: 'LTAI7ZGF3z4a77JI',
  //   accessKeySecret: 'tX0IKhcQDz3c4TrdaqWZmKvetjZfne',
  //   bucket: 'video47'
  // });
  // var result = oss.list();
  // console.log(result);
  var client = new Client();
  var id = req.query.id;
  client.registerMethod("jsonMethod", "https://api.douban.com/v2/movie/subject/" + id, "GET");
  try {
    client.methods.jsonMethod(function(data, response) {
      // parsed response body as js object
      function downloadFile(uri,filename,callback){
          var stream = fs.createWriteStream('../html/uploads/images/'+filename);
          request(uri).pipe(stream).on('close', callback);
      }
      var fileUrl  = data.images.large;
      var filename = Date.now()+'.jpg';
      downloadFile(fileUrl,filename,function(){});
      data.images.large = "https://lao47.xin/uploads/images/"+filename;
      var fileUrl  = data.images.large;
      res.send({
        status: 200,
        message: "搜索成功",
        data: data
      })
    });
  } catch (err) {
    res.send({
      status: 400,
      message: "搜索失败"
    })
  }
}
module.exports = {
  formModel: formModel,
  getUserListPage: getUserListPage,
  img_upload: img_upload,
  romveList: romveList,
  getNewmovies: getNewmovies,
  getMoviesMessage: getMoviesMessage,
  getMoviesID:getMoviesID,
  addImages:addImages,
  getMoviesTopImages:getMoviesTopImages,
  statusTopImages:statusTopImages
};

// var ROOTFORM = require("../models/rootForm.js");
// var multiparty = require('multiparty');
// var Client = require('node-rest-client').Client;
// var fs = require('fs');
//
// async function formModel(req, res, next) {
//   var form = new ROOTFORM({
//     title: req.body.title, //标题
//     profiles: req.body.profiles, //简介
//     imageUrl: req.body.imageUrl, //封面
//     times: req.body.times, //时间
//     videoUrl: req.body.videoUrl, //地址
//     addr:req.body.addr,//详细
//     domains:req.body.domains//更多地址
//   });
//   try {
//     form.save((err) => { //添加
//       if (err) {
//         res.send({
//           status: 300,
//           message: '添加失败！'
//         })
//       } else {
//         res.send({
//           status: 200,
//           message: '添加成功！'
//         })
//       }
//     });
//   } catch (err) {
//     res.send({
//       status: 400,
//       message: '添加失败！'
//     })
//   }
// }
// async function getUserListPage(req, res, next) {
//   try {
//     var page = Number(req.query.page);
//     var rows = Number(req.query.rows);
//     if (page && rows) {
//       var total = await ROOTFORM.find({});
//       var query = await ROOTFORM.find({}).limit(rows).skip((page - 1) * rows);
//       res.send({
//         data: query,
//         total: total.length,
//         status: 200,
//         message: '查询成功！'
//       })
//     } else {
//       res.send({
//         status: 300,
//         message: '查询失败！'
//       })
//     }
//   } catch (err) {
//     if (err) {
//       console.log("错误:" + err);
//     } else {
//       res.send({
//         status: 400,
//         message: "查询失败！"
//       })
//     }
//   }
// }
// async function img_upload(req, res, next) {
//   //生成multiparty对象，并配置上传目标路径
//   var form = new multiparty.Form({
//     uploadDir: './uploads/images'
//   });
//   form.parse(req, function(err, fields, files) {
//     var filesTmp = JSON.stringify(files, null, 2);
//     try {
//       if (err) {
//         console.log('parse error: ' + err);
//         res.send({
//           status: 300,
//           message: "上传失败！"
//         })
//       } else {
//         console.log('parse files: ' + filesTmp);
//         console.log(files);
//         var inputFile = files.file[0];
//         var uploadedPath = inputFile.path;
//         var dstPath = './uploads/images/' + inputFile.originalFilename;
//         //重命名为真实文件名
//         fs.rename(uploadedPath, dstPath, function(err) {
//           if (err) {
//             res.send({
//               status: 300,
//               message: "上传失败！"
//             })
//           } else {
//             res.send({
//               data:{url:"http://127.0.0.1/uploads/images/"+inputFile.originalFilename},
//               status: 200,
//               message: "上传成功！"
//             })
//           }
//         });
//       }
//     } catch (err) {
//       res.send({
//         status: 400,
//         message: "上传失败！"
//       })
//     }
//   })
// }
// async function romveList(req, res, next) {
//  var id={_id:req.body.id};
//  try {
//    ROOTFORM.remove(id, function(err, result) {
//       if(err)
//       {
//         res.send({
//           status: 300,
//           message: "删除失败！"
//         })
//         return;
//       }
//       res.send({
//         status: 200,
//         message: "删除成功！"
//       })
//     });
//  } catch (err) {
//    res.send({
//      status: 400,
//      message: "删除失败！"
//    })
//  }
// }
// async function getNewmovies(req, res, next) {
//   var client = new Client();
//   var query = req.query.query;
//   if (query) {
//     client.registerMethod("jsonMethod", "http://api.douban.com//v2/movie/search"+"?q="+query, "GET");
//     try {
//       client.methods.jsonMethod(function (data, response) {
//         // parsed response body as js object
//         res.send({
//           status: 200,
//           message: "搜索成功",
//           data:data
//         })
//       });
//     } catch (e) {
//       res.send({
//         status: 400,
//         message: "搜索失败"
//       })
//     }
//   }else {
//     client.registerMethod("jsonMethod", "http://api.douban.com/v2/movie/in_theaters", "GET");
//     try {
//       client.methods.jsonMethod(function (data, response) {
//         // parsed response body as js object
//         res.send({
//           status: 200,
//           message: "初始搜索成功",
//           data:data
//         })
//       });
//     } catch (e) {
//       res.send({
//         status: 400,
//         message: "初始搜索失败"
//       })
//     }
//   }
// }
// module.exports = {
//   formModel: formModel,
//   getUserListPage: getUserListPage,
//   img_upload: img_upload,
//   romveList:romveList,
//   getNewmovies:getNewmovies
// };
