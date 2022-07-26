/*
 * @FileDescription    : 文件描述
 * @Author             : baoping.chen@fengjr.com
 * @Date               : 2018-09-27 14:17:06
 * @Last Modified by: lin.li@fengjr.com
 * @Last Modified time: 2020-04-25 15:50:49
 */

'use strict';

import * as model from './action-type';

const defaultState = {
  status: '',
  isRefresh: false,
  // -1=已删除 1=已激活，2=已禁用，4=未激活，5=退出企业
  statusOptions: [{ code: '', name: '全部' }, { code: -1, name: '已删除' }, { code: 1, name: '已激活' }, { code: 2, name: '已禁用' }, { code: 4, name: '未激活' }, { code: 5, name: '已离职' }],
  roleInfoList: [],
  selectTreeData: [],
  departId: '',
  identityList: [
    { label: '联络组长', value: '1' },
    { label: '后台大组长', value: '2' },
    { label: '后台小组长', value: '3' },
  ]
};

// model manage
export const mailList = (state = defaultState, action = {}) => {
  switch (action.type) {
    case model.SETVALUES:
      return { ...state, ...action.values };
    default:
      return defaultState;
  }
}
