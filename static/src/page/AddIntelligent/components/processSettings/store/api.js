'use strict';

import Server from '../../../../../plugin/Server';

class Api extends Server {
  // 获取客户分群列表
  getCustomerGroupList(data = {}) {
    return this.HttpPost({
      url: '/api/scrm-web/scrm-basic/customerGroup/getCustomerGroupListByMemberId',
      data
    })
  }

  // 客户属性，选择字段
  getInitCustomerGroupFileList() {
    return this.Http({
      url: '/api/scrm-web/scrm-basic/customerGroup/getInitCustomerGroupFileList',
    })
  }
}

export default new Api();
