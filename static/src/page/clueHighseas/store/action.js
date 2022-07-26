'use strict';

import * as action from './action-type';

export const setValues = (values) => ({
    type: action.SETVALUES,
    values
})
