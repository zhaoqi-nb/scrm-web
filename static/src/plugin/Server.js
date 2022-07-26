/* eslint-disable prefer-promise-reject-errors */

'use strict';

import reqwest from 'reqwest';
import { message } from 'antd';

export default class Server {
  httpThen(msg, resolve, reject) {
    if (msg.retCode == '000000' || msg.retCode == 200) {
      resolve({
        ...msg,
        retCode: 200
      });
    } else if (msg.code == 405) {
      window.location.href = '/login'
    } else if (msg.retCode == 999998) { // 请求失败
      message.destroy()
      message.error(msg.retMsg || msg.message);
      if (msg.retCode == 999998) {
        window.location.href = '/login'
      }
    } else {
      message.destroy()
      message.error(msg.retMsg || msg.message);
      reject(msg);
    }
  }

  Http(params) {
    const defaultParam = {
      url: '',
      type: 'get',
      dataType: 'json',
      isLoading: false,
      data: {}
    }
    const option = { ...defaultParam, ...params };
    const { httpThen } = this
    // api request
    function Cons(resolve, reject) {
      reqwest({
        url: option.url,
        method: option.type,
        data: option.data,
        type: option.dataType,
        contentType: option.contentType || 'application/x-www-form-urlencoded',
        timeout: 1200000,
      }).then((msg) => {
        httpThen(msg, resolve, reject)
      }).fail((err) => {
        message.error(err);
        reject(err);
      }).always(() => {
      })
    }
    return new Promise(Cons);
  }

  HttpPost(params) {
    const defaultParam = {
      url: '',
      type: 'post',
      dataType: 'json',
      isLoading: false,
      data: {},
    }
    const option = { ...defaultParam, ...params };
    const { httpThen } = this
    // api request
    function Cons(resolve, reject) {
      reqwest({
        url: option.url,
        method: option.type,
        data: JSON.stringify(option.data),
        type: option.dataType,
        timeout: 1200000,
        contentType: option.contentType || 'application/json',
        processData: false,
      }).then((msg) => {
        httpThen(msg, resolve, reject)
      }).fail((err) => {
        message.error(err);
        reject(err);
      }).always(() => {
      })
    }
    return new Promise(Cons);
  }
}
