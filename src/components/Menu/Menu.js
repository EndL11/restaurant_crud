import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Form, Button, Spinner } from "react-bootstrap";

import "bootstrap/dist/css/bootstrap.min.css";
import {
  addDish,
  deleteDish,
  loadMenu,
  updateMenu,
} from "../../store/actions/menu";

import {
  toggleModal,
  setEditingObject,
  resetEditingObject,
} from "../../store/actions/state";
import { MenuItem } from "../MenuItem";
import { ModalWindow } from "../ModalWindow";
import { updateOrder } from "../../store/actions/order";

const Menu = (props) => {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.menu.loading);
  const menu = useSelector((state) => state.menu.menuList);
  const showModal = useSelector((state) => state.states.showModal);
  const isEditing = useSelector((state) => state.states.isEditing);
  const storeEditingDish = useSelector((state) => state.states.editingObject);
  const orderList = useSelector((state) => state.order.orderList);

  const [editingDish, setEditingDish] = React.useState(storeEditingDish);

  React.useEffect(() => {
    dispatch(loadMenu());
  }, [dispatch]);

  const onChangeEditingObject = (e) => {
    if (e.target.name === "name") {
      setEditingDish({ ...editingDish, name: e.target.value.trim() });
    } else if (e.target.name === "price") {
      setEditingDish({ ...editingDish, price: Number(e.target.value) });
    }
  };

  const handleModal = () => {
    dispatch(toggleModal());
  };

  const onDeleteDish = (id) => {
    dispatch(deleteDish(id));
  };

  const onEditDish = (menuId) => {
    const editingObject = menu.find((menuItem) => menuItem.menuId === menuId);
    handleModal();
    setEditingDish(editingObject);
    dispatch(setEditingObject(editingObject));
  };

  const onHideEditing = () => {
    dispatch(resetEditingObject());
    handleModal();
  };

  const list = menu.map((item) => (
    <MenuItem
      key={item.menuId}
      item={item}
      onDeleteDish={onDeleteDish}
      onEditDish={onEditDish}
    />
  ));

  const onAddDish = (e) => {
    e.preventDefault();
    let name = e.target.name.value;
    let price = Number(e.target.price.value);

    if (
      name.split(" ").join("") === "" ||
      price <= 0 ||
      isNaN(price) === true
    ) {
      alert("Wrong data!");
      return;
    }

    // compare the same dish
    let theSameDish = null;
    if (menu !== null) {
      theSameDish = menu.filter((element) => element.name === name).length;
    }

    if (theSameDish > 0) {
      alert("Wrong data! Dish is exists!");
      return;
    }

    let newDish = { menuId: props.idGenerator(), name, price };

    dispatch(addDish(newDish));
    handleModal();
  };

  const onSubmitEditing = (e) => {
    e.preventDefault();
    const editingDishIndex = menu.findIndex(
      (item) => item.id === editingDish.id
    );
    for (let i = 0; i < menu.length; i++) {
      if (editingDish.name === menu[editingDishIndex].name) continue;

      if (menu[i].name === editingDish.name) {
        alert("Dish with this name already exists!");
        return;
      }
    }

    // updating orderlist
    let newList = orderList;
    for (let i = 0; i < newList.length; i++) {
      let priceChanged = false;
      let nameChanged = false;
      newList[i]["orderArray"].forEach((item) => {
        if (item.name === menu[editingDishIndex].name) {
          item.name = editingDish.name;
          nameChanged = true;
          if (menu[editingDishIndex].price !== editingDish.price) {
            priceChanged = true;
          }
        }
      });
      if (priceChanged) {
        newList[i].totalPrice = newList[i]["orderArray"].reduce(
          (prev, curr) => {
            console.log(prev, curr);
            let menuItem = menu.find((item) => item.name === curr.name);
            if(menuItem.id === editingDish.id){
              menuItem = editingDish;
            }
            return prev + curr.count * menuItem.price;
          },
          0
        );
      }
      if (priceChanged || nameChanged) {
        dispatch(updateOrder(newList[i]));
      }
    }
    dispatch(updateMenu(editingDish));
    dispatch(resetEditingObject());
    handleModal();
  };

  let modalContent, modalHideAction, modalTitle;

  if (isEditing) {
    modalContent = (
      <Form onSubmit={onSubmitEditing}>
        <Form.Group controlId="formBasicText">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            className="name"
            onChange={onChangeEditingObject}
            defaultValue={editingDish.name}
          />
        </Form.Group>
        <Form.Group controlId="formBasicText">
          <Form.Label>Price</Form.Label>
          <Form.Control
            type="text"
            name="price"
            className="price"
            onChange={onChangeEditingObject}
            defaultValue={editingDish.price.toFixed(2)}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    );
    modalHideAction = onHideEditing;
    modalTitle = "Editing dish";
  } else {
    modalContent = (
      <Form onSubmit={onAddDish}>
        <Form.Group controlId="formBasicText">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            className="name"
            placeholder="Enter name"
          />
        </Form.Group>
        <Form.Group controlId="formBasicText">
          <Form.Label>Price</Form.Label>
          <Form.Control
            type="text"
            name="price"
            className="price"
            placeholder="Enter price"
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    );
    modalHideAction = handleModal;
    modalTitle = "Adding new dish to menu";
  }

  const renderContent =
    menu.length > 0 ? (
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
          onClick={handleModal}
        >
          Add dish
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

export default Menu;
