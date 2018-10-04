import React from 'react'
import { Modal, Header, Button, Icon } from "semantic-ui-react";

export default ({open, onConfirm, onCancel})=>(
  <Modal basic size='small' open={open} >
    <Header icon='sign-out' content='Checkout from queue' />
      <Modal.Content>
        <p>
          Do you sure to dismiss this queue?, this action may loss your queue order
        </p>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={onCancel} basic color='red' inverted>
          <Icon name='remove' /> No
        </Button>
        <Button onClick={onConfirm} color='green' inverted>
          <Icon name='checkmark' /> Yes
        </Button>
      </Modal.Actions>
  </Modal>
)