import React from 'react'
import { Grid } from "semantic-ui-react";
import {QuerTriangleIconComp, QuerTriangleIconMobile } from "../const";

export default ({percentagePosition}) => (<Grid centered>
  <Grid.Row only='computer tablet'>
    <QuerTriangleIconComp />
  </Grid.Row>
  <Grid.Row only='mobile'>
    <QuerTriangleIconMobile />
  </Grid.Row>
  <Grid.Row style={{height:"65vh"}}>
    <Grid.Column width={16} stretched>
    {
      [0,1,2,3,4,5].map((index)=>(
      <Grid.Row>
        <Grid centered>
          <Grid.Row only='computer tablet'>
            <div style={{backgroundColor:(index/6 < percentagePosition && percentagePosition <= (index+1)/6)?"#8bc34a":"#9c27b0", borderRadius:"50%", width:"20%", paddingTop:"20%"}}/>
          </Grid.Row>
          <Grid.Row only='mobile'>
            <div style={{backgroundColor:(index/6 < percentagePosition && percentagePosition <= (index+1)/6)?"#8bc34a":"#9c27b0", borderRadius:"50%", width:"50%", paddingTop:"50%"}}/>
          </Grid.Row>
        </Grid>
      </Grid.Row>
      ))
    }
    </Grid.Column>
  </Grid.Row>
</Grid>)