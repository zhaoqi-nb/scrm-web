/*
 * @FileDescription    : 验证登录
 * @Author             : lin.li@fengjr.com
 * @Date               : 2019-01-21 15:25:57
 * @Last Modified by: lin.li@fengjr.com
 * @Last Modified time: 2020-04-30 15:08:19
 */

module.exports = () => {
  const goToLogin = (ctx) => {
    const { url } = ctx;
    let path = '/login';
    if (url.indexOf('/api/') == -1) {
      const redirectUrl = ctx.service.secretKey.getEncData(url);
      path += `?redirectUrl=${redirectUrl}`;
    }
    ctx.redirect(path);
  };
  // 验证登录
  return async function verifyLogin(ctx, next) {
    // 验证cookie
    const cookieAuth = await ctx.service.userService.checkUserCookie();
    // if (!cookieAuth) {
    //   goToLogin(ctx);
    //   return false;
    // }
    // next
    await next();
  };
};
