/*
 * @FileDescription    : 验证登录    
 * @Author             : lin.li@databurning.com
 * @Date               : 2019-01-21 15:25:57 
 * @Last Modified by: lin.li@fengjr.com
 * @Last Modified time: 2020-03-13 21:59:57
 */

'use strict';



module.exports = () => {
  //验证登录
  return async function verifyPath(ctx, next) {
    //验证cookie
    const cookieAuth = await ctx.service.userService.checkUserCookie();
    if (!cookieAuth) {
      ctx.redirect('/login');
      return false;
    }
    //next
    await next();
  };
};
