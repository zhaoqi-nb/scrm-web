/*
 * @FileDescription    : 文件描述
 * @Author             : lin.li@fengjr.com
 * @Date               : 2018-06-27 16:23:34
 * @Last Modified by: lin.li@fengjr.com
 * @Last Modified time: yyyy-08-Tu 04:20:51
 */

const { Service } = require('egg');
const { getErrorCode } = require('../util/errorCode');
/**
 *
 */
class ServiceApi extends Service {
  // ajax param object to string

  getObjectToString(param) {
    const arr = [];
    for (const key in param) {
      arr.push(`${key}=${param[key]}`);
    }
    return arr.join('&');
  }

  // 去掉空值 key
  getRemoveEmpty(obj) {
    if (!obj) return null;
    const newObj = {};
    for (const key in obj) {
      const value = obj[key];
      try {
        if (
          (value.constructor === String && value != '')
          || (value.constructor === Number)
        ) newObj[key] = value;
      } catch (error) {
      }
    }

    return newObj;
  }

  /**
     * 发送请求
     * @Author    lin.li@fengjr.com
     * @DateTime  2018-01-24
     * @copyright [copyright]
     * @license   [license]
     * @version   [version]
     * @param     {[type]}          param [description]
     * @return    {[type]}                [description]
     */
  async ajax(url, options) {
    const { ctx, config } = this;

    const _default = {
      method: 'GET',
      basePath: config.API_DOMAIN.API_URL,
      // 通过 contentType 告诉 HttpClient 以 JSON 格式发送
      contentType: 'application/x-www-form-urlencoded',
      // 明确告诉 HttpClient 以 JSON 格式处理返回的响应 body
      dataType: 'json',
      timeout: 300000,
      data: {}
    };
    // 合并参数
    options = { ..._default, ...options };
    const userInfo = ctx.service.userService.getUserTockenCookie() || {};
    const accessToken = userInfo.accessToken
    //增加accessToken验证
    if (accessToken) options.headers = {
      ...(options.headers || {}),
      authentication: accessToken
    }
    let result = null;
    try {
      result = await ctx.curl(options.basePath + url, options);
    } catch (error) {
      ctx.logger.error('api 调用失败：url = %s, param = %s', url, error);

      ctx.logger.error('api 调用失败：url = %s, param = %s', url, this.getObjectToString(options.data));
    }

    ctx.service.logHelper.apiLog(`${options.basePath + url}?${this.getObjectToString(options.data)}`);
    if (!result) return { data: getErrorCode('SERVICE_ERROR') }
    return result;
  }
}

module.exports = ServiceApi;
