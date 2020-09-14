import { ADD_DISH, DELETE_DISH, LOAD_MENU } from "../types";

const initialState = {
  menuList: [],
  loading: true,
};

export const menuReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_MENU: {
      return { ...state, menuList: action.payload, loading: false };
    }
    case ADD_DISH: {
      return { ...state, menuList: [...state.menuList, action.payload] };
    }
    case DELETE_DISH: {
      return {
        ...state,
        menuList: state.menuList.filter((el) => el.id !== action.payload),
      };
    }
    default:
      return state;
  }
};
