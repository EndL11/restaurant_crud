import React from "react";
import { Form, Button, Col } from "react-bootstrap";

export const OrderEditDishInput = ({
  item,
  onChangeEdit,
  price,
  onDelete,
  options,
}) => {
  return (
    <Form.Group controlId="exampleForm.ControlSelect">
      <Form.Row>
        <Col>
          <Form.Label>Select dish:</Form.Label>
          <Form.Control
            as="select"
            name="name"
            onChange={onChangeEdit}
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
            onChange={onChangeEdit}
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
          <Button variant="warning" onClick={onDelete}>
            X
          </Button>
        </Col>
      </Form.Row>
    </Form.Group>
  );
};
