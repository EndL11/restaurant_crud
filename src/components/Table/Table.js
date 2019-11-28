import React from 'react';
import {Form, Modal, Button} from 'react-bootstrap';

import './table.css';
import 'bootstrap/dist/css/bootstrap.min.css';


const Table = (props) => {
    const menu = props.menu;
    const handleClose = props.closeModal;
    const options = Object.keys(menu).map((el, index) => <option key={index}>{el}</option>);
    const editingOrder = props.editingObj;

    const list = props.items.map((item, index) =>(
      <tr key = {item.id}>
        <td>{item.id}</td>
        <td>{item.orderer}</td>
        <td>{item.name}</td>
        <td>{item.count}</td>
        <td>{(menu[item.name] * item.count).toFixed(2)}$</td>
        <td>
        <Button variant="outline-primary"
        onClick={props.onEdit} value ={index} className="td__button">Edit</Button>
        <Button variant="outline-danger"
        onClick={props.onDelete} value ={index} className="td__button">Delete</Button>
        </td>
      </tr>
    ));

    return (
      <div>
        <table className="orders-table" border="1">
        <tr>
          <th>Id</th>
          <th>Orderer surname</th>
          <th>Name</th>
          <th>Count</th>
          <th>Price</th>
          <th>Actions</th>
        </tr>
            {list}
        </table>
        <div className="add_order">
          <Button variant="primary"
          className="add_order__button" onClick={handleClose}>Add order</Button>
        </div>

        {props.isEditing  ? (
        <Modal show={props.show_modal} onHide={props.refuseEdit}>
        <Modal.Header closeButton>
          <Modal.Title>Editing order</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form>
          <Form.Group controlId="formBasicText">
            <Form.Label>Surname</Form.Label>
            <Form.Control type="text" name="orderer" onChange={props.onChangeEdit} defaultValue={editingOrder["orderer"]}/>
          </Form.Group>
          <Form.Group controlId="exampleForm.ControlSelect1">
            <Form.Label>Select dish:</Form.Label>
            <Form.Control as="select" name="name" onChange={props.onChangeEdit} defaultValue={editingOrder["name"]}>
              {options}
            </Form.Control>
            <Form.Label>Count</Form.Label>
            <Form.Control type="number" name="count" onChange={props.onChangeEdit} defaultValue={editingOrder["count"]}/>
          </Form.Group>
          <Button variant="primary" type="submit" onClick={props.applyEdit}>
          Submit
          </Button>
        </Form>
        </Modal.Body> 
        </Modal>
        ) : (
          <Modal show={props.show_modal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Adding new order</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form onSubmit={props.onAdd}>
          <Form.Group controlId="formBasicText">
            <Form.Label>Surname</Form.Label>
            <Form.Control type="text" name="orderer" placeholder="Enter surname" />
          </Form.Group>
          <Form.Group controlId="exampleForm.ControlSelect1">
            <Form.Label>Select dish:</Form.Label>
            <Form.Control as="select" name="name" >
              {options}
            </Form.Control>
            <Form.Label>Count</Form.Label>
            <Form.Control type="number" name="count" placeholder="Enter count dishes"/>
          </Form.Group>
          <Button variant="primary" type="submit">
          Submit
          </Button>
        </Form>
        </Modal.Body> 
      </Modal>
        )}
        
      </div>
    );
  }

export default Table;