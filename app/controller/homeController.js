'use strict';

const UserController = require('./userController'),
  Base64 = require('js-base64').Base64;

class HomeController extends UserController {
  async index() {
    const { ctx, config: {
      noNeedLoginPages
    } } = this;
    let path = ctx.params.path;
    const isNoNeedLogin = noNeedLoginPages.find(v => v.path == path)
    if (isNoNeedLogin) {
      await ctx.render('index', { title: isNoNeedLogin.title, pageDes: isNoNeedLogin.pageDes });
      return
    }
    const userInfo = this.getUserInfo()
    if (['emptyPage'].indexOf(path) >= 0) { //空页面
      let menuData = Base64.encode(JSON.stringify({
        // pageInfo,
        userInfo,
        // menuList,
        // tempMenu
      }));
      await ctx.render('index', { title: '暂无权限', menuData });
      return
    }
    let permissionInfo = await this.getUserPermissionInfo();
    if (!permissionInfo) {
      ctx.redirect('/login')
      return
    }
    let pageInfo = this.getPageInfo(path);
    if (!pageInfo) {
      await ctx.render('index', { title: '页面不存在' });
      return
    }
    let { tempMenu, menuList } = await this.getRoleMenu(permissionInfo, pageInfo.tabId);
    if (!userInfo) {
      ctx.redirect('/login');
      return
    }
    if (menuList.indexOf(path) == -1) {
      ctx.redirect('/');
      return
    }
    let menuData = Base64.encode(JSON.stringify({
      pageInfo,
      userInfo,
      menuList,
      tempMenu
    }));
    this.refreshCookie();
    await ctx.render('index', { pageInfo, menuData, title: pageInfo.resName });
  }

  async apiGetPageInfo() {
    const { ctx } = this;
    const query = ctx.request.body || {},
      path = query.path;
    let permissionInfo = await this.getUserPermissionInfo();
    let pageInfo = this.getPageInfo(path);
    let { menuList } = await this.getRoleMenu(permissionInfo, pageInfo.tabId);
    // if (menuList.indexOf(path) == -1) {
    //   ctx.redirect('/');
    //   // this.redirectPath()
    // } else
    this.success({ pageInfo, menuList });
  }

  async browseLogin() {
    let pageInfo = {
      resName: "燃数科技-新经济洞察引擎"
    };
    await this.ctx.render('index', { pageInfo, title: '登录' });
  }

  //
  async redirectPath() {
    const { ctx } = this;
    let permissionInfo = await this.getUserPermissionInfo();
    if (!permissionInfo) {
      ctx.redirect('/login')
      return
    }
    let { topMenu } = await this.getRoleMenu(permissionInfo);
    if (!topMenu.length) {
      ctx.redirect(`/emptyPage`);
      return
    }
    ctx.redirect(`/tab/${topMenu[0]["resId"]}`);
  }

  async redirectTab() {
    const { ctx } = this;
    const resId = ctx.params.resId;
    if (!resId) {
      this.notFound();
      return;
    }
    let permissionInfo = await this.getUserPermissionInfo();
    if (!permissionInfo) {
      ctx.redirect('/login')
      return
    }
    let { leftMenu } = await this.getRoleMenu(permissionInfo, resId);
    let firstPath = this.getAuthorityFirstMenu(leftMenu);
    ctx.redirect(`/${firstPath || 'emptyPage'}`);
  }

  //获取用户设置的权限点（包括页面和按钮）
  async getUserPermissionInfo() {
    const { ctx, config } = this;
    //本地开发环境去掉权限控制
    const defaultPermissionList = Base64.encode(JSON.stringify([]))
    const node_env = ctx.service.env.getProjectEnv();
    // if (node_env == 'development') return defaultPermissionList
    let permissionCookie = this.getPermissionCookie();
    if (permissionCookie) {
      return permissionCookie || defaultPermissionList
    }
    const result = await ctx.service.api.ajax('scrm-basic/permissionInfo/getUserPermissionInfo', {
      method: "get",
    });
    if (result.data && result.data.retCode == '999998') return null
    else if (result.data && result.data.retCode == '000000') {
      const permissionList = Base64.encode(JSON.stringify(result.data.item.map(v => v.code)))
      ctx.cookies.set(config.cookieKey.permissionToken, permissionList, this.getCookieOption());
      return permissionList
    }
    else return defaultPermissionList
  }

  async browseOther() {
    const { ctx } = this;
    await ctx.render('index');
  }

  getAuthorityFirstMenu(data) {
    let loop = (arr) => {
      for (let i = 0, len = arr.length; i < len; i++) {
        let obj = arr[i],
          resAttr = obj.resAttr || {},
          path = resAttr.path,
          tabType = resAttr.tabType,
          children = obj.children;

        if (path && !tabType) return path;
        if (children && children.length) {
          let temp = loop(children);
          if (temp) return temp;
        }
      }
      return null;
    }
    return loop(data)
  }
}

module.exports = HomeController;
