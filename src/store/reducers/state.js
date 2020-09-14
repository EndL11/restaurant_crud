import {
  SET_EDITING_OBJECT,
  RESET_EDITING_OBJECT,
  TOGGLE_MODAL,
  TOGGLE_EDITING,
} from "../types";

const initialState = {
  editingObject: {},
  editingObjectIndex: null,
  isEditing: false,
  showModal: false,
};

export const stateReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_EDITING_OBJECT: {
      return {
        ...state,
        editingObject: action.payload,
        editingObjectIndex: action.editingIndex,
      };
    }
    case RESET_EDITING_OBJECT: {
      return { ...state, editingObject: {}, editingObjectIndex: null };
    }
    case TOGGLE_MODAL: {
      return { ...state, showModal: !state.showModal };
    }
    case TOGGLE_EDITING: {
      return { ...state, isEditing: !state.isEditing };
    }
    default:
      return state;
  }
};
