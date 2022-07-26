'use strict';

import Server from '../../../plugin/Server';

class Api extends Server {
  // 新增角色
  staffDirectoryList(data = {}) {
    return this.HttpPost({
      url: '/api/scrm-web/scrm-basic/member/staffDirectoryList',
      data,
    })
  }

  queryDepartListByCompanyId(data = {}) {
    return this.Http({
      url: '/api/scrm-web/scrm-basic/departInfo/queryDepartListByCompanyId',
      data,
    })
  }

  getRoleInfoList(data = {}) {
    return this.Http({
      url: '/api/scrm-web/scrm-basic/roleInfo/list',
      data,
    })
  }

  staffDirectoryDeleteUser(data = {}) {
    return this.Http({
      url: '/api/scrm-web/scrm-basic/member/staffDirectoryDeleteUser',
      data,
    })
  }

  addDepartInfo(data = {}) {
    return this.HttpPost({
      url: '/api/scrm-web/scrm-basic/departInfo/addDepartInfo',
      data,
    })
  }

  deleteDepartInfo(id) {
    return this.Http({
      url: `/api/scrm-web/scrm-basic/departInfo/deleteDepartInfo/${id}`,
    })
  }

  saveRoleMemberRel(data = {}) {
    return this.HttpPost({
      url: '/api/scrm-web/scrm-basic/roleMemberRel/save',
      data,
    })
  }

  updateDepartInfo(data = {}) {
    return this.HttpPost({
      url: '/api/scrm-web/scrm-basic/departInfo/updateDepartInfo',
      data,
    })
  }

  getInvitation(data = {}) {
    return this.Http({
      url: '/api/scrm-web/scrm-basic/addressBook/invitation',
      data,
    })
  }

  syncAddressBook(data = {}) {
    return this.Http({
      url: '/api/scrm-web/scrm-basic/addressBook/sync',
      data,
    })
  }

  // 单个或者批量更换员工部门
  batchUpdateMemberDepart(data = {}) {
    return this.HttpPost({
      url: '/api/scrm-web/scrm-basic/memberDepartRel/batchUpdateMemberDepart',
      data,
    })
  }

  transferAdmin(data = {}) {
    return this.Http({
      url: '/api/scrm-web/scrm-basic/addressBook/transferAdmin',
      data,
    })
  }

  batchSaveRole(data = {}) {
    return this.HttpPost({
      url: '/api/scrm-web/scrm-basic/roleMemberRel/batchSave',
      data,
    })
  }

  queryBindMemberIdentityList(data = {}) {
    return this.HttpPost({
      url: '/api/scrm-web/scrm-basic/member/queryBindMemberIdentityList',
      data,
    })
  }

  bindMemberIdentity(data = {}) {
    return this.HttpPost({
      url: '/api/scrm-web/scrm-basic/member/bindMemberIdentity',
      data,
    })
  }

  getMemberIdentity(memberId) {
    return this.Http({
      url: `/api/scrm-web/scrm-basic/member/getMemberIdentity/${memberId}`,
    })
  }
}

export default new Api();
