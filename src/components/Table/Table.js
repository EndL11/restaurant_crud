import React from 'react';
import {Form, Modal, Button, Col} from 'react-bootstrap';

import './table.css';
import 'bootstrap/dist/css/bootstrap.min.css';


const Table = (props) => {
    const menu = props.menu;
    const handleClose = props.closeModal;
    const options = Object.keys(menu).map((el, index) => <option key={index}>{el}</option>);
    const editingOrder = props.editingObj;
    
    var editingOrderForms = null;
    if(editingOrder !== null){
      editingOrderForms = editingOrder["orderArray"].map((el) => 
      <Form.Group controlId="exampleForm.ControlSelect" key={el.id}>
      <Form.Row>
        <Col>
          <Form.Label>Select dish:</Form.Label>
          <Form.Control  as="select" name="name" onChange={(e) => props.onChangeEdit(e, el.id)} className="name" defaultValue={el.name}>
            {options}
          </Form.Control>
        </Col>
        <Col style= {{marginRight:"20px"}}>
          <Form.Label>Count</Form.Label>
          <Form.Control style={{maxWidth:"100px"}} type="number" name="count" onChange={(e) => props.onChangeEdit(e, el.id)} className="count" defaultValue={el.count}/>
        </Col>
        <Col>
          <Form.Label>Price</Form.Label>
          <Form.Label style={{marginTop: "7px", display:"block"}}>{(menu[el.name] * el.count).toFixed(2)}$</Form.Label>
        </Col>
        <Col>
          <Button variant="warning" onClick={() => {props.deleteForm(el.id, true)}}>
            X
          </Button>
        </Col>
      </Form.Row>
      </Form.Group>
    );
    }
    
    // список "форм"
    var listInputs = props.forms.map((el) => 
      <Form.Group controlId={"exampleForm.ControlSelect" + el.id} key={el.id}>
      <Form.Row>
        <Col>
          <Form.Label>Select dish:</Form.Label>
          <Form.Control  as="select" name="name" className="name">
            {options}
          </Form.Control>
        </Col>
        <Col>
          <Form.Label>Count</Form.Label>
          <Form.Control style={{width: "100px"}} type="number" name="count" className="count"/>
        </Col>
        <Col>
          <Button variant="warning" onClick={() => {props.deleteForm(el.id)}}>
            X
          </Button>
        </Col>
      </Form.Row>
      </Form.Group>
    );

    // редагування списку замовлень
    const list = props.items.map((item) =>(
      <tr key = {item.id}>
        <td>{item.id}</td>
        <td>{item.orderer}</td>
        <td>
          {item["orderArray"].map((el, id) => 
            <span style={{border: "none"}} key={id}>{el.name} - {el.count} <br/> </span>
        )}
        </td>
        <td>
        {(item["orderArray"].map(el => menu[el.name] * el.count)
        .reduce((prev, current) => {return prev + current}, 0)).toFixed(2)}$</td>
        <td>
        <Button variant="outline-primary"
        onClick={props.onEdit} value ={item.id} className="td__button">Edit</Button>
        <Button variant="outline-danger"
        onClick={props.onDelete} value ={item.id} className="td__button">Delete</Button>
        </td>
      </tr>
    ));

    return (
      <div>
      { props.items.length > 0 ? (
        <table className="orders-table" border="1">
        <tbody>
          <tr>
            <th>Id</th>
            <th>Orderer surname</th>
            <th>Order</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
             {list}
          </tbody>
        </table>
        ) : (<p>Add something...</p>)}
        <div className="add_order">
          <Button variant="primary"
          className="add_order__button" onClick={handleClose}>Add order</Button>
        </div>

        {props.isEditing  ? (
        <Modal show={props.show_modal} onHide={props.cancelEdit}>
        <Modal.Header closeButton>
          <Modal.Title>Editing order</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form>
          <Form.Group controlId="formBasicText">
            <Form.Label>Surname</Form.Label>
            <Form.Control  type="text" name="orderer" className="orderer"
             onChange={(e) => props.onChangeEdit(e)} defaultValue={editingOrder["orderer"]}/>
          </Form.Group>

          {editingOrderForms}

          <Form.Row>
            <Col>
              <Button variant="primary" type="submit" onClick={props.applyEdit}>
                Submit
              </Button>
            </Col>
            <Col>
              <Button variant="success" onClick={props.addFormEdit}>
                  +
              </Button>
            </Col>
          </Form.Row>
        </Form>
        </Modal.Body> 
        </Modal>
        ) : (
          <Modal show={props.show_modal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Adding new order</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form onSubmit={(e)=> {e.preventDefault();
                return props.onAdd(document.querySelectorAll(".name").length,
                document.querySelectorAll(".name"), document.querySelectorAll(".count"),
                document.querySelector(".orderer"));
              }}>
          <Form.Group controlId="formBasicText">
            <Form.Label>Surname</Form.Label>
            <Form.Control type="text" name="orderer" className="orderer" placeholder="Enter surname" />
          </Form.Group>

          {listInputs}
          <Form.Row>

            <Col>
              <Button variant="primary" type="submit">
              Submit
              </Button>
            </Col>
            <Col>
              <Button variant="success" onClick={props.addForm}>
                  +
              </Button>
            </Col>
          </Form.Row>
        </Form>
        </Modal.Body> 
      </Modal>
        )}
        
      </div>
    );
  }

export default Table;