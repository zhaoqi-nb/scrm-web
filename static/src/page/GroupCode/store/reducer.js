'use strict';

import * as model from './action-type';

const defaultState = {
  editData: {},
  globalData: {},
  type: '1',
  codeData: {},
  edit: {}
};

// model manage
export const groupCode = (state = defaultState, action = {}) => {
  switch (action.type) {
    case model.SETVALUES:
      return { ...state, editData: action.value.editData, globalData: action.value.globalData };
    case model.SETTYPE:
      return { ...state, type: action?.value?.type || '' }
    case model.SETCODEDATA:
      return { ...state, codeData: action?.value?.codeData }
    case model.SETEDIT:
      return { ...state, edit: action?.value?.edit, type: action?.value?.type || '1' }
    default:
      return state;
  }
}
