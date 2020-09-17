import { ADD_DISH, DELETE_DISH, LOAD_MENU, UPDATE_MENU } from "../types";

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
    case UPDATE_MENU: {
      const newMenu = state.menuList.map(item => {
        if(item.menuId === action.payload.menuId){
          item = action.payload;
        }
        return item;
      });
      return {...state, menuList: newMenu}
    }
    default:
      return state;
  }
};
