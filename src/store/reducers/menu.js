import { ADD_DISH, LOAD_MENU } from "../types";

const initialState = {
    menuList: [],
}

export const menuReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_MENU: {
            return { ...state, menuList: action.payload }
        }
        case ADD_DISH: {
            return {...state, menuList: [...state.menuList, action.payload]}
        }
        default:
            return state;
    }
}