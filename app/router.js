/*
 * @FileDescription    : 文件描述
 * @Author             : lin.li@fengjr.com
 * @Date               : 2018-06-05 19:29:14
 * @Last Modified by: lin.li@fengjr.com
 * @Last Modified time: yyyy-08-We 10:45:54
 */

module.exports = (app) => {
  const { router, controller } = app;
  const verifyApi = app.middleware.verifyPath();
  // ---------- page ----------------
  router.get('/', controller.homeController.redirectPath);
  router.get('/tab/:resId', controller.homeController.redirectTab);

  // 公共
  require('./router/common')(app);
  // 登录
  require('./router/login')(app);

  router.get('/:path', verifyApi, controller.homeController.index);
};
