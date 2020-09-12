import axios from 'axios';

import { LOAD_MENU } from "../types";


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