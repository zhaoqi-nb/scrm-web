'use strict';

import Server from '../../../plugin/Server';

class Api extends Server {
  cusFieldConfigList(data = {}) {
    return this.Http({
      url: '/api/scrm-web/scrm-basic/cusFieldConfig/list',
      data
    })
  }

  // 获取事件枚举值
  getCustomerEvents(data = {}) {
    return this.Http({
      url: '/api/scrm-web/scrm-basic/dict/getCustomerEvents',
      data
    })
  }

  // 获取字段类型valueType
  getConditionRelationList(data = {}) {
    return this.Http({
      url: '/api/scrm-web/scrm-basic/dict/getConditionRelationList',
      data
    })
  }
}

export default new Api();
