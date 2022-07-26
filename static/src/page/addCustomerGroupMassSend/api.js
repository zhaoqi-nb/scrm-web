import Server from '../../plugin/Server'

class Api extends Server {
  getMainGroupDepartTree(data = {}) {
    return this.Http({
      url: '/api/scrm-web/scrm-basic/departInfo/getMainGroupDepartTree',
      data,
    })
  }

  saveOrUpdate(data = {}) {
    return this.HttpPost({
      url: '/api/scrm-web/qywx-market/bulkMessage/saveOrUpdate',
      data,
    })
  }
}

export default new Api()
