import {createStore, combineReducers, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import {menuReducer} from '../store/reducers/menu'
import {orderReducer} from '../store/reducers/order'

export const rootReducer = combineReducers({
    order: orderReducer,
    menu: menuReducer,
});

export default createStore(rootReducer, applyMiddleware(thunk));