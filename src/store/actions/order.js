import axios from "axios";

import { ADD_ORDER, DELETE_ORDER, LOAD_ORDERS, UPDATE_ORDER } from "../types";

export const addOrder = (order) => {
  return async (dispatch) => {
    await axios.post("http://localhost:3001/orderList", order).finally(() => {
      dispatch({
        type: ADD_ORDER,
        payload: order,
      });
    });
  };
};

export const loadOrders = () => {
  return async (dispatch) => {
    await axios.get("http://localhost:3001/orderList").then(({ data }) => {
      dispatch({
        type: LOAD_ORDERS,
        payload: data,
      });
    });
  };
};

export const deleteOrder = (id) => {
  return async (dispatch) => {
    await axios.delete("http://localhost:3001/orderList/" + id + "/");
    dispatch({ type: DELETE_ORDER, payload: id });
  };
};

export const updateOrder = (updatedOrder) => {
  return async (dispatch) => {
    console.log(updatedOrder);
    await axios
      .put(
        "http://localhost:3001/orderList/" + updatedOrder.id + "/",
        updatedOrder
      )
      .finally(() => {
        dispatch({
          type: UPDATE_ORDER,
          payload: updatedOrder,
        });
      });
  };
};
