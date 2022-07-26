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

  // 删除分组
  deleteGroup(data = {}) {
    return this.HttpPost({
      url: '/api/scrm-web/scrm-service/term/group/deleteGroup',
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

  updateGroup(data = {}) {
    return this.HttpPost({
      url: '/api/scrm-web/scrm-service/term/group/updateGroup',
      data,
    })
  }

  addGroup(data = {}) {
    return this.HttpPost({
      url: '/api/scrm-web/scrm-service/term/group/addGroup',
      data,
    })
  }

  deleteTermInfo(data = {}) {
    return this.HttpPost({
      url: '/api/scrm-web/scrm-service/term/info/deleteTermInfo',
      data
    })
  }

  findTermInfo(data = {}) {
    return this.HttpPost({
      url: '/api/scrm-web/scrm-service/term/info/findTermInfo',
      data,
    })
  }

  queryAllDepartAndAllMemberAddRoleBoundary() {
    return this.Http({
      url: '/api/scrm-web/scrm-basic/roleDataAuthInfo/queryAllDepartAndAllMemberAddRoleBoundary'
    })
  }
}

export default new Api();
