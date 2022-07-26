/*
 * @FileDescription    : 文件描述
 * @Author             : lin.li@fengjr.com
 * @Date               : 2018-12-26 00:01:23
 * @Last Modified by: lin.li@fengjr.com
 * @Last Modified time: yyyy-08-Th 02:47:37
 */

module.exports = (app) => {
  const verifyApi = app.middleware.verifyApi();
  // 通用组件api
  app.router.get('/api/scrm-web/getAllRouterByApi', app.controller.commonController.getAllRouterByApi);
  app.router.get(/^\/api\/scrm-web\/([\w-?,*\/]+)$/, app.controller.commonController.getCommonBusinessApiByGet);
  app.router.post(/^\/api\/scrm-web\/([\w-?\/]+)$/, app.controller.commonController.getCommonBusinessApiByPost);
  app.router.post(/^\/api\/scrm-upload\/([\w-?\/]+)$/, app.controller.commonController.getCommonBusinessApiByUploadPost);
  app.router.post('/api/getPageInfo', verifyApi, app.controller.homeController.apiGetPageInfo);
  app.router.post('/api/scrm-service/file/upload', app.controller.fileController.fileUpload);

};
