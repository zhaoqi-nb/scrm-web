'use strict';

import Server from '@plugin/Server';

class Api extends Server {
  getColumnListByBusinessType({ type, url }, data = {}) {
    let newUrl = `/api/scrm-web/scrm-service/cluesColumnSetting/getColumnListByBusinessType/${type}`
    if (url) {
      newUrl = `/api/scrm-web/${url}`
    }
    return this.Http({
      url: newUrl,
      data,
    })
  }

  updateUserColumnList(url, data = {}) {
    let newUrl = '/api/scrm-web/scrm-service/cluesColumnSetting/updateUserColumnList'

    if (url) {
      newUrl = `/api/scrm-web/${url}`
    }

    return this.HttpPost({
      url: newUrl,
      data
    })
  }

  initColumnSetting(type) {
    return this.Http({
      url: `/api/scrm-web/scrm-service/cluesColumnSetting/initColumnSetting/${type}`
    })
  }
}

export default new Api();
