import { RESET_EDITING_OBJECT, SET_EDITING_OBJECT, TOGGLE_MODAL } from "../types";

export const toggleModal = () => ({
    type: TOGGLE_MODAL
});

export const setEditingObject = (editingObject, editingObjectIndex) => ({
    type: SET_EDITING_OBJECT,
    payload: editingObject,
    editingIndex: editingObjectIndex
});

export const resetEditingObject = () => ({
    type: RESET_EDITING_OBJECT
}); 