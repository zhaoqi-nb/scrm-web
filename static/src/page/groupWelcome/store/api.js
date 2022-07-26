/* eslint-disable import/extensions */

'use strict';

import Server from '@/plugin/Server';

class Api extends Server {
  async queryList(data = {}) {
    return await this.HttpPost({
      url: '/api/scrm-web/scrm-service/welcomeMessageInfo/queryList',
      data,
    })
  }

  deleteData(data = {}) {
    return this.HttpPost({
      url: '/api/scrm-web/scrm-service/welcomeMessageInfo/deleteByKey',
      data,
    })
  }
}

export default new Api();
