import Server from '../../plugin/Server'

class Api extends Server {
  queryAllDepartAndAllMemberAddRoleBoundary() {
    return this.Http({
      url: '/api/scrm-web/scrm-basic/roleDataAuthInfo/queryAllDepartAndAllMemberAddRoleBoundary'
    })
  }

  saveOrUpdate(data = {}) {
    return this.HttpPost({
      url: '/api/scrm-web/qywx-market/bulkMessage/saveOrUpdate',
      data,
    })
  }

  // 查看客户数量
  checkCount(data = {}) {
    return this.HttpPost({
      url: '/api/scrm-web/qywx-market/bulkMessage/count',
      data,
    })
  }

  // 获取员工是否需要提醒
  getMemberSwitchStatus(data = {}) {
    return this.HttpPost({
      url: '/api/scrm-web/scrm-basic/memberSwitchStatus/getMemberSwitchStatus',
      data,
    })
  }
}

export default new Api()
