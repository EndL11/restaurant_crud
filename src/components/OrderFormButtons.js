import React from "react";
import { Form, Button, Col } from "react-bootstrap";

export const OrderFormButtons = ({onSubmit, onAdd}) => (
  <Form.Row>
    <Col>
      <Button variant="primary" type="submit" onClick={onSubmit}>
        Submit
      </Button>
    </Col>
    <Col>
      <Button variant="success" onClick={onAdd}>
        +
      </Button>
    </Col>
  </Form.Row>
);
