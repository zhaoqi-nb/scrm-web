'use strict';

import * as model from './action-type';

const defaultState = {
  editData: {},
  globalData: {},
  type: ''
};

// model manage
export const materialLibrary = (state = defaultState, action = {}) => {
  switch (action.type) {
    case model.SETVALUES:
      return { ...state, editData: action.value.editData, globalData: action.value.globalData, type: action.value.type };
    case model.SETTYPE:
      return { ...state, type: action.value.type }
    default:
      return state;
  }
}
