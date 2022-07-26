'use strict';

import Server from '@plugin/Server';

class Api extends Server {
  deleteSensitiveInfo(data = {}) {
    return this.Http({
      url: `/api/scrm-web/qywx-sessionsave/sensitiveInfo/deleteSensitiveInfo/${data.id}`,
    })
  }

  getSensitiveInfoList(data = {}) {
    return this.HttpPost({
      url: '/api/scrm-web/qywx-sessionsave/sensitiveInfo/getSensitiveInfoList',
      data,
    })
  }
}

export default new Api();
