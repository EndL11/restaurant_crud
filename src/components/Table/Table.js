import React, { useEffect } from 'react';
import {useDispatch, useSelector} from 'react-redux'
import { Form, Modal, Button, Col } from 'react-bootstrap';

import './table.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { OrderItem } from '../OrderItem';
import { loadOrders } from '../../store/actions/order';


const Table = (props) => {

  const dispatch = useDispatch();
  const orderList = useSelector(state => state.order.orderList);
  const menu = props.menu;
  const handleClose = props.closeModal;
  const options = menu.map((el) => <option key={el.menuId}>{el.name}</option>);
  const editingOrder = props.editingObj;
  let editingOrderForms = null;

  useEffect(() => {
    dispatch(loadOrders());
  }, [])

  const getEditingOrderForms = () => {
    if (editingOrder !== null) {
      editingOrderForms = editingOrder["orderArray"].map((el) =>
        <Form.Group controlId="exampleForm.ControlSelect" key={el.id}>
          <Form.Row>
            <Col>
              <Form.Label>Select dish:</Form.Label>
              <Form.Control as="select" name="name"
                onChange={(e) => props.onChangeEdit(e, el.id)} className="name" defaultValue={el.name}>
                {options}
              </Form.Control>
            </Col>
            <Col style={{ marginRight: "20px" }}>
              <Form.Label>Count</Form.Label>
              <Form.Control style={{ maxWidth: "100px" }} type="number" name="count"
                onChange={(e) => props.onChangeEdit(e, el.id)} className="count" defaultValue={el.count} />
            </Col>
            <Col>
              <Form.Label>Price</Form.Label>
              <Form.Label style={{ marginTop: "7px", display: "block" }}>
                {menu.find(item => el.name === item.name) !== undefined
                  ? (menu.find(item => el.name === item.name).price * el.count).toFixed(2)
                  : (0).toFixed(2)}$</Form.Label>
            </Col>
            <Col>
              <Button variant="warning" onClick={() => { props.deleteForm(el.id, true) }}>
                X
            </Button>
            </Col>
          </Form.Row>
        </Form.Group>
      );
    }
  }
  getEditingOrderForms();


  // список "форм"
  var listInputs = props.forms.map((el) =>
    <Form.Group controlId={"exampleForm.ControlSelect" + el.id} key={el.id}>
      <Form.Row>
        <Col>
          <Form.Label>Select dish:</Form.Label>
          <Form.Control as="select" name="name" className="name">
            {options}
          </Form.Control>
        </Col>
        <Col>
          <Form.Label>Count</Form.Label>
          <Form.Control style={{ width: "100px" }} type="number" name="count" className="count" />
        </Col>
        <Col>
          <Button variant="warning" onClick={() => { props.deleteForm(el.id) }}>
            X
          </Button>
        </Col>
      </Form.Row>
    </Form.Group>
  );

  const list = orderList.map((item) => {
    let price = item["orderArray"].map(el => menu.find(item => el.name === item.name) !== undefined &&
      menu.find(item => el.name === item.name).price * el.count).reduce((prev, current) => { return prev + current }, 0)

    return <OrderItem item={item} onDelete={props.onDelete} onEdit={props.onEdit} totalPrice={price} />;
  });

  return (
    <div>
      {props.items.length > 0 ? (
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

      {props.isEditing ? (
        <Modal show={props.show_modal} onHide={props.cancelEdit} scrollable="true">
          <Modal.Header closeButton>
            <Modal.Title>Editing order</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formBasicText">
                <Form.Label>Surname</Form.Label>
                <Form.Control type="text" name="orderer" className="orderer"
                  onChange={(e) => props.onChangeEdit(e)} defaultValue={editingOrder["orderer"]} />
              </Form.Group>

              {editingOrderForms}
              {editingOrder["orderArray"].map((el) => `${el.id}`)}

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
          <Modal show={props.show_modal} onHide={handleClose} scrollable="true">
            <Modal.Header closeButton>
              <Modal.Title>Adding new order</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={(e) => {
                e.preventDefault();
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