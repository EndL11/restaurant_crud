import {ADD_ORDER, LOAD_ORDERS} from '../types'

const initialState = {
    orderList: [],
    editingObject: {},
    editingObjectIndex: null,
    showModal: false
}

export const orderReducer = (state = initialState, action) => {
    switch(action.type){
        case ADD_ORDER: {
            return {...state, [state.order.list]:[...state.order.list, action.payload]};
        }
        case LOAD_ORDERS: {
            return {...state, orderList: action.payload}
        }
        default: 
            return state;
    }
}