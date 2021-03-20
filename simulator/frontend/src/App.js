import React from 'react';
import { Route } from "react-router-dom";
import Summary from "./pages/summary";
import Home from "./pages/home";
import SimulationWindow from "./pages/simulationWindow";
import RadarTest from "./pages/chartTest";
import CssBaseline from "@material-ui/core/CssBaseline";
import './App.css';

function App() {
  return (
    <>
      <CssBaseline />
      <Route exact path="/" component={Home} />
      <Route exact path="/summary" component={Summary}/>
      <Route exact path="/simulation" component={SimulationWindow}/>
      <Route exact path="/chartTest" component={RadarTest}/>
    </>
  );
}

export default App;


