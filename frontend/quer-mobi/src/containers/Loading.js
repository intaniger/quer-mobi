import React from 'react'
import { Modal, Loader } from "semantic-ui-react";

export default ({open})=>(
  <Modal basic size='small' open={open}>
    <Modal.Content>
      <Loader active inline='centered' />
    </Modal.Content>
  </Modal>
)