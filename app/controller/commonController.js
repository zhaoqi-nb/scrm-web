const ServiceController = require('./serviceController');
const newMenu = require('../fixedData/menuData/index')

class CommonController extends ServiceController {
  // 通用api
  async getCommonBusinessApiByGet() {
    const { ctx } = this;
    const query = ctx.query || {},
      path = ctx.params[0];

    if (!path) {
      this.paramError();
      return;
    }
    let param = {
      ...query,
    };
    const result = await ctx.service.api.ajax(path, {
      method: "get",
      data: param
    });

    this.returnData(result.data);
  }

  async getCommonBusinessApiByUploadPost() {
    const { ctx } = this;
    const query = ctx.request.body || {},
      path = ctx.params[0];

    if (!path) {
      this.paramError();
      return;
    }
    let param = {
      ...query,
    };
    const result = await ctx.service.api.ajax(path, {
      method: "post",
      data: param,
      headers: {
        // enctype: "multipart/form-data",
        "Content-Type": "application/x-www-form-urlencoded"
      },
    });

    this.returnData(result.data);
  }


  async getCommonBusinessApiByPost() {
    const { ctx } = this;
    const query = ctx.request.body || {},
      path = ctx.params[0];

    if (!path) {
      this.paramError();
      return;
    }
    let param = {
      ...query,
    };
    const result = await ctx.service.api.ajax(path, {
      method: "post",
      data: param,
      headers: {
        "Content-Type": "application/json"
      },
    });

    this.returnData(result.data);
  }

  getAllRouterByApi() {
    this.returnData(newMenu.children);
  }

}

module.exports = CommonController;
