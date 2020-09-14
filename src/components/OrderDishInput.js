import React from "react";
import { Form, Button, Col } from 'react-bootstrap';

export const OrderDishInput = ({element, options, deleteForm}) => (
  <Form.Group controlId={"exampleForm.ControlSelect" + element.id}>
    <Form.Row>
      <Col>
        <Form.Label>Select dish:</Form.Label>
        <Form.Control as="select" name="name" className="name">
          {options}
        </Form.Control>
      </Col>
      <Col>
        <Form.Label>Count</Form.Label>
        <Form.Control
          style={{ width: "100px" }}
          type="number"
          name="count"
          className="count"
        />
      </Col>
      <Col>
        <Button
          variant="warning"
          onClick={() => {
            deleteForm(element.id);
          }}
        >
          X
        </Button>
      </Col>
    </Form.Row>
  </Form.Group>
);
