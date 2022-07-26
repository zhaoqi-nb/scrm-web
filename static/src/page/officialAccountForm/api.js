'use strict';

import Server from '../../plugin/Server';

class Api extends Server {
  addDataFormOther(data = {}) {
    return this.HttpPost({
      url: '/api/scrm-web/scrm-service/cluesAddData/noAuth/addDataFormOther',
      data
    })
  }

  // 发送验证码
  sendPhoneCode(data = {}) {
    return this.Http({
      url: '/api/scrm-web/scrm-service/sms/noAuth/send',
      data
    })
  }

  // 校验验证码
  checkPhoneCode(data = {}) {
    return this.HttpPost({
      url: '/api/scrm-web//scrm-service/sms/noAuth/check',
      data
    })
  }
}

export default new Api();
