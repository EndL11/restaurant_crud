import { LOAD_MENU } from "../types";

const initialState = {
    menu: [],
    editingObject: {},
    editingObjectIndex: null,
    showModal: false
}

export const menuReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_MENU: {
            return { ...state, menu: action.payload }
        }
        default:
            return state;
    }
}