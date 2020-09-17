import React from "react";
import { Form, Button, Col } from "react-bootstrap";

export const OrderEditDishInput = ({ item, onChangeEdit, onDelete, price, options }) => {
  return (
    <Form.Group controlId="exampleForm.ControlSelect" >
      <Form.Row>
        <Col>
          <Form.Label>Select dish:</Form.Label>
          <Form.Control
            as="select"
            name="name"
            onChange={(e) => onChangeEdit(e, item.id)}
            className="name"
            defaultValue={item.name}
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
            onChange={(e) => onChangeEdit(e, item.id)}
            className="count"
            defaultValue={item.count}
          />
        </Col>
        <Col>
          <Form.Label>Price</Form.Label>
          <Form.Label style={{ marginTop: "7px", display: "block" }}>
            {price}$
          </Form.Label>
        </Col>
        <Col>
          <Button
            variant="warning"
            onClick={() => {
              onDelete(item.id);
            }}
          >
            X
          </Button>
        </Col>
      </Form.Row>
    </Form.Group>
  );
};
