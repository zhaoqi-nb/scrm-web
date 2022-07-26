'use strict';

import Server from '../../../plugin/Server';

class Api extends Server {
  getAreaList(data = {}) {
    return this.Http({
      url: '/api/scrm-web/scrm-service/regionLinkageInfo/getAreaList',
      data
    })
  }
}

export default new Api();
