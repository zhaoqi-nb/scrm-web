'use strict';

import Server from '../../../plugin/Server';

class Api extends Server {
  bulkMessagePage(data = {}) {
    return this.HttpPost({
      url: '/api/scrm-web/qywx-market/bulkMessage/page',
      data,
    })
  }

  // 发送提醒
  callMessage(data = {}) {
    return this.Http({
      url: '/api/scrm-web/qywx-market/bulkMessage/call',
      data,
    })
  }

  // 取消发送
  delMessage(data = {}) {
    return this.HttpPost({
      url: '/api/scrm-web/qywx-market/bulkMessage/del',
      data,
    })
  }
}

export default new Api();
