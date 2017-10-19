var express = require('express');
var index = require('../controllers/index.js');
var formModel = require('../controllers/form.js');
var router = express.Router();


// 后台账户登录
router.post('/api/logo', index.logo);
//表单提交
router.post('/api/formmodel', formModel.formModel);
//列表查询
router.get('/api/getUserListPage', formModel.getUserListPage);
//列表删除
router.post('/api/romveList', formModel.romveList);
//上传图片
router.post('/api/img_upload', formModel.img_upload);
//搜索
router.get('/api/getNewmovies', formModel.getNewmovies);
//获取电影信息
router.get('/api/getMoviesMessage', formModel.getMoviesMessage);

module.exports = router;
