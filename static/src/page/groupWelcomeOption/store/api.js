'use strict';

import Server from '../../../plugin/Server';

class Api extends Server {
  // 提交接口
  saveData(data = {}) {
    return this.HttpPost({
      url: '/api/scrm-web/scrm-service/welcomeMessageInfo/save',
      data,
    })
  }

  getData(data = {}) {
    return this.HttpPost({
      url: '/api/scrm-web/scrm-service/welcomeMessageInfo/getInfo',
      data,
    })
  }

  // 提交接口
  upData(data = {}) {
    return this.HttpPost({
      url: '/api/scrm-web/scrm-service/welcomeMessageInfo/update',
      data,
    })
  }
}

export default new Api();
