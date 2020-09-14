import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Button, Col, Spinner } from "react-bootstrap";

import "./table.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { OrderItem } from "../OrderItem";
import { OrderDishInput } from '../OrderDishInput'
import { ModalWindow } from "../ModalWindow";
import { loadOrders } from "../../store/actions/order";
import { toggleModal } from "../../store/actions/state";
import { loadMenu } from "../../store/actions/menu";

const Table = (props) => {
  const dispatch = useDispatch();
  const orderList = useSelector((state) => state.order.orderList);
  const menu = useSelector((state) => state.menu.menuList);
  const handleClose = () => {
    dispatch(toggleModal())
  };
  const showModal = useSelector(state => state.states.showModal)
  const options = menu.map((el) => <option key={el.menuId}>{el.name}</option>);
  const editingOrder = props.editingObj;
  let editingOrderForms = null;

  useEffect(() => {
    dispatch(loadOrders());
    dispatch(loadMenu());
  }, [dispatch]);

  const getEditingOrderForms = () => {
    if (editingOrder !== null) {
      editingOrderForms = editingOrder["orderArray"].map((el) => (
        <Form.Group controlId="exampleForm.ControlSelect" key={el.id}>
          <Form.Row>
            <Col>
              <Form.Label>Select dish:</Form.Label>
              <Form.Control
                as="select"
                name="name"
                onChange={(e) => props.onChangeEdit(e, el.id)}
                className="name"
                defaultValue={el.name}
              >
                {options}
              </Form.Control>
            </Col>
            <Col style={{ marginRight: "20px" }}>
              <Form.Label>Count</Form.Label>
              <Form.Control
                style={{ maxWidth: "100px" }}
                type="number"
                name="count"
                onChange={(e) => props.onChangeEdit(e, el.id)}
                className="count"
                defaultValue={el.count}
              />
            </Col>
            <Col>
              <Form.Label>Price</Form.Label>
              <Form.Label style={{ marginTop: "7px", display: "block" }}>
                {menu.find((item) => el.name === item.name) !== undefined
                  ? (
                      menu.find((item) => el.name === item.name).price *
                      el.count
                    ).toFixed(2)
                  : (0).toFixed(2)}
                $
              </Form.Label>
            </Col>
            <Col>
              <Button
                variant="warning"
                onClick={() => {
                  props.deleteForm(el.id, true);
                }}
              >
                X
              </Button>
            </Col>
          </Form.Row>
        </Form.Group>
      ));
    }
  };
  getEditingOrderForms();

  // список "форм"
  var listInputs = props.forms.map((el) => (
    <OrderDishInput key={el.id} element={el} deleteForm={props.deleteForm} options={options}/>    
  ));

  const list = orderList.map((item) => {
    let price = item["orderArray"]
      .map(
        (el) =>
          menu.find((item) => el.name === item.name) !== undefined &&
          menu.find((item) => el.name === item.name).price * el.count
      )
      .reduce((prev, current) => {
        return prev + current;
      }, 0);

    return (
      <OrderItem
        key={item.orderId}
        item={item}
        onDelete={props.onDelete}
        onEdit={props.onEdit}
        totalPrice={price}
      />
    );
  });

  return (
    <div>
      {list.length > 0 ? (
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
      ) : (
        <>
          <Spinner animation="border" />
        </>
      )}
      <div className="add_order">
        <Button
          variant="primary"
          className="add_order__button"
          onClick={handleClose}
        >
          Add order
        </Button>
      </div>

      {props.isEditing ? (
        <ModalWindow
        showModal={showModal}
          onHide={props.cancelEdit}
          title="Editing order"
        >
          <Form>
            <Form.Group controlId="formBasicText">
              <Form.Label>Surname</Form.Label>
              <Form.Control
                type="text"
                name="orderer"
                className="orderer"
                onChange={(e) => props.onChangeEdit(e)}
                defaultValue={editingOrder["orderer"]}
              />
            </Form.Group>

            {editingOrderForms}
            {editingOrder["orderArray"].map((el) => `${el.id}`)}

            <Form.Row>
              <Col>
                <Button
                  variant="primary"
                  type="submit"
                  onClick={props.applyEdit}
                >
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
        </ModalWindow>
      ) : (
        <ModalWindow
          showModal={showModal}
          onHide={handleClose}
          title="Adding new order"
        >
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              return props.onAdd(
                document.querySelectorAll(".name").length,
                document.querySelectorAll(".name"),
                document.querySelectorAll(".count"),
                document.querySelector(".orderer")
              );
            }}
          >
            <Form.Group controlId="formBasicText">
              <Form.Label>Surname</Form.Label>
              <Form.Control
                type="text"
                name="orderer"
                className="orderer"
                placeholder="Enter surname"
              />
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
        </ModalWindow>
      )}
    </div>
  );
};

export default Table;
