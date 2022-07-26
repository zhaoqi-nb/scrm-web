// egg 的基类
const { Controller } = require('egg');
const { Base64 } = require('js-base64');
const fs = require('fs'),
  path = require('path');

// 公共基础Controller
class BaseController extends Controller {
  // ----------- 公共方法 -----------------
  parseUrl(url) {
    if (!url) return;
    const arr = url.split('.');
    let domain = '';
    // 截取域名后两位
    for (let i = arr.length - 2; i < arr.length; i++) {
      domain += `.${arr[i]}`;
    }
    return domain;
  }

  getCookieOption(maxAge) {
    const { ctx, config } = this;

    let { hostname } = ctx; // todo: 暂时去掉域名的截取
    // hostname = this.parseUrl(hostname);

    if (!maxAge) maxAge = config.redis.expire * 1000;

    return {
      maxAge,
      path: '/',
      hostname: ctx.hostname,
      domain: hostname,
      httpOnly: true,
      signed: false,
    };
  }

  getCookie(key) {
    if (!key) return;
    const { ctx } = this;
    // get cookie
    try {
      const user = ctx.cookies.get(key, this.getCookieOption());
      return this.getDecode(user);
    } catch (error) {
      console.log('获取cookie失败!');
    }
    return null;
  }

  //刷新缓存
  async refreshCookie() {
    const { ctx, config } = this;
    try {
      let result = this.getCookie(config.cookieKey.userToken);
      if (result) {
        result["time"] = new Date().getTime();

        //rs_user: memberId + 浏览器信息 + IP + 登录时间
        let rs_user = this.getEncrypt(result);
        ctx.cookies.set(config.cookieKey.userToken, rs_user, this.getCookieOption());
      }
    } catch (error) {
      this.logErr("刷新用户userToken 出错", error);
    }
  }

  // 用户cookie
  getUserTockenCookie() {
    // get cookie value
    const key = this.ctx.app.config.cookieKey.userToken;
    return this.getCookie(key);
  }

  // 用户权限list
  getPermissionCookie() {
    // get cookie value
    const key = this.ctx.app.config.cookieKey.permissionToken;
    return this.getCookie(key);
  }

  // get User cookie info
  getUserCookieInfo() {
    const userInfo = this.getUserTockenCookie();
    if (userInfo) return userInfo;
    return null;
  }

  // get login userId
  getUserId() {
    const userInfo = this.getUserCookieInfo();
    if (userInfo && userInfo.memberId) return userInfo.memberId;
    return null;
  }

  // 获取userBehavior cookie
  getUserBehaviorTokenCookie() {
    const cookieKey = this.config.cookieKey.userBehavior;
    return this.getCookie(cookieKey);
  }

  // decode
  getDecode(str) {
    if (!str) return;
    const obj = this.ctx.service.secretKey.getDecData(str);
    if (!obj) return null;
    try {
      return JSON.parse(obj);
    } catch (error) {
      this.logErr('解析=${str} 出错');
      return obj;
    }
  }

  // encrypt
  getEncrypt(obj) {
    if (!obj) return;
    const str = typeof obj === 'string' ? obj : JSON.stringify(obj);
    return this.ctx.service.secretKey.getEncData(str);
  }

  // 解密
  getDecodeBase64(value) {
    if (!value) return;
    let temp = null;
    try {
      // hash code
      temp = Base64.decode(value);
      // JSON string to Object
      temp = JSON.parse(temp);
    } catch (error) {
      this.logErr(`getDecodeBase64, value=${value} 解密出错`, error);
    }
    return temp;
  }

  // 错误日志
  logErr(msg, err) {
    this.ctx.service.logHelper.logErr(msg, err);
  }

  // 设置redis
  async setRedis(key, str = '', expire) {
    if (!key) return;
    const { app, config } = this;
    try {
      const { systemCode } = config;
      await app.redis.set(`${systemCode}_${key}`, str, 'EX', expire || config.redis.expire);
    } catch (error) {
      this.logErr(`redis 写入失败：key = ${key}, value = ${str}`, error);
    }
  }

  // 查询redis
  async queryRedis(key) {
    if (!key) return;
    const { app, config } = this;
    try {
      const { systemCode } = config;
      const data = await app.redis.get(`${systemCode}_${key}`);
      return data;
    } catch (error) {
      this.logErr(`redis 获取失败 key = ${key}, systemCode = ${config.systemCode}`, error);
    }
    return null;
  }

  // ----------- 跟页面或者Api相关 -----------------
  // 没找到页面
  notFound(msg) {
    msg = msg || 'not found';
    this.ctx.throw(404, msg);
  }

  // return ajax data
  returnData(msg) {
    // exceptions
    if (!msg) {
      this.paramError('SE');
      return;
    }
    const { retCode } = msg;
    // exceptions
    if (retCode != 200 && retCode != '000000') {
      this.ctx.body = msg;
      return;
    }
    // ajax success
    this.success(msg.data || msg.item);
  }

  // 返回原数据
  returnOriginalData(msg) {
    this.ctx.body = msg;
  }

  // ajax success
  success(data) {
    this.ctx.body = {
      retCode: 200,
      retMsg: '',
      data,
    };
  }

