'use strict';

import Server from '@plugin/Server';

class Api extends Server {
  getStatisticInfo(data = {}) {
    return this.HttpPost({
      url: '/api/scrm-web/scrm-service/statistical/customer/getStatisticInfo',
      data,
    })
  }

  getStatisticChart(data = {}) {
    return this.HttpPost({
      url: '/api/scrm-web/scrm-service/statistical/customer/getStatisticChart',
      data,
    })
  }

  getStatisticDetailList(data = {}) {
    return this.HttpPost({
      url: '/api/scrm-web/scrm-service/statistical/customer/getStatisticDetailList',
      data,
    })
  }
}

export default new Api();
