import React, {Component} from 'react'
import { Grid, Header, Input, Button, Icon, Modal, Loader } from 'semantic-ui-react'
//
import background from '../media/background.jpg'

import {GreenButton, PurpleButton} from '../const'

class IndexPage extends Component {
  state = {
    InputQuerID:"",
    isLoading: false,
  }
  onGetInLine = (querID) => {
    this.props.history.push(`/quee/${querID}`)
  }
  render = () => (
    <div>
      <Modal basic size='small' open={this.state.isLoading}>
        <Modal.Content>
          <Loader active inline='centered' />
        </Modal.Content>
      </Modal>
      <Grid
        centered
        verticalAlign='middle'
        style={{height:"106vh", backgroundImage: `url(${background})`, backgroundRepeat: "no-repeat", backgroundPosition: "center", backgroundSize: "cover"}}
      >
        <Grid.Row>
          <Grid.Column>
          <Grid
            centered
            verticalAlign='middle'
            style={{height:"10vh"}}
          >
            <Grid.Row style={{backgroundColor:"#8bc34a"}}>
              <Grid.Column floated="right" computer={4} mobile={12}>
                <Grid verticalAlign='middle' columns={2}>
                  <Grid.Column>
                    <Header as="h3">Are you Quer?</Header>
                  </Grid.Column>
                  <Grid.Column>
                    <PurpleButton animated="vertical" >
                      <Button.Content visible>Setup Queue!</Button.Content>
                      <Button.Content hidden>
                        <Grid verticalAlign='middle'>
                          <Grid.Row>
                            <Grid.Column>
                              <Icon name='group' />
                            </Grid.Column>
                          </Grid.Row>
                        </Grid>
                      </Button.Content>
                    </PurpleButton>
                  </Grid.Column>
                </Grid>
              </Grid.Column>
            </Grid.Row>
          </Grid>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Grid style={{height:"70vh"}} verticalAlign='middle' centered>
              <Grid.Row>
                <Grid.Column width={10}>
                  <Header as='h1' textAlign='center'>Easy Online Queuing Platform</Header>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column width={10}>
                  <p style={{textAlign:'center', color:"white", backgroundColor: "rgba(150, 150, 150, 0.7)", borderRadius:20}}> Online queue platform for reduce wasting on time, space, fatigue when you on queue line</p>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row style={{backgroundColor: "rgba(150, 150, 150, 0.7)", borderRadius:20, margin:20}}>
                <Grid.Column mobile={12} computer={7}>
                  <Grid.Row>
                    <Header as='strong' textAlign='left'>Enter Quer ID:</Header>
                  </Grid.Row>
                  <Grid columns={2} centered>
                    <Grid.Column mobile={12} computer={8}>
                      <Input style={{width:"100%"}} placeholder="Quer ID" onChange={(e)=>this.setState({InputQuerID:e.target.value.toLocaleUpperCase()})}>
                        <input value={this.state.InputQuerID} style={{backgroundColor:"#9c27b0b3", color:"#ffffff", textAlign:"center"}} />
                      </Input>
                    </Grid.Column>
                  </Grid>
                  <Grid>
                    <Grid.Column floated="right" computer={4} mobile={9}>
                      <GreenButton onClick={()=>this.onGetInLine(this.state.InputQuerID)} animated>
                        <Button.Content visible>Get in line!</Button.Content>
                        <Button.Content hidden>
                          <Grid verticalAlign='middle'>
                            <Grid.Row>
                              <Grid.Column>
                                <Icon name='arrow right' />
                              </Grid.Column>
                            </Grid.Row>
                          </Grid>
                        </Button.Content>
                      </GreenButton>
                    </Grid.Column>
                  </Grid>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  )
}
export default IndexPage