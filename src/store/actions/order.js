import axios from 'axios';

import { ADD_ORDER, LOAD_ORDERS } from "../types";

export const addOrder = (order) => ({
    type: ADD_ORDER,
    payload: order
});

export const loadOrders = () => {
    return async (dispatch) => {
        await axios.get('http://localhost:3001/orderList').then(({ data }) => {
            dispatch({
                type: LOAD_ORDERS,
                payload: data
            })
        })
    }
}