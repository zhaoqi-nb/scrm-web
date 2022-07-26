'use strict';

import Server from '../../../plugin/Server';

class Api extends Server {
  // 新增角色
  saveRoleInfo(data = {}) {
    return this.HttpPost({
      url: '/api/scrm-web/scrm-basic/roleInfo/save',
      data,
    })
  }

  // 更新角色
  updateRoleInfo(data = {}) {
    return this.HttpPost({
      url: '/api/scrm-web/scrm-basic/roleInfo/update',
      data,
    })
  }

  // 删除角色
  deleteByKey(id) {
    return this.Http({
      url: `/api/scrm-web/scrm-basic/roleInfo/deleteByKey/${id}`,
    })
  }

  queryList(data = {}) {
    return this.HttpPost({
      url: '/api/scrm-web/scrm-basic/roleInfo/queryList',
      data,
    })
  }

  queryEnableEMenu() {
    return this.Http({
      url: '/api/scrm-web/scrm-basic/permissionInfo/queryEnableEMenu',
    })
  }

  // 后台权限保存
  saveRolePermissionInfo(data = {}) {
    return this.HttpPost({
      url: '/api/scrm-web/scrm-basic/roleInfo/saveRolePermissionInfo',
      data
    })
  }

  getPermissionInfoByRole(data = {}) {
    return this.Http({
      url: '/api/scrm-web/scrm-basic/roleInfo/getPermissionInfoByRole',
      data
    })
  }

  getByRoleId(data = {}) {
    return this.Http({
      url: '/api/scrm-web/scrm-basic/roleDataAuthInfo/getByRoleId',
      data
    })
  }

  queryDepartListByCompanyId(data = {}) {
    return this.Http({
      url: '/api/scrm-web/scrm-basic/departInfo/queryDepartListByCompanyId',
      data,
    })
  }

  saveRoleDataAuthInfo(data = {}) {
    return this.HttpPost({
      url: '/api/scrm-web/scrm-basic/roleDataAuthInfo/save',
      data,
    })
  }
}

export default new Api();
