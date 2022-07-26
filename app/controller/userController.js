// egg 的基类
const BaseController = require('./baseController');
const userAgent = require('../util/userAgent');

// 公共基础Controller
class UserController extends BaseController {
  // 设置用户 token：deviceType设备型号 1.PC 2手机侧边栏 3PC侧边栏，memberId 员工ID，companyId 公司ID，accessToken 认证token，dataBurning判断是否是燃数
  async setUserTokenCookie({
    accessToken, companyId, memberId, deviceType, companyName, name, avatar, userName, dataBurning
  } = data) {
    const { ctx, config } = this;

    try {
      const user_agent = ctx.get('user-agent');
      const browser = userAgent.judgeTerminalBrowser(user_agent);
      const ip = ctx.header['x-forwarded-for'] ? ctx.header['x-forwarded-for'] : ctx.ip;
      const version = config.systemVersion;

      // rs_user: memberId + 浏览器信息 + IP + 登录时间
      const rs_user = this.getEncrypt({
        accessToken,
        companyId,
        memberId,
        browser,
        ip,
        version,
        deviceType,
        time: new Date().getTime(),
        companyName,
        userName: name || userName,
        avatar,
        dataBurning
      });

      ctx.cookies.set(config.cookieKey.userToken, rs_user, this.getCookieOption());
      return true;
    } catch (error) {
      this.logErr('设置用户userToken 出错', error);
    }
    return false;
  }
}

module.exports = UserController;
