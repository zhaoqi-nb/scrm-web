'use strict';

import Server from '@plugin/Server';

class Api extends Server {
  queryList(data = {}) {
    return this.HttpPost({
      url: '/api/scrm-web/qywx-sessionsave/sessionSaveInfo/getCustomers',
      data,
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

  getChatCount(data = {}) {
    return this.HttpPost({
      url: '/api/scrm-web/qywx-sessionsave//sessionSaveInfo/getChatCount',
      data,
    })
  }
}

export default new Api();
