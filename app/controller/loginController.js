const ServiceController = require('./serviceController');

class LoginController extends ServiceController {
  async index() {
    const { ctx } = this;
    await ctx.render('login');
  }

  async erCodeLogin() {
    const { ctx } = this;
    const query = ctx.query;
    const { code, auth_code } = query; //三方应用返回的是auth_code，自建应用是code

    // query data
    const result = await ctx.service.api.ajax('qywx-callback/oauth/loginByCode', {
      data: {
        code: code || auth_code
      },
    });

    if (result.data.retCode == '000000') {
      try {
        const datas = result.data.item;
        const cookieResult = await this.setUserTokenCookie(datas);
        if (!cookieResult) {
          this.paramError('LE');
        } else {
          ctx.rotateCsrfSecret();
          ctx.redirect('/')
          return
          // this.success({ redirectUrl: '/', cookieOption, accessToken: datas.accessToken, memberId: datas.memberId });
        }
      } catch (error) {
        this.logErr('登录失败！', error);
        this.paramError('LE');
      }
    } else this.returnData(result.data)
  }

  async doLogin() {
    const { ctx } = this;
    const query = ctx.request.body || {};
    const { mobile, password } = query;
    const path = ctx.params[0]
    const redirectUrl = ctx.service.secretKey.getDecData(query.redirectUrl);
    const ipAddress = ctx.header['x-forwarded-for'] ? ctx.header['x-forwarded-for'] : ctx.ip;
    if (!mobile || !password) {
      this.paramError();
      return;
    }

    const param = {
      mobile,
      password: this.ctx.service.secretKey.getDecData(password),
      ipAddress,
    };

    // query data
    const result = await ctx.service.api.ajax(path, {
      data: param,
      headers: {
        "Content-Type": "application/json"
      },
      method: "post"
    });

    if (result.data.retCode == '000000') {
      try {
        const datas = result.data.item;
        const cookieOption = this.getCookieOption()
        const cookieResult = await this.setUserTokenCookie(datas);
        if (!cookieResult) {
          this.paramError('LE');
        } else {
          ctx.rotateCsrfSecret();
          // 返回数据
          // ctx.redirect(redirectUrl || '/');
          this.success({ redirectUrl: redirectUrl || '/', cookieOption, accessToken: datas.accessToken, memberId: datas.memberId, dataBurning: datas.dataBurning });
        }
      } catch (error) {
        this.logErr('登录失败！', error);
        this.paramError('LE');
      }
    } else this.returnData(result.data)
  }

  // 退出登录
  async doLogout() {
    const { ctx, config } = this;

    let { hostname } = ctx;

    const option = {
      path: '/',
      domain: hostname,
    };

    // delete cookie
    ctx.cookies.set(config.cookieKey.userToken, null, option);

    // 跳转页面
    ctx.redirect('/login');
  }
}

module.exports = LoginController;
