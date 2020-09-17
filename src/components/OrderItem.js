import React from 'react'
import { Button } from 'react-bootstrap';

export const OrderItem = ({ item, onEdit, onDelete }) => {
  const onDeleteOrder = () => {
    if(window.confirm("Are you sure want to delete this order?")){
      onDelete(item.id);
    }
  }
  
  const editOrder = () => {
    onEdit(item.id);
  }

  return <tr>
    <td>{item.orderId}</td>
    <td>{item.orderer}</td>
    <td>
      {item["orderArray"].map((el) =>
        <span style={{ border: "none" }} key={el.id}>{el.name} - {el.count} <br /> </span>
      )}
    </td>
    <td>
      {(item?.totalPrice ?? 0).toFixed(2)}$</td>
    <td>
      <Button variant="outline-primary"
        onClick={editOrder} className="td__button">Edit</Button>
      <Button variant="outline-danger"
        onClick={onDeleteOrder} className="td__button">Delete</Button>
    </td>
  </tr>
}