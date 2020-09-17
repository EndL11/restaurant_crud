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
import {
  updateOrder,
  loadOrders,
  deleteOrder,
} from "../../store/actions/order";

//  TODO: try to make reloading menu and order lists after updating and adding elements in actions/reducers

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
    dispatch(loadOrders());
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
    const newList = orderList;
    const deletingDish = menu.find((item) => item.id === id);
    //  finding deleting dish in orders
    for (let i = 0; i < newList.length; i++) {
      let hasDeletedItem = false;
      let countOfDeletedDish = 0;
      let orderDeleting = false;
      for (let j = 0; j < newList[i].orderArray.length; j++) {
        if (deletingDish.name === newList[i].orderArray[j].name) {
          hasDeletedItem = true;
          countOfDeletedDish += newList[i].orderArray[j].count;
          //  filter order's dishes list
          newList[i].orderArray = newList[i].orderArray.filter(
            (item) => item.name !== deletingDish.name
          );
          //  if after filtering dishes list empty - delete order
          if (newList[i].orderArray.length === 0) {
            dispatch(deleteOrder(newList[i].id));
            orderDeleting = true;
          }
        }
      }
      //  update order if it isn't deleted
      if (hasDeletedItem && orderDeleting === false) {
        newList[i].totalPrice -= countOfDeletedDish * deletingDish.price;
        dispatch(updateOrder(newList[i]));
      }
    }
    //  delete dish from store
    dispatch(deleteDish(id));
  };

  const onEditDish = (menuId) => {
    const editingObject = menu.find((menuItem) => menuItem.menuId === menuId);
    handleModal();
    setEditingDish(editingObject);
    dispatch(setEditingObject(editingObject));
  };

  const onHideEditing = () => {
    handleModal();
  };

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
    dispatch(loadMenu());
  };

  const onSubmitEditing = (e) => {
    e.preventDefault();
    dispatch(loadMenu());
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
            let menuItem = menu.find((item) => item.name === curr.name);
            if (menuItem.id === editingDish.id) {
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

  const list = menu.map((item) => (
    <MenuItem
      key={item.menuId}
      item={item}
      onDeleteDish={onDeleteDish}
      onEditDish={onEditDish}
    />
  ));

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
        onExited={() => dispatch(resetEditingObject())}
      >
        {modalContent}
      </ModalWindow>
    </div>
  );
};

export default Menu;
