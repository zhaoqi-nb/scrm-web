'use strict';

import Server from '../../../plugin/Server';

class Api extends Server {
  queryLabelGroupList(data = {}) {
    return this.Http({
      url: '/api/scrm-web/scrm-basic/labelGroup/queryLabelGroupList',
      data,
    })
  }

  updateLabelGroup(data = {}) {
    return this.HttpPost({
      url: `/api/scrm-web/scrm-basic/labelGroup/update/${data.id}`,
      data,
    })
  }

  saveLabelGroup(data = {}) {
    return this.HttpPost({
      url: '/api/scrm-web/scrm-basic/labelGroup/save',
      data,
    })
  }

  removeLabelGroup(id) {
    return this.Http({
      url: `/api/scrm-web/scrm-basic/labelGroup/remove/${id}`
    })
  }

  queryLabelList(data = {}) {
    return this.Http({
      url: '/api/scrm-web/scrm-basic/label/queryLabelList',
      data,
    })
  }

  removeLabel(id) {
    return this.Http({
      url: `/api/scrm-web/scrm-basic/label/remove/${id}`
    })
  }

  saveLabels(data = {}) {
    return this.HttpPost({
      url: '/api/scrm-web/scrm-basic/label/batch/save',
      data,
    })
  }

  updateLabel(data = {}) {
    return this.HttpPost({
      url: `/api/scrm-web/scrm-basic/label/update/${data.id}`,
      data,
    })
  }

  batchSortLabel(data = {}) {
    return this.HttpPost({
      url: '/api/scrm-web/scrm-basic/label/batchSort',
      data,
    })
  }

  // 同步标签
  syncTagData(data = {}) {
    return this.Http({
      url: '/api/scrm-web/scrm-basic/label/syncTagData',
      data,
    })
  }
}

export default new Api();
