'use strict';

import Server from '@plugin/Server';

class Api extends Server {
  getSensitiveTriggerRecord(data = {}) {
    return this.HttpPost({
      url: '/api/scrm-web/qywx-sessionsave/sensitiveTriggerRecord/getSensitiveTriggerRecord',
      data,
    })
  }

  selectList(data = {}) {
    return this.HttpPost({
      url: '/api/scrm-web/qywx-sessionsave/sensitiveBehaviorRecord/selectList',
      data,
    })
  }

  querySessionSaveList(data = {}) {
    return this.HttpPost({
      url: '/api/scrm-web/qywx-sessionsave/sessionSaveInfo/querySessionSaveList',
      data,
    })
  }
}

export default new Api();
