import React from 'react'
import { Modal, Icon, Button, Header } from "semantic-ui-react";
import { MessageList, Input } from 'react-chat-elements'

export default ({open, msgList, onClose}) => (
  <Modal basic size='small' open={open} onClose={onClose}>
    <Header icon='chat' content='Chat with quer' />
    <Modal.Content>
      <MessageList
        lockable
        toBottomHeight="100%"
        dataSource={msgList} />
    </Modal.Content>
    <Modal.Actions>
      <Input
        placeholder="Type here..."
        multiline
        rightButtons={
          <Button basic icon>
            <Icon name="send"/>
          </Button>
        }
      />
    </Modal.Actions>
  </Modal>
)