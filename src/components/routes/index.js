import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Document from '../../containers/documentApi'
import Home from '../../containers/home'
import Insert from '../../components/insert'
import InsertUser from '../../components/insertUser'
import OpenCamera from '../../components/openCamera'
import Login from '../../containers/login'
import ManageUser from '../../containers/manageUsers'
import ManegeFaculty from '../../containers/manegeFaculty'
import ManegeDepartment from '../../containers/manegeDepartment'
import ManegePrefix from '../../containers/manegePrefix'
import ManegeCategory from '../../containers/manegeCategory'
import InsertFaculty from '../../components/insertFaculty'
import InsertDepartment from '../../components/insertDepartment'
import InsertCategory from '../../components/insertCategory'
import InsertPrefix from '../../components/insertPrefix'
import Track from '../../components/track'

export default function Routers() {
  return (
    <Switch>
      <Route exact component={Track} path="/"></Route>
      <Route exact component={Track} path="/track"></Route>
      <Route exact component={Home} path="/home"></Route>
      <Route component={Document} path="/documentApi"></Route>
      <Route component={Insert} path="/insert"></Route>
      <Route component={InsertUser} path="/insertUser"></Route>
      <Route component={OpenCamera} path="/openCamera"></Route>
      <Route component={Login} path="/login"></Route>
      <Route component={ManageUser} path="/manageUsers"></Route>
      <Route component={ManegeFaculty} path="/manegeFaculty"></Route>
      <Route component={InsertFaculty} path="/insertFaculty"></Route>
      <Route component={ManegeDepartment} path="/manegeDepartment"></Route>
      <Route component={ManegePrefix} path="/manegePrefix"></Route>
      <Route component={ManegeCategory} path="/manegeCategory"></Route>
      <Route component={InsertDepartment} path="/insertDepartment"></Route>
      <Route component={InsertCategory} path="/insertCategory"></Route>
      <Route component={InsertPrefix} path="/insertPrefix"></Route>
      <Route component={Track} path="/track"></Route>
    </Switch>
  )
}
