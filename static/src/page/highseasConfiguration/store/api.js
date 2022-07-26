'use strict';

import Server from '../../../plugin/Server';

class Api extends Server {
  queryList(data = {}) {
    return this.HttpPost({
      url: '/api/scrm-web/scrm-service/publicLakeInfo/queryList',
      data,
    })
  }

  getByKey(id) {
    return this.Http({
      url: `/api/scrm-web/scrm-service/publicLakeInfo/getByKey/${id}`,
    })
  }

  update(data = {}) {
    return this.HttpPost({
      url: '/api/scrm-web/scrm-service/publicLakeInfo/update',
      data,
    })
  }
}

export default new Api();
