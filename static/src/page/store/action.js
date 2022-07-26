import * as action from './action-type';

// set layout collapsed
export const setCollapsed = (data) => ({
  type: action.SETCOLLAPSED,
  data,
})

// set compreehensive Select
export const clearData = () => ({
  type: action.CLEARDATA,
})

export const setValues = (values) => ({
  type: action.SETVALUES,
  values
})
