/*
 * @FileDescription    : 文件描述
 * @Author             : lin.li@fengjr.com
 * @Date               : 2019-01-21 14:53:51
 * @Last Modified by: lin.li@fengjr.com
 * @Last Modified time: yyyy-08-Th 02:27:48
 */

const HomeController = require('../controller/homeController')
const { Base64 } = require('js-base64');
const userAgent = require('../util/userAgent');

const parseUrl = (url) => {
  if (!url) return;
  const arr = url.split('.');
  let domain = '';
  // 截取域名后两位
  for (let i = arr.length - 2; i < arr.length; i++) {
    domain += `.${arr[i]}`;
  }
  return domain;
};

/**
 *
 */
class UserService extends HomeController {
  // decode
  getDecode(str) {
    if (!str) return;
    const obj = this.ctx.service.secretKey.getDecData(str);
    if (!obj) return null;
    return JSON.parse(obj);
  }

  // encrypt
  getEncrypt(obj) {
    if (!obj) return;
    return this.ctx.service.secretKey.getEncData(JSON.stringify(obj));
  }

  // get cookie value
  getCookieVal(key) {
    if (!key) return;
    const { ctx } = this;
    let { hostname } = ctx;
    hostname = parseUrl(hostname);
    const option = {
      path: '/',
      domain: hostname,
      httpOnly: true,
      signed: false,
    };
    // get cookie
    return ctx.cookies.get(key, option);
  }

  // get cookie
  getCookie(key) {
    if (!key) return;
    // get cookie value
    const str = this.getCookieVal(key);
    return this.getDecode(str);
  }

  // 用户cookie
  getUserTockenCookie() {
    // get cookie value
    const key = this.ctx.app.config.cookieKey.userToken;
    return this.getCookie(key);
  }

  // 设置cookie
  setCookie(data) {
    const { ctx, config } = this;
    try {
      let { hostname } = ctx;
      hostname = parseUrl(hostname);
      const option = {
        // 4小时
        maxAge: 4 * 3600 * 1000,
        path: '/',
        domain: hostname,
        httpOnly: true,
        signed: false,
      };
      // 添加版本
      data.version = config.systemVersion;
      // encrypt
      const user = this.getEncrypt(data);
      // set cookie
      ctx.cookies.set(config.cookieKey, user, option);
    } catch (error) {
      ctx.logger.error('添加cookie出错 Error= %s', error);
      return false;
    }
    return true;
  }

  // 验证用户cookie
  async checkUserCookie() {
    const { ctx, config } = this;
    const { noNeedLoginPages } = config
    const checkBrowser = (obj) => {
      if (!obj || !obj.browser) return false;
      const user_agent = ctx.get('user-agent');
      const browser = userAgent.judgeTerminalBrowser(user_agent);
      if (JSON.stringify(browser) != JSON.stringify(obj.browser)) return false;
      return true;
    };

    try {
      // get cookie
      const isNoNeedLogin = noNeedLoginPages.find(v => v.path == ctx.params.path)
      if (isNoNeedLogin) return true
      const auth = this.getUserTockenCookie();
      if (!auth.version || auth.version != config.systemVersion || !checkBrowser(auth)) return false;

      // if (auth.source) return true;

      // const userCache = await this.queryRedis(auth.memberId, auth.accessToken);
      // if (userCache)
      return true;
    } catch (error) {
      ctx.logger.error(`拦截器checkUserCookie 发生错误=${error}`);
    }
    return false;
  }

  //验证用户是否有页面权限
  async checkUserCookieByPage() {
    const { ctx } = this;
    try {
      const path = ctx.path.replace(/\//g, '')
      let permissionInfo = await this.getUserPermissionInfo()
      let pageInfo = this.getPageInfo(path);
      let { menuList } = await this.getRoleMenu(permissionInfo, pageInfo.tabId);
      if (menuList.indexOf(path) == -1) {
        return false
      }
      return true
    } catch (error) {
      ctx.logger.error(`拦截器checkUserCookieByPage 发生错误=${error}`);
    }
    return false;
  }

  async queryRedis(key, tocken) {
    if (!key) return false;
    const { ctx, app, config } = this;
    try {
      const { systemCode } = config;
      let data = await app.redis.get(`${systemCode}_${key}`);
      data = Base64.decode(data);
      return `${systemCode}_${key}_${tocken}` == data;
    } catch (error) {
      ctx.logger.error(`redis 获取失败 key = ${key}, systemCode = ${config.systemCode} error=${error}`);
    }
    return null;
  }

  // 设置用户信息
  async setUserCookieInfo(key, value) {
    if (!key || !value) return false;
    try {
      const userCookie = await this.getCookie();
      if (userCookie) {
        const user_behavior = userCookie.user_behavior || {};
        user_behavior[key] = value;
        userCookie.user_behavior = user_behavior;
        this.setCookie(userCookie);
      }
      return true;
    } catch (error) {
      ctx.logger.error(`设置用户信息 发生错误=${error}`);
    }
    return false;
  }
}

module.exports = UserService;
