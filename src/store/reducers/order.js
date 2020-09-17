import { ADD_ORDER, DELETE_ORDER, LOAD_ORDERS, UPDATE_ORDER } from "../types";

const initialState = {
  orderList: [],
  loading: true,
};

export const orderReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_ORDER: {
      return {
        ...state,
        orderList: [...state.orderList, action.payload],
      };
    }
    case LOAD_ORDERS: {
      return { ...state, orderList: action.payload, loading: false };
    }
    case DELETE_ORDER: {
      return {
        ...state,
        orderList: state.orderList.filter(
          (order) => order.id !== action.payload
        ),
      };
    }
    case UPDATE_ORDER: {
      const newOrderList = state.orderList.map(item => {
        if(item.orderId === action.payload.orderId){
          item = action.payload;
        }
        return item;
      });
      return {...state, orderList: newOrderList}
    }
    default:
      return state;
  }
};
