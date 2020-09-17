import {
  RESET_EDITING_OBJECT,
  SET_EDITING_OBJECT,
  TOGGLE_MODAL,
} from "../types";

export const toggleModal = () => ({
  type: TOGGLE_MODAL,
});

export const setEditingObject = (editingObject) => ({
  type: SET_EDITING_OBJECT,
  payload: editingObject,
});

export const resetEditingObject = () => ({
  type: RESET_EDITING_OBJECT,
});
