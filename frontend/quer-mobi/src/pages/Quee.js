import React, {Component} from 'react'
import axios from "axios";
import { Grid, Button, Icon } from "semantic-ui-react";
import firebase from "firebase"
import { MessageBox } from 'react-chat-elements'
import Highcharts from "react-highcharts";
import moment from "moment"
import { Link } from 'react-static'

import 'react-chat-elements/dist/main.css';

import { APIhost, TimeHistChartConfig, GreenButton, RedButton } from "../const";
import QueueVisualize from "../containers/QueuePositionVisualize";
import Loading from "../containers/Loading";
import CheckOutConfirmation from "../containers/CheckOutConfirmation";
import ChatPopup from "../containers/Chat";

firebase.initializeApp({
  databaseURL:"https://quer-mobi.firebaseio.com/"
})

//
class QueePage extends Component {
  state = {
    status:"init",
    msg:"",
    qInfo:{
      name:"",
      order:[],
      timeHist:[],
    },
    qChat:{
      new:0,
      messages:[],
      msgID:[]
    },
    currentOrder:0,
    qChatPopup:false,
    authToken:""
  }
  reportError = (error)  => {
    console.log("Error occured : ", error)
    alert(`Error occured : ${error}`)
    this.props.history.push("/")
    this.setState({status:"fail", msg:error})
  }
  checkInQueue = (querID) => {
    const cachedQueeID = localStorage.getItem(`${querID}.queeID`)
    if(cachedQueeID != null){
      this.subscribeQueInfo(querID, cachedQueeID)
      this.setState({queeID:cachedQueeID})
    }
    axios.get(`${APIhost}/CheckInQueue`,{params:{querID}, withCredentials:true}).then(
      (response)=>{
        if(response.data.success){
          this.subscribeQueInfo(querID, response.data.queeID)
          this.setState({queeID:response.data.queeID})
          localStorage.setItem(`${querID}.queeID`, response.data.queeID)
        }else{
          this.reportError(response.data.msg)
        }
      }
    ).catch(this.reportError)
  }
  checkOutQueue = (querID) => {
    axios.get(`${APIhost}/CheckOutQueue`,{params:{querID}, withCredentials:true}).then(
      (response)=>{
        if(!response.data.success){
          this.reportError(response.data.msg)
        }
        localStorage.removeItem(`${querID}.queeID`)
        this.props.history.push("/")
      }
    ).catch(this.reportError)
  }
  subscribeQueInfo = (querID, queeID) => {
    const db = firebase.database()
    db.ref(`${querID}/name`).once('value', (snapshot)=>{
      this.setState({qInfo:{...this.state.qInfo, name:snapshot.val()}})
    })
    db.ref(`${querID}/chat/${queeID}`).once('value', (snapshot)=>{
      const oldMsg = snapshot.val()
      let newMsgCount = 0
      const messages = []
      const msgID = []
      Object.keys(oldMsg).forEach(key => {
        newMsgCount += (oldMsg[key].sender==="quee")?0:1
        messages.push({
          position:(oldMsg[key].sender==="quee")?'right':'left',
          type: 'text',
          text:<p style={{color:"black"}}>{oldMsg[key].message}</p>,
          title:oldMsg[key].sender,
          date:new Date(oldMsg[key].timestamp)
        })
        msgID.push(key)
      })
      this.setState({
        qChat:{
          new: newMsgCount,
          messages, msgID
        }
      })
    })
    db.ref(`${querID}/queue`).on('value', (snapshot)=>{
      // @todo #4:2hr ทำหน้า post-queue
      const val = snapshot.val()
      if(val == null){
        this.reportError("Room not found.")
        return
      }
      const timeHist = []
      const order = []
      Object.keys(val).forEach(key => {
        if(val[key].serviceTime > 0)
          timeHist.push(val[key].serviceTime)
        else
          order.push(val[key].queeID)
      })
      if (order.indexOf(queeID) === 0) {
        axios.get(`${APIhost}/GetAuthToken`,{params:{querID}, withCredentials:true}).then((response)=>
          this.setState({
            authToken:response.data.authToken
          })
        )
      }
      this.setState({
        qInfo:{
          ...this.state.qInfo,
          order,
          timeHist,
        },
        status:"success",
        currentOrder:order.indexOf(queeID)+1
      })
    })
    db.ref(`${querID}/chat/${queeID}`).on('child_added', (snapshot)=>{
      if(this.state.qChat.msgID.includes(snapshot.key))
        return
      const newMsg = snapshot.val()
      const newMessage = {
        position:(newMsg.sender==="quee")?'right':'left',
          type: 'text',
          text:<p style={{color:"black"}}>{newMsg.message}</p>,
          title:newMsg.sender,
          date:new Date(newMsg.timestamp)
      }
      const newMsgCount = (newMsg.sender==="quee")?this.state.qChat.new:this.state.qChat.new + 1
      this.setState({
        qChat:{
          new: newMsgCount,
          messages: this.state.qChat.messages.concat(newMessage),
          msgID:this.state.qChat.msgID.concat(snapshot.key)
        }
      })
    })
  }
  addChatMessage = async (message, callback, failedCallback) => {
      try {
        this.setState({
          status:"init"
        })
        const querID = this.props.match.params.id
        const response =  await axios.post(
          `${APIhost}/AddMessage`,
          {
            querID,
            message
          },
          {withCredentials:true})
        if(!response.data.success)
          throw response.data.msg
        this.setState({
          status:"success"
        })
        callback()
      } catch (error) {
        this.setState({
          status:"success"
        })
        failedCallback(error)
      }
  }
  componentWillMount = () => {
    const querID = this.props.match.params.id
    this.checkInQueue(querID)
  }
  componentWillReceiveProps(newProps){
    if(this.props.match.params.id !== newProps.match.params.id){
      this.checkInQueue(newProps.match.params.id)
    }
  }
  render = () => {
    const querID = this.props.match.params.id
    return(<div>
      <Loading open={this.state.status === "init"}/>
      <CheckOutConfirmation
        open={this.state.status === "checkOutPending"}
        onConfirm={()=>this.checkOutQueue(querID)}
        onCancel={()=>this.setState({status:"success"})}
      />
      <ChatPopup
        open={this.state.qChatPopup}
        msgList={this.state.qChat.messages}
        onClose={()=>this.setState({
          qChatPopup:false,
          qChat:{
            ...this.state.qChat,
            new:0
          },
        })}
        onSend={this.addChatMessage}/>
      <Grid centered>
        <Grid.Row>
          <Grid.Column computer={12} mobile={12}>
            <Grid.Row style={{marginTop:30}}>
              <h1>Queue #{querID}</h1>
            </Grid.Row>
            <Grid centered style={{marginTop:20}}>
              <Grid.Row only='tablet mobile'>
                <Grid.Column>
                  <p style={{textAlign:"right"}}>{this.state.qInfo.name}</p>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row only='computer'>
                <Grid.Column width={15}>
                  <p style={{textAlign:"left"}}>{this.state.qInfo.name}</p>
                </Grid.Column>
              </Grid.Row>
            </Grid>
            <Grid centered style={{marginTop:20}}>
              <Grid.Row>
                <Grid.Column computer={12} mobile={16}>
                  <Grid centered style={{marginTop:20}}>
                    <Grid.Row>
                      <Grid.Column width={3}>
                        <QueueVisualize percentagePosition={(this.state.currentOrder)/this.state.qInfo.order.length}/>
                      </Grid.Column>
                      <Grid.Column width={13}>
                        <Grid.Row>
                          <MessageBox titleColor="black" text={<div style={{width:"50vw", maxHeight:"50vh"}}>
                            <h1>
                              You are #{this.state.currentOrder}
                            </h1>
                            {
                              this.state.currentOrder === 1?
                              <div>
                                <h4 style={{textAlign:"center"}}>Please show this token to quer</h4>
                                <h1 style={{textAlign:"center"}}>{this.state.authToken}</h1>
                              </div>:
                              <div>
                                <strong>estimated time: {moment
                                  .utc(this.state.qInfo.timeHist.reduce(
                                    (acc, val, index)=>
                                      (acc*index+val)/(index+1)
                                    ,0)*(this.state.currentOrder - 1)*60000).format('HH:mm')} hours</strong>
                                <Highcharts config={TimeHistChartConfig(this.state.qInfo.timeHist)}/>
                              </div>
                            }
                            </div>} dateString=" "/>
                        </Grid.Row>
                        <Grid centered stretched>
                          <Grid.Row>
                            <Grid.Column computer={6} mobile={10} style={{marginTop:10}}>
                              <GreenButton onClick={()=>this.setState({qChatPopup:true,qChat:{...this.state.qChat, new:0}})} animated>
                                <Button.Content visible>Queue chat {this.state.qChat.new > 0?`(${this.state.qChat.new})`:""}</Button.Content>
                                <Button.Content hidden>
                                  <Grid verticalAlign='middle'>
                                    <Grid.Row>
                                      <Grid.Column>
                                        <Icon name='chat' />
                                      </Grid.Column>
                                    </Grid.Row>
                                  </Grid>
                                </Button.Content>
                              </GreenButton>
                            </Grid.Column>
                            <Grid.Column computer={6} mobile={10} style={{marginTop:10}}>
                              <RedButton onClick={()=>this.setState({status:"checkOutPending"})} animated="vertical">
                                <Button.Content visible>Left queue</Button.Content>
                                <Button.Content hidden>
                                  <Grid verticalAlign='middle'>
                                    <Grid.Row>
                                      <Grid.Column>
                                        <Icon name='close' />
                                      </Grid.Column>
                                    </Grid.Row>
                                  </Grid>
                                </Button.Content>
                              </RedButton>
                            </Grid.Column>
                          </Grid.Row>
                        </Grid>
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>)
  }
}
export default QueePage