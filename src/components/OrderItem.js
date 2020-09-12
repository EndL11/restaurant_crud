import React from 'react'
import { Button } from 'react-bootstrap';

export const OrderItem = ({ item, onEdit, onDelete, totalPrice }) => {
  return <tr key={item.orderId}>
    <td>{item.orderId}</td>
    <td>{item.orderer}</td>
    <td>
      {item["orderArray"].map((el) =>
        <span style={{ border: "none" }} key={el.id}>{el.name} - {el.count} <br /> </span>
      )}
    </td>
    <td>
      {totalPrice.toFixed(2)}$</td>
    <td>
      <Button variant="outline-primary"
        onClick={onEdit} value={item.orderId} className="td__button">Edit</Button>
      <Button variant="outline-danger"
        onClick={onDelete} value={item.orderId} className="td__button">Delete</Button>
    </td>
  </tr>
}