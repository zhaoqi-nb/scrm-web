'use strict';

import Server from '../../../plugin/Server';

class Api extends Server {
  getCustomerInfoById(id) {
    return this.Http({
      url: `/api/scrm-web/scrm-basic/customer/getCustomerInfoById/${id}`
    })
  }

  getCustomerEventListByCustomerId(data = {}) {
    return this.HttpPost({
      url: '/api/scrm-web/scrm-basic/customerEvent/getCustomerEventListByCustomerId',
      data
    })
  }

  // 获取跟进记录
  getCustomerFollowLogListByCustomerId(data = {}) {
    return this.HttpPost({
      url: '/api/scrm-web/scrm-basic/customerFollowLog/getCustomerFollowLogListByCustomerId',
      data
    })
  }

  // 添加跟进记录
  saveCustomerFollowLog(data = {}) {
    return this.HttpPost({
      url: '/api/scrm-web/scrm-basic/customerFollowLog/saveCustomerFollowLog',
      data
    })
  }

  getDataListByCompanyId(id) {
    return this.Http({
      url: `/api/scrm-web/scrm-basic/customerAttributeSetting/getDataListByCompanyId/${id}`
    })
  }

  // 删除客户
  deleteCustomerByCustomerId(id) {
    return this.Http({
      url: `/api/scrm-web/scrm-basic/customer/deleteCustomerByCustomerId/${id}`
    })
  }

  // 更新客户标签
  updateCustomerTag(data = {}) {
    return this.HttpPost({
      url: '/api/scrm-web/scrm-basic/customer/updateCustomerTag',
      data
    })
  }

  // 获取客户和员工会话列表
  // userChatType 员工--外部联系人 3、员工--群聊列表 4、客户--员工单聊 5、客户--群聊
  getChatListByUserId(data = {}) {
    let url = '/api/scrm-web/qywx-sessionsave/sessionSaveInfo/getChatListByUserId'
    if (data.userChatType == 4 || data.userChatType == 5) {
      url = '/api/scrm-web/qywx-sessionsave/sessionSaveInfo/getChatListForCustomer'
    }
    return this.HttpPost({
      url,
      data,
    })
  }

  getCongfig(data = {}) {
    return this.Http({
      url: '/api/scrm-web/qywx-sessionsave/sessionSaveConfigInfo/get',
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
