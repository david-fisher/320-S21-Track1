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
import { Link } from 'react-router-dom';
import RadarPlot from './radarPlot';
import GlobalContext from '../../../Context/GlobalContext';

import post from '../../../universalHTTPRequestsSimulator/post';
import ErrorBanner from '../../Banners/ErrorBanner';


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
  nextButton: {
    marginRight: '0rem',
    marginTop: '1rem',
  },
  bannerContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
}));

Feedback.propTypes = {
  scenarioID: PropTypes.number.isRequired,
  getPrevPage: PropTypes.func.isRequired,
  getNextPage: PropTypes.func,
  prevPageEndpoint: PropTypes.string.isRequired,
  nextPageEndpoint: PropTypes.string.isRequired,
};
export default function Feedback({ scenarioID, getPrevPage, getNextPage, prevPageEndpoint, nextPageEndpoint }) {
  const classes = useStyles();
  // eslint-disable-next-line
  let [contextObj, setContextObj] = useContext(GlobalContext);

  const [errorBannerMessage, setErrorBannerMessage] = useState('');
  const [errorBannerFade, setErrorBannerFade] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setErrorBannerFade(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [errorBannerFade]);
  const endpointSess = `/scenarios/session/end?userId=${contextObj.userID}&scenarioId=${scenarioID}`;
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
      setErrorBannerMessage('Unknown error! Please refresh the page.');
      setErrorBannerFade(true);
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
      <Grid item className={classes.nextButton}>
      {nextPageEndpoint ? (
        <Button
          variant="contained"
          disableElevation
          color="primary"
          onClick={() => getNextPage(
            nextPageEndpoint,
            contextObj.activeIndex,
            contextObj.pages,
            contextObj.sessionID,
          )}
        >
          Next
        </Button>
        ) : (
        <Button
          variant="contained"
          disableElevation
          color="primary"
          component={Link}
          to={{
            pathname: '/dashboard',
          }}
        >
          Exit
        </Button> )}
      </Grid>
    </Grid>
  );


  return (
    <div>
      <div className={classes.bannerContainer}>
        <ErrorBanner
          errorMessage={errorBannerMessage}
          fade={errorBannerFade}
        />
      </div>
      {Buttons}
      <Grid container direction="row" justify="center" alignItems="center">
        <Box mt={5}>
          <Typography variant="h4" align="center" gutterBottom>
            Coverage of Issues
          </Typography>
          <TextTypography variant="body1" display="block" gutterBottom>
            Shown below is a radar chart that displays your coverage, via the conversations, of the different considerations in the scenario.
            It was impossible for you to have completely covered all of these considerations, since the number of conversations was limited.
            It was hoped that your careful selection of conversations would let you cover the most ethically relevant considerations sufficiently.
          </TextTypography>
          <TextTypography variant="body1" display="block" gutterBottom>
            Along the perimeter of the chart are labels for the different considerations, colored from light (lower ethical relevance) to dark (higher ethical relevance).
            Your amount of coverage for each consideration is based on the topics covered in the conversations you chose to have.
          </TextTypography>
          <TextTypography variant="body1" display="block" gutterBottom>
            For each consideration, the percent coverage, out of 100, is shown as a distance from the center of the chart.
            The plotted coverage scores are connected to form the shaded enclosed area centered on the middle of the chart.
          </TextTypography>
          <TextTypography variant="body1" display="block" gutterBottom>
            The color of the enclosed area represents your overall level of coverage for the entire scenario, taking into consideration the amount you covered each consideration along with each consideration's level of ethical relevance: red signifies insufficient coverage, yellow signifies sufficient coverage, and green signifies excellent coverage.
          </TextTypography>
          <Typography variant="h6" gutterBottom>
            Stakeholders Talked to:
          </Typography>
          {
          contextObj.stakeholderPage ? contextObj.stakeholderPage.stakeholders.filter((x) => x.selected).map((x, index) => (
            <TextTypography key={index} variant="body1" display="block" gutterBottom>
              {`${x.name} - ${x.job}`}
            </TextTypography>
          )) : <Typography variant="h6" gutterBottom>
          No stakeholders talked to
        </Typography>}
        </Box>
      </Grid>
      <Grid container style={{ maxWidth: '100%' }}>
        <Grid item lg={12}>
          <Box>
            <RadarPlot scenarioID={scenarioID} />
          </Box>
        </Grid>
      </Grid>
    </div>
  );
}
