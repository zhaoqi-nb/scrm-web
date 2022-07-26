const common = require('./api/common');
const login = require('./api/login');

// 接口api地址
module.exports = {
  // get user from cache
  GETUSERTEMPLATELIST: '/usertemplate/getUserTemplateList',

  // common
  ...common,
  ...login,
};
