import {ADD_ORDER, LOAD_ORDERS} from '../types'

const initialState = {
    orderList: [],
}

export const orderReducer = (state = initialState, action) => {
    switch(action.type){
        case ADD_ORDER: {
            return {...state, orderList: [...state.order.orderList, action.payload]};
        }
        case LOAD_ORDERS: {
            return {...state, orderList: action.payload}
        }
        default: 
            return state;
    }
}