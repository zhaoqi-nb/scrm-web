import Server from '../../../plugin/Server'

class Api extends Server {
  saveData(data = {}) {
    return this.HttpPost({
      url: '/api/scrm-web/scrm-basic/customerGroup/saveCustomerGroup',
      data,
    })
  }

  getData(data = {}) {
    return this.Http({
      url: `/api/scrm-web/scrm-basic/customerGroup/queryCustomerGroupInfoById/${data.id}`,
      // data
    })
  }

  // 提交接口
  upData(data = {}) {
    return this.HttpPost({
      url: '/api/scrm-web/scrm-basic/customerGroup/updateCustomerCount',
      data,
    })
  }

  // 提交接口
  getGroupGetCount(data = {}) {
    return this.HttpPost({
      url: '/api/scrm-web/scrm-basic/customerGroup/createCustomerGroupGetCount',
      data,
    })
  }

  // 客户属性，选择字段
  getInitCustomerGroupFileList() {
    return this.Http({
      url: '/api/scrm-web/scrm-basic/customerGroup/getInitCustomerGroupFileList',
    })
  }
}

export default new Api()
