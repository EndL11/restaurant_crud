import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Form, Button, Spinner } from "react-bootstrap";

import "bootstrap/dist/css/bootstrap.min.css";
import { addDish, deleteDish, loadMenu } from "../../store/actions/menu";

import { toggleModal } from "../../store/actions/state";
import { MenuItem } from "../MenuItem";
import { ModalWindow } from "../ModalWindow";

const Menu = (props) => {
  const dispatch = useDispatch();
  const loading = useSelector(state => state.menu.loading)
  const menu = useSelector((state) => state.menu.menuList);
  const showModal = useSelector((state) => state.states.showModal);
  const handleModal = () => {
    dispatch(toggleModal());
  };
  const isEditing = useSelector((state) => state.states.isEditing);

  const editingDish = props.editingDish;

  useEffect(() => {
    dispatch(loadMenu());
  }, [dispatch]);


  const onDeleteDish = (id) => {
    dispatch(deleteDish(id))
  }

  const list = menu.map((item) => (
    <MenuItem
      key={item.menuId}
      item={item}
      onDeleteDish={onDeleteDish}
      onEditDish={props.onEditDish}
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


  let modalContent, modalHideAction, modalTitle;

  if (isEditing) {
    modalContent = (
      <Form>
        <Form.Group controlId="formBasicText">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            className="name"
            onChange={props.onChangeDish}
            defaultValue={editingDish.name}
          />
        </Form.Group>
        <Form.Group controlId="formBasicText">
          <Form.Label>Price</Form.Label>
          <Form.Control
            type="text"
            name="price"
            className="price"
            onChange={props.onChangeDish}
            defaultValue={editingDish.price.toFixed(2)}
          />
        </Form.Group>

        <Button variant="primary" type="submit" onClick={props.applyEditDish}>
          Submit
        </Button>
      </Form>
    );
    modalHideAction = props.cancelEditDish;
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
      <>
        {loading ? <Spinner animation="border" /> : <p>Add something...</p>}
      </>
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
