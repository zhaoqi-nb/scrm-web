'use strict';

import Server from '@plugin/Server';

class Api extends Server {
  queryList(data = {}) {
    return this.HttpPost({
      url: '/api/scrm-web/qywx-sessionsave/sessionSaveInfo/getPermitUsers',
      data,
    })
  }
}

export default new Api();
