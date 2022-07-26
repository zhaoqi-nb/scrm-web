'use strict';

import * as model from './action-type';

const defaultState = {
  edit: {},
  chartTrendData: {},
  summaryData: {},
  actionList: []
};

// model manage
export const IntelligentOperation = (state = defaultState, action = {}) => {
  switch (action.type) {
    case model.SETEDIT:
      return { ...state, edit: action?.value?.edit, }
    case model.SETCHARRTRENDDATA:
      return { ...state, chartTrendData: action?.payload?.chartTrendData }
    default:
      return state;
  }
}
