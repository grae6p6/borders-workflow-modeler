import {combineReducers} from 'redux';
import {loadingBarReducer} from 'react-redux-loading-bar';

export const rootReducer = combineReducers({
    loadingBar: loadingBarReducer,
});