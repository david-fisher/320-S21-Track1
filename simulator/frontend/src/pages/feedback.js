import React, { useState, useEffect, useContext } from "react";
import { 
  withStyles,
  Typography, 
  Box, 
  Grid, 
  Button,
  makeStyles 
} from "@material-ui/core";
import RadarPlot from "./radarPlot.js";
import GlobalContext from '../Context/GlobalContext';
import {STUDENT_ID} from "../constants/config";
import post from '../universalHTTPRequests/post';

const TextTypography = withStyles({
  root: {
    color: "#373a3c"
  }
})(Typography);

const useStyles = makeStyles((theme) => ({
  backButton: {
    marginLeft: "0rem",
    marginRight: "0rem",
    marginTop: "1rem",
  },
}));

export default function Feedback({versionID, getPrevPage, prevPageEndpoint}) {
  const classes = useStyles();
  // eslint-disable-next-line
  let [contextObj, setContextObj] = useContext(GlobalContext);
  const endpointSess = `/scenarios/session/end?userId=${STUDENT_ID}&versionId=${versionID}`;
  // eslint-disable-next-line
  const [endSessionObj, setEndSessionObj] = useState({
    data: null,
    loading: false,
    error: false,
  });
  const closeSession = () => {
    function onSuccess(response) {      
      // do nothing
    }

    function onFailure() {
      // setErrorBannerMessage('Failed to get scenarios! Please try again.');
      // setErrorBannerFade(true);
    }
    post(setEndSessionObj, endpointSess, onFailure, onSuccess);
  };

  useEffect(closeSession, []);

  const Buttons = (
    <Grid container direction="row" justify="space-between">
      <Grid
        item
        className={classes.backButton}
      >
        <Button
          variant="contained"
          disableElevation
          color="primary"
          onClick={() => getPrevPage(prevPageEndpoint, contextObj.pages)}
        >
          Back
        </Button>
      </Grid>
    </Grid>
  );

  return (
    <div>
      {Buttons}
      <Grid container direction="row" justify="center" alignItems="center">
        <Box mt={5}>
          <TextTypography variant="h4" align="center" gutterBottom>
            Coverage of Issues
          </TextTypography>
          <TextTypography variant="h6" align="center" gutterBottom>
            Thank you for playing through the simulation! Here is how well you covered the ethical issuse pertaining to this simulation.
          </TextTypography>
        </Box>
      </Grid>
      <Grid container spacing={2}>
        <Grid lg={12}>
          <Box m="2rem">
            <RadarPlot versionID={versionID} />
          </Box>
        </Grid>
      </Grid>
    </div>
  );
}
