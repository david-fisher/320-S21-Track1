import React from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import Signup from './pages/signup';
import Login from './pages/login';
import Dashboard from './pages/dashboard';
import Editor from './pages/editor';
import Data from './pages/data';
import Homepage from './pages/homepage';

export default function App() {
    return (
        <Router>
            <Route exact path="/">
                <Redirect to="/home" />
            </Route>
            <Route path="/home" component={Homepage} />
            <Route path="/login" component={Login} />
            <Route path="/signup" component={Signup} />
            <Route path="/dashboard" component={Dashboard} />
            <Route
                path="/editor/:id"
                render={(props) => <Editor {...props} />}
            />
            <Route path="/data/:id" render={(props) => <Data {...props} />} />
        </Router>
    );
}
