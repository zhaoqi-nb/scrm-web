'use strict';

import Server from '@plugin/Server';

class Api extends Server {
  // 提交接口
  saveData(data = {}) {
    return this.HttpPost({
      url: '/api/scrm-web/qywx-sessionsave/sessionSaveConfigInfo/saveOrUpdate',
      data,
    })
  }

  getData(data = {}) {
    return this.Http({
      url: '/api/scrm-web/qywx-sessionsave/sessionSaveConfigInfo/get',
      data,
    })
  }

  getFixedConfig(data = {}) {
    return this.Http({
      url: '/api/scrm-web/qywx-sessionsave/sessionSaveConfigInfo/getFixedConfig',
      data,
    })
  }
}

export default new Api();
