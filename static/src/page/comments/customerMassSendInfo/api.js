'use strict';

import Server from '../../../plugin/Server';

class Api extends Server {
  // 群发，群群发详情
  getDetail(data = {}) {
    return this.Http({
      url: '/api/scrm-web/qywx-market/bulkMessage/detail',
      data
    })
  }

  // 数据概览
  getDataIndex(data = {}) {
    return this.Http({
      url: '/api/scrm-web/qywx-market/bulkMessageReport/index',
      data
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

  // 群列表
  groupList(data = {}) {
    return this.HttpPost({
      url: '/api/scrm-web/qywx-market/bulkMessageReport/groupList',
      data
    })
  }

  // 发送提醒
  callMessage(data = {}) {
    return this.Http({
      url: '/api/scrm-web/qywx-market/bulkMessage/call',
      data,
    })
  }

  // 人员搜索客户
  searchCustomerByName(data = {}) {
    return this.HttpPost({
      url: '/api/scrm-web/scrm-basic/customer/searchCustomerByName',
      data,
    })
  }

  // 人员搜索员工
  searchMemberByName(data = {}) {
    return this.HttpPost({
      url: '/api/scrm-web/scrm-basic/member/searchMemberByName',
      data,
    })
  }

  getGroupList(data = {}) {
    return this.HttpPost({
      url: '/api/scrm-web/qywx-market/bulkMessageReport/groupList',
      data,
    })
  }
}

export default new Api();
