import React from 'react';
import { HashRouter as Router, Route, Redirect } from 'react-router-dom';
import Homepage from './pages/homepage';

export default function App() {
  return (
    <Router>
      <Route exact path="/">
        <Redirect to="/home" />
      </Route>
      <Route path="/home" component={Homepage} />
      <Redirect from="*" to="/home" />
    </Router>
  );
}
