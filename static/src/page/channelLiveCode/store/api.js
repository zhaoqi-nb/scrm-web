'use strict';

import Server from '@plugin/Server';

class Api extends Server {
  async queryList(data = {}) {
    return await this.HttpPost({
      url: '/api/scrm-web/scrm-service/channelCode/listByPage',
      data,
    })
  }

  getData(data = {}) {
    return this.Http({
      url: `/api/scrm-web/scrm-service/channelCode/detail/${data.id}`,
    })
  }

  getStaffData() {
    return this.Http({
      url: '/api/scrm-web/scrm-basic/roleDataAuthInfo/queryAllDepartAndAllMemberAddRoleBoundary'
    })
  }

  deleteData(data = {}) {
    return this.Http({
      url: `/api/scrm-web/scrm-service/channelCode/invalid/${data.id}`,
    })
  }

  getCustomerOverview(data = {}) {
    return this.HttpPost({
      url: '/api/scrm-web/scrm-service/summary/channelCode/getCustomerOverview',
      data,
    })
  }

  getCustomerChart(data = {}) {
    return this.HttpPost({
      url: '/api/scrm-web/scrm-service/summary/channelCode/getCustomerChart',
      data,
    })
  }

  getCustomerList(data = {}) {
    return this.HttpPost({
      url: '/api/scrm-web/scrm-service/summary/channelCode/getCustomerList',
      data,
    })
  }
}

export default new Api();
