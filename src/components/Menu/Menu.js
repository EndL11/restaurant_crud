import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Form, Button, Spinner } from "react-bootstrap";

import "bootstrap/dist/css/bootstrap.min.css";
import { loadMenu } from "../../store/actions/menu";

import { toggleModal, toggleEditing } from "../../store/actions/state";
import { MenuItem } from "../MenuItem";
import { ModalWindow } from "../ModalWindow";

const Menu = (props) => {
  const dispatch = useDispatch();

  const menu = useSelector((state) => state.menu.menuList);
  const showModal = useSelector(state => state.states.showModal)
  const handleModal = () => {
    dispatch(toggleModal());
  };
  const isEditing = useSelector(state => state.states.isEditing)
  //const handleClose = props.closeModal;
  const editingDish = props.editingDish;

  useEffect(() => {
    dispatch(loadMenu());
  }, [dispatch]);

  const list = menu.map((item) => (
    <MenuItem
      key={item.menuId}
      item={item}
      onDeleteDish={props.onDeleteDish}
      onEditDish={props.onEditDish}
    />
  ));

  return (
    <div>
      {menu.length > 0 ? (
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
            <Spinner animation="border" />
          </>
        )}
      <div className="add_order">
        <Button
          variant="primary"
          className="add_order__button"
          onClick={handleModal}
        >
          Add dish
        </Button>
      </div>

      {isEditing ? (
        <ModalWindow
          showModal={showModal}
          onHide={props.cancelEditDish}
          title="Editing dish"
        >
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

            <Button
              variant="primary"
              type="submit"
              onClick={props.applyEditDish}
            >
              Submit
            </Button>
          </Form>
        </ModalWindow>
      ) : (
          <ModalWindow
            showModal={showModal}
            onHide={handleModal}
            title="Adding new dish to menu"
          >
            <Form onSubmit={props.addDish}>
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
          </ModalWindow>
        )}
    </div>
  );
};

export default Menu;
