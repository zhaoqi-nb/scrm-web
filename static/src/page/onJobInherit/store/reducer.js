import * as model from './action-type';

const defaultState = {
    date_type: 'week',
    stat_date: '123',
    brand_id: '234',
    shop_id: '345',
};

// model manage
export const onJobInherit = (state = defaultState, action = {}) => {
    switch (action.type) {
        case model.SETVALUES:
            return { ...state, ...action.values };
        default:
            return state;
    }
}
