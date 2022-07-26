'use strict';

import Server from '../../../plugin/Server';

class Api extends Server {
  queryCluesLakeList(data = {}) {
    return this.HttpPost({
      url: '/api/scrm-web/scrm-service/cluesInfo/queryCluesLakeList',
      data,
    })
  }

  doingCluesQueryInfoByCluesId(cluesId) {
    return this.Http({
      url: `/api/scrm-web/scrm-service/cluesInfo/doingCluesQueryInfoByCluesId/${cluesId}`
    })
  }

  // 更换公海
  replaceCluesLake(data = {}) {
    return this.HttpPost({
      url: '/api/scrm-web/scrm-service/cluesInfo/replaceCluesLake',
      data,
    })
  }

  // 批量分配线索
  assignClues(data = {}) {
    return this.HttpPost({
      url: '/api/scrm-web/scrm-service/cluesInfo/assignClues',
      data,
    })
  }

  // 批量提取线索
  extractClues(data = {}) {
    return this.HttpPost({
      url: '/api/scrm-web/scrm-service/cluesInfo/extractClues',
      data,
    })
  }

  // 批量删除线索
  batchDeleteClues(cluesIds) {
    return this.Http({
      url: `/api/scrm-web/scrm-service/cluesInfo/batchDeleteClues/${cluesIds}`
    })
  }

  queryAllDepartAndAllMemberAddRoleBoundary() {
    return this.Http({
      url: '/api/scrm-web/scrm-basic/roleDataAuthInfo/queryAllDepartAndAllMemberAddRoleBoundary'
    })
  }

  queryLakeChoose(data = {}) {
    return this.HttpPost({
      url: '/api/scrm-web/scrm-service/publicLakeInfo/queryLakeChoose',
      data
    })
  }
}

export default new Api();
