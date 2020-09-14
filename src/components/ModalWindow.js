import React from 'react'
import { Modal } from 'react-bootstrap';

export const ModalWindow = ({ title, showModal, onHide, children }) => {
  return <Modal show={showModal} onHide={onHide} scrollable="true">
    <Modal.Header closeButton>
      <Modal.Title>{title}</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      {children}
    </Modal.Body>
  </Modal>
}