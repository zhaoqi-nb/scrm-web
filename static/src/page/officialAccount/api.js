'use strict';

import Server from '../../plugin/Server';

class Api extends Server {
  getAuthOfficialAccountList(data = {}) {
    return this.Http({
      url: '/api/scrm-web/scrm-basic/wxThirdPlatform/getAuthOfficialAccountList',
      data
    })
  }

  getAuthOfficialAccountUrl(data = {}) {
    return this.Http({
      url: '/api/scrm-web/scrm-basic/wxThirdPlatform/getAuthOfficialAccountUrl',
      data
    })
  }

  saveAuthOfficialAccountInfo(data = {}) {
    return this.Http({
      url: '/api/scrm-web/scrm-basic/wxThirdPlatform/saveAuthOfficialAccountInfo',
      data
    })
  }
}

export default new Api();
