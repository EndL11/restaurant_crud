import {
  RESET_EDITING_OBJECT,
  SET_EDITING_OBJECT,
  TOGGLE_EDITING,
  TOGGLE_MODAL,
} from "../types";

export const toggleModal = () => ({
  type: TOGGLE_MODAL,
});

export const toggleEditing = () => ({
  type: TOGGLE_EDITING,
});

export const setEditingObject = (editingObject, editingObjectIndex) => ({
  type: SET_EDITING_OBJECT,
  payload: editingObject,
  editingIndex: editingObjectIndex,
});

export const resetEditingObject = () => ({
  type: RESET_EDITING_OBJECT,
});
