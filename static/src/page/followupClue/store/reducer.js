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
  belongCluesTypeList: [
    // {
    //   id: 2,
    //   name: '我负责的线索',
    // },
    // {
    //   id: 3,
    //   name: '下属负责的线索',
    // },
  ],
  willExpiredFlag: false,
  cluesDistributeType: '',
  memberInfoListByDepart: [],
  filterInitValue: {
    cluesChannelsType: '',
    cluesSourceType: '',
    mainFollowMemberId: '',
    createId: '',
    followStatus: '',
    belongDepartId: '',
    createCluesEndTime: '',
    createCluesStartTime: '',
    lastFollowCluesStartTime: '',
    lastFollowCluesEndTime: '',
    lastFollowCluesTime: [null, null],
    createCluesTime: [null, null],
  },
  // 跟进方式（1-打电话、2-见面拜访、3-发邮件、4-发短信、5-其他；）
  followTypeList: {
    1: '打电话',
    2: '见面拜访',
    3: '发邮件',
    4: '发短信',
    5: '其他'
  }
};

// model manage
export const followupClue = (state = defaultState, action = {}) => {
  switch (action.type) {
    case model.SETVALUES:
      return { ...state, ...action.values };
    default:
      return defaultState;
  }
}
