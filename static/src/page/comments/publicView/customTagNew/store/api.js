'use strict';

import Server from '@plugin/Server';

class Api extends Server {
  queryTagList() {
    return this.Http({
      url: '/api/scrm-web/scrm-basic/labelGroupRef/list'
    })
  }
}

export default new Api();
