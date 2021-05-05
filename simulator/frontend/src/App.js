import React from 'react';
import { HashRouter as Router, Route, Redirect } from 'react-router-dom';
import Summary from "./pages/summary";
import Home from "./pages/home";
import SimulationWindow from "./pages/simulationWindow";
import RadarTest from "./pages/chartTest";
import CssBaseline from "@material-ui/core/CssBaseline";
import './App.css';

function App() {
  return (
    <Router>
        <Route exact path="/">
            <Redirect to="/home" />
        </Route>
        <Route path="/home" component={Home} />
        <Route path="/summary" component={Summary} />
        <Route
                path="/simulation/:id"
                render={(props) => <SimulationWindow {...props} />}
            />
        <Route path="/chartTest" component={RadarTest} />
    </Router>
  );
}

export default App;


