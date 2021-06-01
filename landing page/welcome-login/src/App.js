import React from 'react';
import { HashRouter as Router, Route, Redirect } from 'react-router-dom';
import Signup from './pages/signup';
import Wait from './pages/wait';
import Homepage from './pages/homepage';

export default function App() {
  return (
    <Router>
      <Route exact path="/">
        <Redirect to="/home" />
      </Route>
      <Route path="/home" component={Homepage} />
      <Route path="/wait" component={Wait} />
    </Router>
  );
}
