import React from "react";
import { Button } from "react-bootstrap";

export const MenuItem = ({ item, onEditDish, onDeleteDish }) => {
  const onDelete = () => {
    if (window.confirm("Are you sure want to delete this dish?")) {
      onDeleteDish(item.id);
    }
  };
  return (
    <tr>
      <td>{item.name}</td>
      <td>{item.price.toFixed(2)}$</td>
      <td>
        <Button
          variant="outline-primary"
          onClick={onEditDish}
          value={item.menuId}
          className="td__button"
        >
          Edit
        </Button>
        <Button
          variant="outline-danger"
          onClick={onDelete}
          className="td__button"
        >
          Delete
        </Button>
      </td>
    </tr>
  );
};
