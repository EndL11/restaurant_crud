import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { menuReducer } from '../store/reducers/menu'
import { orderReducer } from '../store/reducers/order'
import { stateReducer } from './reducers/state';

export const rootReducer = combineReducers({
    order: orderReducer,
    menu: menuReducer,
    states: stateReducer
});

export default createStore(rootReducer, applyMiddleware(thunk));