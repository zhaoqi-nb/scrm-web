import Server from '../../plugin/Server'

class Api extends Server {
  queryAllDepartAndAllMemberAddRoleBoundary() {
    return this.Http({
      url: '/api/scrm-web/scrm-basic/roleDataAuthInfo/queryAllDepartAndAllMemberAddRoleBoundary'
    })
  }

  saveNewCustomers(data = {}) {
    return this.HttpPost({
      url: '/api/scrm-web/scrm-service/chatAutoPullTask/save',
      data,
    })
  }

  updateNewCustomers(data = {}) {
    return this.HttpPost({
      url: '/api/scrm-web/scrm-service/chatAutoPullTask/update',
      data,
    })
  }

  // 获取详情
  getDetail(id) {
    return this.Http({
      url: `/api/scrm-web/scrm-service/chatAutoPullTask/detail/${id}`,
    })
  }
}

export default new Api()