  // parameters exceptions
  paramError(type) {
    let ErrorObject = null;
    switch (type) {
      // service exceptions
      case 'SE':
        ErrorObject = {
          retCode: 505,
          retMsg: '服务异常',
        };
        break;
      // login error
      case 'LE':
        ErrorObject = {
          retCode: 505,
          retMsg: '登录失败',
        };
        break;
      // the logged in user does not exist
      case 'UN':
        ErrorObject = {
          retCode: 505,
          retMsg: '用户不存在',
        };
        break;
      case 'ULE':
        ErrorObject = {
          retCode: 505,
          retMsg: '上传出错',
        };
        break;
      // parameters exceptions
      default:
        ErrorObject = {
          retCode: 500,
          retMsg: '参数错误',
        };
    }

    this.ctx.body = ErrorObject;
  }

  // redirect login
  goToLogin(ifRedirect = true) {
    const { ctx } = this;
    const { url } = ctx;
    let path = '/login';
    if (url.indexOf('/api/') == -1 && url.indexOf('/login') == -1 && ifRedirect) {
      const redirectUrl = ctx.service.secretKey.getEncData(url);
      path += `?redirectUrl=${redirectUrl}`;
    }
    ctx.redirect(path);
  }

  /** ************************************ **/
  //获取菜单
  getLeftMenu() {
    return global.MENU;
  }

  //获取页面信息
  getPageInfo(path) {
    if (!global.PAGELIST || !path) return null;
    return global.PAGELIST[path];
  }

  //获取用户信息
  getUserInfo() {
    return this.getUserTockenCookie()
  }

  async getVisitMenu(permissionInfo = []) {
    let menuList = []
    const permissionList = permissionInfo
    const result = this.getLeftMenu()
    const { config } = this;
    const loop = (data) => {
      if (!data || !data.length) return
      data.forEach(v => {
        if (v.children && v.children.length) loop(v.children)
        const { resAttr, resId } = v
        if (resAttr && resAttr.path) {
          if (config.envVariable == 'local') menuList.push(resAttr.path) //本地开发不限制菜单
          else if (permissionList.indexOf(resId) >= 0) menuList.push(resAttr.path)
        }
      })
    }
    loop(result)

    return menuList;
  }

  getConcatMenu(allMenuData, list) {
    if (!list || !list.length) return null;
    //获取父节点路径
    let getParentRoute = (data, path) => {
      let getMenuData = (obj) => {
        return {
          "level": obj.level,
          "resId": obj.resId,
          "tabId": obj.tabId,
          "resType": obj.resType,
          "resName": obj.resName,
          "resAttr": obj.resAttr,
          "minName": obj.minName
        };
      }
      //循环
      let loop = (arr) => {
        for (let i = 0, len = arr.length; i < len; i++) {
          let obj = arr[i],
            children = obj.children,
            resAttr = obj.resAttr;

          let newObj = getMenuData(obj);

          if (resAttr && resAttr.path == path) return new Array(newObj);
          if (children && children.length) {
            let temp = loop(children);
            if (temp) {
              newObj.children = temp;
              return new Array(newObj);;
            }
          }
        }
        return null;
      }
      return loop(data);
    }

    //合并两个路径
    let treeConcat = (before, after) => {
      let getObj = (resId, arr) => {
        return arr.find(item => item.resId == resId)
      }

      //循环
      let loop = (be = [], af = []) => {
        for (let i = 0, len = af.length; i < len; i++) {
          let after_obj = af[i];
          let before_obj = getObj(after_obj.resId, be);
          if (before_obj && after_obj && before_obj.resId == after_obj.resId) {
            let temp = loop(before_obj.children, after_obj.children);
            before_obj.children = temp;
          } else {
            be.push(after_obj);
          }
        }
        return be;
      }

      return loop(before, after);
    }

    let menuTree = [];
    for (let i = 0, len = list.length; i < len; i++) {
      let path = list[i];
      let parentRoute = getParentRoute(allMenuData, path);
      menuTree = treeConcat(menuTree, parentRoute && parentRoute.length ? parentRoute : []);
    }

    return menuTree;
  }

  getRedirectPath(obj) {
    let resAttr = obj.children[0].resAttr || {}
    if (resAttr.path) return resAttr.path
    else return this.getRedirectPath(obj.children[0])
  }

  getTopMenu(data) {
    let topMenu = [];
    for (let i = 0, len = data.length; i < len; i++) {
      let obj = data[i];
      topMenu.push({
        "resId": obj.resId,
        "resName": obj.resName,
        'redirect': this.getRedirectPath(obj),
        'resAttr': obj.resAttr,
        'minName': obj.minName
      })
    }
    return topMenu;
  }

  async getRoleMenu(permissionInfo, tabId) {
    permissionInfo = JSON.parse(Base64.decode(permissionInfo))
    const menuList = await this.getVisitMenu(permissionInfo);

    let tempMenu = this.getConcatMenu(MENU, menuList);
    let leftMenu = [];
    let topMenu = [];


    if (tempMenu && tempMenu.length) {
      topMenu = this.getTopMenu(tempMenu);
      let tabIndex = tabId ? topMenu.findIndex(item => item.resId == tabId) : 0;
      // 防止用户权限变更导致报错
      if (tabIndex == -1) tabIndex = 0
      leftMenu = tempMenu[tabIndex]["children"];
    }

    return {
      leftMenu,
      topMenu,
      menuList,
      tempMenu
    };
  }
}

module.exports = BaseController;
