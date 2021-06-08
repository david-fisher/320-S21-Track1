import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import {
  withStyles,
  Typography,
  Box,
  Grid,
  Button,
  makeStyles,
} from '@material-ui/core';
import RadarPlot from './radarPlot';
import GlobalContext from '../Context/GlobalContext';
import { STUDENT_ID } from '../constants/config';
import post from '../universalHTTPRequestsSimulator/post';

const TextTypography = withStyles({
  root: {
    color: '#373a3c',
  },
})(Typography);

const useStyles = makeStyles((theme) => ({
  backButton: {
    marginLeft: '0rem',
    marginRight: '0rem',
    marginTop: '1rem',
  },
}));

Feedback.propTypes = {
  scenarioID: PropTypes.number.isRequired,
  getPrevPage: PropTypes.func.isRequired,
  prevPageEndpoint: PropTypes.string.isRequired,
};
export default function Feedback({ scenarioID, getPrevPage, prevPageEndpoint }) {
  const classes = useStyles();
  // eslint-disable-next-line
  let [contextObj, setContextObj] = useContext(GlobalContext);
  const endpointSess = `/scenarios/session/end?userId=${STUDENT_ID}&scenarioId=${scenarioID}`;
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
      <Grid item className={classes.backButton}>
        <Button
          variant="contained"
          disableElevation
          color="primary"
          onClick={() => getPrevPage(contextObj.activeIndex - 1)}
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
          <TextTypography variant="subtitle" display="block" gutterBottom>
            Shown above is a radar chart that displays your coverage, via the conversations, of the different considerations in the scenario.
            It was impossible for you to have completely covered all of these considerations, since the number of conversations was limited.
            It was hoped that your careful selection of conversations would let you cover the most ethically relevant considerations sufficiently.
          </TextTypography>
          <TextTypography variant="subtitle" display="block" gutterBottom>
            Along the perimeter of the chart are labels for the different considerations, colored from light (lower ethical relevance) to dark (higher ethical relevance).
            Your amount of coverage for each consideration is based on the topics covered in the conversations you chose to have.
          </TextTypography>
          <TextTypography variant="subtitle" display="block" gutterBottom>
            For each consideration, the percent coverage, out of 100, is shown as a distance from the center of the chart.
            The plotted coverage scores are connected to form the shaded enclosed area centered on the middle of the chart.
          </TextTypography>
          <TextTypography variant="subtitle" display="block" gutterBottom>
            The color of the enclosed area represents your overall level of coverage for the entire scenario, taking into consideration the amount you covered each consideration along with each consideration's level of ethical relevance: red signifies insufficient coverage, yellow signifies sufficient coverage, and green signifies excellent coverage.
          </TextTypography>
        </Box>
      </Grid>
      <Grid container spacing={2}>
        <Grid lg={12}>
          <Box m="2rem">
            <RadarPlot scenarioID={scenarioID} />
          </Box>
        </Grid>
      </Grid>
    </div>
  );
}
