import React,{Component} from 'react'
import { Modal, Icon, Button, Header } from "semantic-ui-react";
import { MessageList, Input } from 'react-chat-elements'

class QueueChat extends Component {
  state = {
    text:"",
    inputRef:null,
  }
  componentDidUpdate = () => {
    const msgListScroll = document.getElementById("scrollingMessageList");
    if(msgListScroll != null)
      msgListScroll.scrollTop = msgListScroll.scrollHeight;
  }
  // componentWillReceiveProps = () => {
  //   const msgListScroll = document.getElementById("scrollingMessageList");
  //   msgListScroll.scrollTop = msgListScroll.scrollHeight;
  // }
  render = () => {
    const {open, msgList, onClose, onSend} = this.props
    return (
      <Modal basic size='small' open={open} onClose={onClose}>
        <Header icon='chat' content='Chat with quer' />
        <Modal.Content>
          <div id="scrollingMessageList" style={{height:"60vh", overflowY:"auto"}}>
            <MessageList dataSource={msgList} />
          </div>
        </Modal.Content>
        <Modal.Actions>
          <Input
            placeholder="Type here..."
            multiline
            onChange={(e)=>this.setState({text:e.target.value})}
            inputRef={(ref)=>{
              if(ref != null){
                this.state.inputRef = ref
              }
            }}
            rightButtons={
              <Button onClick={async ()=>{
                  await onSend(this.state.text, ()=>{
                    this.setState({text:""})
                    this.state.inputRef.value=""
                  },(error)=>{
                    alert(`Error occured : ${error}`)
                  })
                }} basic icon>
                <Icon name="send"/>
              </Button>
            }
          />
        </Modal.Actions>
      </Modal>
    )
  }
}
export default QueueChat