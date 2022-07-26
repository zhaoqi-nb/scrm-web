/*
 * @FileDescription    : 验证登录
 * @Author             : lin.li@fengjr.com
 * @Date               : 2019-01-21 15:25:57
 * @Last Modified by: lin.li@fengjr.com
 * @Last Modified time: 2019-11-15 17:07:16
 */

const { getErrorCode } = require('../util/errorCode');

module.exports = () => {
  return async function verifyLogin(ctx, next) {
    // 验证cookie
    const cookieAuth = await ctx.service.userService.checkUserCookie();
    if (!cookieAuth) {
      ctx.body = getErrorCode('LOGIN_ERROR');
      return false;
    }
    // next
    await next();
  };
}

