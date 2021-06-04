import React from 'react';
import { HashRouter as Router, Route, Redirect } from 'react-router-dom';
import Dashboard from './pages/dashboard';
import Editor from './pages/editor';
import Data from './pages/data';
import LoginEditor from './pages/loginEditor';

export default function App() {
  return (
    <Router>
      <Route exact path="/">
        <Redirect to="/dashboard" />
      </Route>
      <Route
        path="/loginEditor"
        component={LoginEditor}
      />
      <Route
        path="/dashboard"
        render={(props) => <Dashboard {...props} />}
      />
      <Route
        path="/scenarioEditor/:id"
        render={(props) => <Editor {...props} />}
      />
      <Route path="/data/:id" render={(props) => <Data {...props} />} />
      <Redirect from="*" to="/loginEditor" />
    </Router>
  );
}
