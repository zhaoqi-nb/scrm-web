'use strict';

module.exports = app => {
  //api
  //访问登录、退出
  app.router.get('/login', app.controller.homeController.browseLogin);
  app.router.get('/doLogout', app.controller.loginController.doLogout);
  app.router.get('/api/erCodeLogin', app.controller.loginController.erCodeLogin);
  //login
  app.router.post(/^\/api\/scrm-web-login\/([\w-\/]+)$/, app.controller.loginController.doLogin);
};