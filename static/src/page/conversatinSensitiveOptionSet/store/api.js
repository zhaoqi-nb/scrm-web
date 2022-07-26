'use strict';

import Server from '@plugin/Server';

class Api extends Server {
  // 提交接口
  saveData(data = {}) {
    return this.HttpPost({
      url: '/api/scrm-web/qywx-sessionsave/sensitiveInfo/addSensitiveInfo',
      data,
    })
  }

  getData(data = {}) {
    return this.Http({
      url: `/api/scrm-web/qywx-sessionsave/sensitiveInfo/editSensitiveInfo/${data.id}`,
      data,
    })
  }

  // 提交接口
  upData(data = {}) {
    return this.HttpPost({
      url: '/api/scrm-web/qywx-sessionsave/sensitiveInfo/updateSensitiveInfo',
      data,
    })
  }

  queryTagList() {
    return this.Http({
      url: '/api/scrm-web/scrm-basic/labelGroupRef/list'
    })
  }
}

export default new Api();
