import React from 'react';
import {Form, Modal, Button} from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.min.css';

const Menu = (props) => {
    const menu = props.menu;
    const handleClose = props.closeModal;
    const editingDish = props.editingDish;

    const list = Object.keys(menu).map((item) =>(
      <tr key = {item}>
        <td>
          {item}
        </td>
        <td>
        {(menu[item]).toFixed(2)}$</td>
        <td>
        <Button variant="outline-primary"
        onClick={props.onEditDish} value ={item} className="td__button">Edit</Button>
        <Button variant="outline-danger"
        onClick={props.onDeleteDish} value ={item} className="td__button">Delete</Button>
        </td>
      </tr>
    ));

    return (
      <div>
      { Object.keys(menu).length > 0 ? (
        <table className="orders-table" border="1">
        <tbody>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
             {list}
          </tbody>
        </table>
        ) : (<p>Add something...</p>)}
        <div className="add_order">
          <Button variant="primary"
          className="add_order__button" onClick={handleClose}>Add dish</Button>
        </div>

        {props.isEditingDish  ? (
        <Modal show={props.show_modal} onHide={props.cancelEditDish}>
        <Modal.Header closeButton>
          <Modal.Title>Editing dish</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form>
          <Form.Group controlId="formBasicText">
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" name="name" className="name"
             onChange={props.onChangeDish} defaultValue={Object.keys(editingDish)[0]}/>
          </Form.Group>
          <Form.Group controlId="formBasicText">
            <Form.Label>Price</Form.Label>
            <Form.Control  type="text" name="price" className="price"
             onChange={props.onChangeDish} defaultValue={(editingDish[Object.keys(editingDish)[0]]).toFixed(2)}/>
          </Form.Group>

            <Button variant="primary" type="submit" onClick={props.applyEditDish}>
                Submit
            </Button>
        </Form>
        </Modal.Body> 
        </Modal>
        ) : (
          <Modal show={props.show_modal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Adding new dish to menu</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form onSubmit={props.addDish}>
          <Form.Group controlId="formBasicText">
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" name="name" className="name" placeholder="Enter name" />
          </Form.Group>
          <Form.Group controlId="formBasicText">
            <Form.Label>Price</Form.Label>
            <Form.Control type="text" name="price" className="price" placeholder="Enter price" />
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

export default Menu;