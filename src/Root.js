import React from 'react'
import App from './App'

import { Router, Route } from 'react-router-dom'
import { createBrowserHistory } from 'history'

const customHistory = createBrowserHistory()

const Root = () => {
  const token = localStorage.getItem('token')

  return (
    <div>
      <Router history={customHistory}>
        <Route component={App} />
      </Router>
    </div>
  )
}

export default Root
