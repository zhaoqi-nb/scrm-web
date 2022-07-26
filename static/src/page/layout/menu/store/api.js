'use strict';

import Server from '../../../../plugin/Server';

class Api extends Server {
  // doLogin
  async getPageInfo(data = {}) {
    return await this.HttpPost({
      url: '/api/getPageInfo',
      data,
    })
  }
}

export default new Api();
