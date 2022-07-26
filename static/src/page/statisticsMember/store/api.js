'use strict';

import Server from '@plugin/Server';

class Api extends Server {
  getStatisticInfo(data = {}) {
    return this.HttpPost({
      url: '/api/scrm-web/scrm-service/userCountConfig/index',
      data,
    })
  }

  getStatisticChart(data = {}) {
    return this.HttpPost({
      url: '/api/scrm-web/scrm-service/userCountConfig/line',
      data,
    })
  }

  getStatisticDetailList(data = {}) {
    return this.HttpPost({
      url: '/api/scrm-web/scrm-service/userCountConfig/userList',
      data,
    })
  }
}

export default new Api();
