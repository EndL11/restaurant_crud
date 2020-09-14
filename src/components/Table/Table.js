import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Button, Col, Spinner } from "react-bootstrap";

import "./table.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { OrderItem } from "../OrderItem";
import { OrderDishInput } from "../OrderDishInput";
import { ModalWindow } from "../ModalWindow";
import { OrderFormButtons } from "../OrderFormButtons";
import { addOrder, deleteOrder, loadOrders } from "../../store/actions/order";
import { toggleModal } from "../../store/actions/state";
import { loadMenu } from "../../store/actions/menu";

const Table = (props) => {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.order.loading);
  const orderList = useSelector((state) => state.order.orderList);
  const menu = useSelector((state) => state.menu.menuList);
  const options = menu.map((el) => <option key={el.menuId}>{el.name}</option>);
  const handleClose = () => {
    dispatch(toggleModal());
  };
  const showModal = useSelector((state) => state.states.showModal);
  const isEditing = useSelector((state) => state.states.isEditing);
  const editingOrder = props.editingObj;
  let editingOrderForms = null;

  useEffect(() => {
    dispatch(loadOrders());
    dispatch(loadMenu());
  }, [dispatch]);

  const getValuesOfNodeList = (arr) => {
    if (arr.value !== null && arr.value.trim() !== "") {
      return arr.value;
    }
    return Array.from(arr).map((el) => el.value);
  };

  const wrongDataError = () => {
    alert("Wrong data! try again!");
  };

  const getPriceFromMenu = (name) => {
    return (
      menu.find((item) => name === item.name) !== undefined &&
      menu.find((item) => name === item.name).price
    );
  };

  const onAddOrder = (e) => {
    e.preventDefault();
    let arrayDataFlag = false;
    const orderer = e.target.orderer.value.trim();
    if (orderer.trim() === "") {
      wrongDataError();
      return;
    }

    const dishes = getValuesOfNodeList(e.target.elements.name);
    const dishesCount = getValuesOfNodeList(e.target.elements.count);
    if (dishes == null || dishesCount == null) {
      wrongDataError();
      return;
    }

    if (Array.isArray(dishes)) {
      arrayDataFlag = true;
      dishes.forEach((el) => {
        if (el == null || el?.trim() === "") {
          wrongDataError();
          return;
        }
      });
      dishesCount.forEach((el) => {
        if (el == null || el?.trim() === "") {
          wrongDataError();
          return;
        }
      });
    } else if (
      dishes == null ||
      dishes?.trim() === "" ||
      dishesCount == null ||
      dishesCount?.trim() === ""
    ) {
      wrongDataError();
      return;
    }
    //  finding existing order the same to entered orderer
    let theSameOrderer = null;
    if (orderList !== null) {
      theSameOrderer = orderList.filter(
        (element) => element["orderer"] === orderer
      ).length;
    }
    if (orderer.split(" ").join("") === "" || theSameOrderer > 0) {
      alert("Wrong data!");
      return;
    }
    let price = 0;
    let orderMenuList = [];
    // creating list of ordered dishes
    if (arrayDataFlag) {
      for (let i = 0; i < dishes.length; i++) {
        if (
          dishes[i].split(" ").join("") !== "" ||
          Number(dishesCount[i]) > 0
        ) {
          orderMenuList.push({
            id: props.idGenerator(),
            name: dishes[i],
            count: Number(dishesCount[i]),
          });
          price = getPriceFromMenu(dishes[i]) * +dishesCount[i];
        } else {
          alert("Wrong data!");
          return;
        }
      }
    } else {
      orderMenuList.push({
        id: props.idGenerator(),
        name: dishes,
        count: Number(dishesCount),
      });
      price = getPriceFromMenu(dishes) * +dishesCount;
    }

    let newOrder = {
      orderId: props.idGenerator(),
      orderer: orderer,
      orderArray: orderMenuList,
      totalPrice: price,
    };
    dispatch(addOrder(newOrder));
    handleClose();
  };

  const onDelete = (id) => {
    dispatch(deleteOrder(id));
  }

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

  var listInputs = props.forms.map((el) => (
    <OrderDishInput
      key={el.id}
      element={el}
      deleteForm={props.deleteForm}
      options={options}
    />
  ));

  const list = orderList.map((item) => {
    return (
      <OrderItem
        key={item.orderId}
        item={item}
        onDelete={onDelete}
        onEdit={props.onEdit}
      />
    );
  });

  let modalContent, modalHideAction, modalTitle;

  if (isEditing) {
    modalContent = (
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
        <OrderFormButtons
          onSubmit={props.applyEdit}
          onAdd={props.addFormEdit}
        />
      </Form>
    );
    modalHideAction = props.cancelEdit;
    modalTitle = "Editing order";
  } else {
    modalContent = (
      <Form onSubmit={onAddOrder}>
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
        <OrderFormButtons
          onSubmit={() => console.log("Submitted")}
          onAdd={props.addForm}
        />
      </Form>
    );
    modalHideAction = handleClose;
    modalTitle = "Adding new order";
  }

  const renderContent =
    list.length > 0 ? (
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
      <>{loading ? <Spinner animation="border" /> : <p>Add something...</p>}</>
    );

  return (
    <div>
      {renderContent}
      <div className="add_order">
        <Button
          variant="primary"
          className="add_order__button"
          onClick={handleClose}
        >
          Add order
        </Button>
      </div>

      <ModalWindow
        showModal={showModal}
        onHide={modalHideAction}
        title={modalTitle}
      >
        {modalContent}
      </ModalWindow>
    </div>
  );
};

export default Table;
