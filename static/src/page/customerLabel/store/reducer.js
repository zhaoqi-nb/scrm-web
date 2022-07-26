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
  groupId: ''
};

// model manage
export const customerLabel = (state = defaultState, action = {}) => {
  switch (action.type) {
    case model.SETVALUES:
      return { ...state, ...action.values };
    default:
      return defaultState;
  }
}
