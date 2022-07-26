'use strict';

import Server from '../../../plugin/Server';

class Api extends Server {
  backstageSearchConvertCluesList(data = {}) {
    return this.HttpPost({
      url: '/api/scrm-web/scrm-service/cluesInfo/backstageSearchConvertCluesList',
      data,
    })
  }

  // 获取部门以及部门下人员（带权限）
  queryAllDepartAndAllMemberAddRoleBoundary() {
    return this.Http({
      url: '/api/scrm-web/scrm-basic/roleDataAuthInfo/queryAllDepartAndAllMemberAddRoleBoundary'
    })
  }
}

export default new Api();
