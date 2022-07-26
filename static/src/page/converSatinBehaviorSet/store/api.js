'use strict';

import Server from '@plugin/Server';

class Api extends Server {
  // 提交接口
  saveData(data = {}) {
    return this.HttpPost({
      url: '/api/scrm-web/qywx-sessionsave/sensitiveBehavior/sensitiveOperate',
      data,
    })
  }

  getData(data = {}) {
    return this.Http({
      url: '/api/scrm-web/qywx-sessionsave/sensitiveBehavior/getSensitiveConfigDetail',
      data,
    })
  }
}

export default new Api();
