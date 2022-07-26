'use strict';

import Server from '../../../plugin/Server';

class Api extends Server {
  backstageSearchDoingCluesList(data = {}) {
    return this.HttpPost({
      url: '/api/scrm-web/scrm-service/cluesInfo/backstageSearchDoingCluesList',
      data,
    })
  }

  // 批量转移线索
  batchTransferClues(data = {}) {
    return this.HttpPost({
      url: '/api/scrm-web/scrm-service/cluesInfo/batchTransferClues',
      data,
    })
  }

  // 批量放弃线索
  batchAbandonClues(data = {}) {
    return this.HttpPost({
      url: '/api/scrm-web/scrm-service/cluesInfo/batchAbandonClues',
      data,
    })
  }

  // 批量删除线索
  batchDeleteClues(cluesIds) {
    return this.Http({
      url: `/api/scrm-web/scrm-service/cluesInfo/batchDeleteClues/${cluesIds}`
    })
  }

  // 获取部门以及部门下人员（带权限）
  queryAllDepartAndAllMemberAddRoleBoundary() {
    return this.Http({
      url: '/api/scrm-web/scrm-basic/roleDataAuthInfo/queryAllDepartAndAllMemberAddRoleBoundary'
    })
  }

  doingCluesQueryInfoByCluesId(cluesId) {
    return this.Http({
      url: `/api/scrm-web/scrm-service/cluesInfo/doingCluesQueryInfoByCluesId/${cluesId}`
    })
  }

  // 添加跟进记录
  addFollowLog(data = {}) {
    return this.HttpPost({
      url: '/api/scrm-web/scrm-service/cluesFollowLog/addFollowLog',
      data,
    })
  }

  updateCluesCustomerInfo(data = {}) {
    return this.HttpPost({
      url: '/api/scrm-web/scrm-service/cluesInfo/updateCluesCustomerInfo',
      data,
    })
  }

  getCluesListByCluesId(cluesId) {
    return this.Http({
      url: `/api/scrm-web/scrm-service/cluesOperationLog/getCluesListByCluesId/${cluesId}`
    })
  }

  getFollowLogListByCluesId(cluesId) {
    return this.Http({
      url: `/api/scrm-web//scrm-service/cluesFollowLog/getFollowLogListByCluesId/${cluesId}`
    })
  }

  manualUpdateCluesProcessed(cluesId) {
    return this.Http({
      url: `/api/scrm-web/scrm-service/cluesInfo/manualUpdateCluesProcessed/${cluesId}`
    })
  }

  // 线索转客户
  cluesToCustomer(data = {}) {
    return this.HttpPost({
      url: '/api/scrm-web/scrm-service/cluesInfo/cluesToCustomer',
      data,
    })
  }

  queryLakeChoose(data = {}) {
    return this.HttpPost({
      url: '/api/scrm-web/scrm-service/publicLakeInfo/queryLakeChoose',
      data
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

  // 延期申请
  exceedingRequest(data = {}) {
    return this.HttpPost({
      url: '/api/scrm-web/scrm-service/cluesInfo/exceedingRequest',
      data,
    })
  }
}

export default new Api();
