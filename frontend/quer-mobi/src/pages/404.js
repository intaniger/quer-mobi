import React from 'react'
import {  Route, Switch } from 'react-static'
import Quee from './Quee'
//

export default () => (<Switch>
    <Route path="/quee/:id" component={Quee} />
  </Switch>)
