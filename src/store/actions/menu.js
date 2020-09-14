import axios from 'axios';

import { ADD_DISH, DELETE_DISH, LOAD_MENU } from "../types";

export const loadMenu = () => {
    return async (dispatch) => {
        await axios.get('http://localhost:3001/menu').then(({ data }) => {
            dispatch({
                type: LOAD_MENU,
                payload: data
            });
        });
    }
}

export const addDish = (dish) => {
    return async (dispatch) => {
        await axios.post('http://localhost:3001/menu', dish).finally(() => {
            dispatch({
                type: ADD_DISH,
                payload: dish
            })
        });
    }
}

export const deleteDish = (id) => {
    return async (dispatch) => {
        await axios.delete('http://localhost:3001/menu/' + id + '/').finally(() => {
            dispatch({
                type: DELETE_DISH,
                payload: id
            })
        });
    }
}
