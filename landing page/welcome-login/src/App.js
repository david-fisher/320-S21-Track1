import React from 'react';
import {
  HashRouter as Router, Route, Redirect, Switch,
} from 'react-router-dom';
import Homepage from './pages/homepage';
import ErrorPage from './pages/error';

export default function App() {
  return (

    <Router>
      <Switch>
        <Route exact path="/">
          <Redirect to="/home" />
        </Route>
        <Route path="/home" component={Homepage} />
        <Route path="/error" component={ErrorPage} />
        <Redirect from="*" to="/home" />
      </Switch>
    </Router>
  );
}
