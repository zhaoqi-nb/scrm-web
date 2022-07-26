'use strict';

import Server from '../../../plugin/Server';

class Api extends Server {
  // 获取员工是否需要提醒
  getMemberSwitchStatus(data = {}) {
    return this.Http({
      url: '/api/scrm-web/scrm-basic/memberSwitchStatus/getMemberSwitchStatus',
      data,
    })
  }

  closeTips(data = {}) {
    return this.HttpPost({
      url: '/api/scrm-web/scrm-basic/memberSwitchStatus/close',
      data,
    })
  }

  bulkMessagePage(data = {}) {
    return this.HttpPost({
      url: '/api/scrm-web/qywx-market/bulkMessage/page',
      data,
    })
  }

  // 取消发送
  delMessage(data = {}) {
    return this.HttpPost({
      url: '/api/scrm-web/qywx-market/bulkMessage/del',
      data,
    })
  }

  // 发送提醒
  callMessage(data = {}) {
    return this.Http({
      url: '/api/scrm-web/qywx-market/bulkMessage/call',
      data,
    })
  }

  // 老客数据概览
  oldCustomerBuildGroupIndex(data = {}) {
    return this.Http({
      url: '/api/scrm-web/qywx-market/bulkMessageReport/oldCustomerBuildGroupIndex',
      data,
    })
  }

  // 成员或者群主列表
  memberList(data = {}) {
    return this.HttpPost({
      url: '/api/scrm-web/qywx-market/bulkMessageReport/memberList',
      data
    })
  }

  // 客户列表
  customerList(data = {}) {
    return this.HttpPost({
      url: '/api/scrm-web/qywx-market/bulkMessageReport/customerList',
      data
    })
  }
}

export default new Api();
