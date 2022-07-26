import { createStore, combineReducers, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';
import * as commonLayout from './reducer';
import * as rolePermissions from '../rolePermissions/store/reducer';
import * as mailList from '../mailList/store/reducer';
import * as highseasConfiguration from '../highseasConfiguration/store/reducer'
import * as clueHighseas from '../clueHighseas/store/reducer'
import * as followupClue from '../followupClue/store/reducer'
import * as convertedClue from '../convertedClue/store/reducer'
import * as customerLabel from '../customerLabel/store/reducer'
import * as scriptLibrary from '../scriptLibrary/store/reducer'
import * as materialLibrary from '../materialLibrary/store/reducer'
import * as customerGroupMassSend from '../customerGroupMassSend/store/reducer'
import * as regularCustomersLabel from '../regularCustomersLabel/store/reducer'
import * as newCustomersLabel from '../newCustomersLabel/store/reducer'
import * as groupCode from '../GroupCode/store/reducer'
import * as onJobInherit from '../onJobInherit/store/reducer'
import * as IntelligentOperation from '../IntelligentOperation/store/reducer'

const logger = createLogger();

const store = createStore(
  combineReducers({
    ...commonLayout,
    ...rolePermissions,
    ...mailList,
    ...highseasConfiguration,
    ...clueHighseas,
    ...followupClue,
    ...convertedClue,
    ...customerLabel,
    ...scriptLibrary,
    ...materialLibrary,
    ...customerGroupMassSend,
    ...groupCode,
    ...onJobInherit,
    ...regularCustomersLabel,
    ...groupCode,
    ...newCustomersLabel,
    ...IntelligentOperation
  }),
  applyMiddleware(thunk, logger),
);

export default store;
