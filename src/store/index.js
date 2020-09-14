import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import { menuReducer } from '../store/reducers/menu'
import { orderReducer } from '../store/reducers/order'
import { stateReducer } from './reducers/state';

export const rootReducer = combineReducers({
    order: orderReducer,
    menu: menuReducer,
    states: stateReducer
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));