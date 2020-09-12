import React from 'react'

export const ModalWindow = ({title, show_modal, cancelEdit, applyForm, addItemToForm}) => {
    return <Modal show={show_modal} onHide={cancelEdit} scrollable="true">
    <Modal.Header closeButton>
      <Modal.Title>{title}</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Form>
        <Form.Group controlId="formBasicText">
          <Form.Label>Surname</Form.Label>
          <Form.Control type="text" name="orderer" className="orderer"
            onChange={(e) => props.onChangeEdit(e)} defaultValue={editingOrder["orderer"]} />
        </Form.Group>

        {editingOrderForms}

        <Form.Row>
          <Col>
            <Button variant="primary" type="submit" onClick={applyForm}>
              Submit
        </Button>
          </Col>
          <Col>
            <Button variant="success" onClick={addItemToForm}>
              +
        </Button>
          </Col>
        </Form.Row>
      </Form>
    </Modal.Body>
  </Modal>
}