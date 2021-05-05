import React from 'react';
import { HashRouter as Router, Route, Redirect } from 'react-router-dom';
import Summary from "./pages/summary";
import Home from "./pages/home";
import SimulationWindow from "./pages/simulationWindow";
import CssBaseline from "@material-ui/core/CssBaseline";
import './App.css';

function App() {
  return (
    <Router>
        <Route exact path="/">
            <Redirect to="/simulator" />
        </Route>
        <Route path="/simulator" component={Home} />
        <Route
                path="/simulation/:id"
                render={(props) => <SimulationWindow {...props} />}
            />
    </Router>
  );
}

export default App;


