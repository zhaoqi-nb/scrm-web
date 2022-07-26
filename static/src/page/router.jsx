'user strict'

import React from 'react'
import { Route } from 'react-router-dom'
import IndexRoute from './router/index'

export default () => {
  let list = []
  list = list.concat(IndexRoute())
  return list.map((v, k) => <Route key={k} path={v.path} exact component={v.component} />)
}
