import React from "react";
import Radar from "./chart/chart";
import { withStyles, Typography, Box, Grid, Button } from "@material-ui/core";
import { BASE_URL, STUDENT_ID, SCENARIO_ID } from "../constants/config";
import axios from 'axios'
import ScrollableTabsButtonAuto from "./components/tabs"

const TextTypography = withStyles({
  root: {
    color: "#373a3c"
  }
})(Typography);

function Summary({pages, setPages, activePage, setActivePage}) {
  function goToFinalAction(){
    if (!pages.finalAction.visited) {
      setPages(prevPages => {
        let copy = {...prevPages};
        copy.finalAction.visited = true;
        return copy;
      });
    }
    setActivePage(prevPage => 'finalAction')
  }
  function goToFeedback(){
    if (!pages.feedback.visited) {
      setPages(prevPages => {
        let copy = {...prevPages};
        copy.feedback.visited = true;
        return copy;
      });
    }
    setActivePage(prevPage => 'feedback');
  }
  let Summary_Value = 2.03;
  let Coverage = { Safety: 0.5, Salary: 0.667, Reputation: 1.0, Privacy: 0.8 };
  return (
    <div>
      <Grid container direction="row" justify="center" alignItems="center">
        <Box mt = {5}>
          <TextTypography variant="h4" align="center" gutterBottom>
            Summary
          </TextTypography>
        </Box>
      </Grid>
      <Grid container direction="row" justify="space-between">
        <Grid item style={{ marginRight: "0rem", marginTop: "-3rem" }}>
          <Button variant="contained" disableElevation onClick={goToFinalAction}>Back</Button>
        </Grid>
        <Grid item style={{ marginRight: "0rem", marginTop: "-3rem" }}>
          <Button variant="contained" disableElevation color="primary" onClick={goToFeedback}>Next</Button>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid lg={12}>
          <ScrollableTabsButtonAuto/>
        </Grid>
      </Grid>
    </div>
  );
}

export default Summary;
