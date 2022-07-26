'use strict';

import Server from '../../../plugin/Server';

class Api extends Server {
  // 跟进中的线索新增线索
  addDataFormCluesList(data = {}) {
    return this.HttpPost({
      url: '/api/scrm-web/scrm-service/cluesInfo/addDataFormCluesList',
      data,
    })
  }

  // 线索公海新增线索
  addDataFormPublicLake(data = {}) {
    return this.HttpPost({
      url: '/api/scrm-web/scrm-service/cluesInfo/addDataFormPublicLake',
      data,
    })
  }

  // 获取全部成员
  getMemberList(data = {}) {
    return this.Http({
      url: '/api/scrm-web/scrm-basic/roleDataAuthInfo/getMemberList',
      data,
    })
  }
}

export default new Api();
