'use strict';

import Server from '../../../plugin/Server';

class Api extends Server {
  // 获取分组列表
  findGroup(data = {}) {
    return this.HttpPost({
      url: '/api/scrm-web/scrm-service/term/group/findGroup',
      data,
    })
  }

  // 获取分组详情
  getGroup(data = {}) {
    return this.HttpPost({
      url: '/api/scrm-web/scrm-service/term/group/getGroup',
      data,
    })
  }

  getTermInfo(data = {}) {
    return this.HttpPost({
      url: '/api/scrm-web/scrm-service/term/info/getTermInfo',
      data,
    })
  }

  queryAllDepartAndAllMemberAddRoleBoundary() {
    return this.Http({
      url: '/api/scrm-web/scrm-basic/roleDataAuthInfo/queryAllDepartAndAllMemberAddRoleBoundary'
    })
  }

  addTermInfo(data = {}) {
    return this.HttpPost({
      url: '/api/scrm-web/scrm-service/term/info/addTermInfo',
      data,
    })
  }

  updateTermInfo(data = {}) {
    return this.HttpPost({
      url: '/api/scrm-web/scrm-service/term/info/updateTermInfo',
      data,
    })
  }
}

export default new Api();
