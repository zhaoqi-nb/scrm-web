'use strict';

import Server from '../../../plugin/Server';

class Api extends Server {
  // 获取群活码列表
  getCodeTable(data = {}) {
    return this.HttpPost({
      url: '/api/scrm-web/scrm-basic/groupActivityCode/queryGroupActivityCodePage',
      data,
    })
  }
}

export default new Api();
