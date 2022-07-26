'use strict';

import Server from '../../../plugin/Server';

class Api extends Server {
  queryList(data = {}) {
    return this.HttpPost({
      url: '/api/scrm-web/scrm-service/chatAutoPullTask/queryList',
      data,
    })
  }

  queryAllDepartAndAllMemberAddRoleBoundary() {
    return this.Http({
      url: '/api/scrm-web/scrm-basic/roleDataAuthInfo/queryAllDepartAndAllMemberAddRoleBoundary'
    })
  }

  delById(id) {
    return this.Http({
      url: `/api/scrm-web/scrm-service/chatAutoPullTask/invalid/${id}`
    })
  }

  // 获取详情
  getDetail(id) {
    return this.Http({
      url: `/api/scrm-web/scrm-service/chatAutoPullTask/detail/${id}`,
    })
  }
}

export default new Api();
