var ROOTLOGO = require("../models/rootLogo.js");

async function logo(req, res, next) {
  const {username, password} = req.body;
  const admin_id = req.session.admin_id;
  if (admin_id) {
    res.send({
      status: 200,
      message: '登录成功！'
    })
  }else {
    try {
      const admin = await ROOTLOGO.findOne({username});
      if (!admin) {
        res.send({
          status: 300,
          message: '帐号不存在！'
        })
      }else if (password!=admin.userpwd) {
        res.send({
          status: 300,
          message: '密码错误！'
        })
      }else {
        req.session.admin_id = admin.id;
        res.send({
          status: 200,
          message: '登录成功！'
        })
      }
    } catch (err) {
      res.send({
        status: 400,
        message: '登录失败!'
      })
    }
  }
}
module.exports = {
  logo:logo
};
