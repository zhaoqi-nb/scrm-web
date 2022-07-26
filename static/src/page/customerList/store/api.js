import Server from '../../../plugin/Server';

class Api extends Server {
  // 新增客户（手动）
  manualAddCustomerInfo(data) {
    return this.HttpPost({
      url: '/api/scrm-web/scrm-basic/customer/manualAddCustomerInfo',
      data
    })
  }

  updateCustomerBasicInformation(data) {
    return this.HttpPost({
      url: '/api/scrm-web/scrm-basic/customer/updateCustomerBasicInformation',
      data
    })
  }

  // 查询客户详情
  getCustomerInfoById(id) {
    return this.Http({
      url: `/api/scrm-web/scrm-basic/customer/getCustomerInfoById/${id}`,
    })
  }

  // 获取动态表头
  getColumnListByBusinessType() {
    const newUrl = '/api/scrm-web/scrm-basic/customerRelatedColumnSetting/getCustomerListColumnByCustomerId'

    return this.Http({
      url: newUrl,
    })
  }

  // 获取客户列表数据
  queryList(data = {}) {
    return this.HttpPost({
      url: '/api/scrm-web/scrm-basic/customer/customerMangerSearchList',
      data
    })
  }

  getExcelFil(data = {}) {
    return this.HttpPost({
      url: '/api/scrm-web/scrm-basic/customer/excelFile',
      data
    })
  }

  // 获取客户分群列表 搜索条件
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

  // 获取客户属性，用于新建功能
  getDataListByLoginHolder() {
    return this.Http({
      url: '/api/scrm-web/scrm-basic/customerAttributeSetting/getDataListByLoginHolder',
    })
  }

  deleteCustomerByCustomerId(ids) {
    return this.Http({
      url: `/api/scrm-web/scrm-basic/customer/deleteCustomerByCustomerId/${ids}`,
    })
  }
}

export default new Api()
