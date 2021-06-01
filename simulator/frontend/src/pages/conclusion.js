import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  withStyles, Typography, Box, Grid, Button,
} from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import InnerHTML from 'dangerously-set-html-content';
import { BACK_URL_EDITOR, STUDENT_ID, SCENARIO_ID } from '../constants/config';
import { ScenariosContext } from '../Nav';
import post from '../universalHTTPRequestsEditor/post';

const TextTypography = withStyles({
  root: {
    color: '#373a3c',
  },
})(Typography);

const questions = [
  {
    text: 'We would appreciate receiving any comments that you have on this online ethics simulation: ',
    id: 1,
  },
];

// TODO Currently not used, could be used as the final page of a scenario
Conclusion.propTypes = {
  setActivePage: PropTypes.string.isRequired,
  activePage: PropTypes.string.isRequired,
  pages: PropTypes.array.isRequired,
  setPages: PropTypes.func.isRequired,
  prevPageID: PropTypes.number.isRequired,
  versionID: PropTypes.number.isRequired,
};
export default function Conclusion({
  pages,
  setPages,
  prevPageID,
  versionID,
  activePage,
  setActivePage,
}) {
  const [body, setBody] = useState('');
  const [scenarios, setScenarios] = React.useContext(ScenariosContext);
  const [fetchScenariosResponse, setFetchScenariosResponse] = useState({
    data: null,
    loading: false,
    error: false,
  });
  const [shouldFetch, setShouldFetch] = useState(0);
  const endpointSess = `/scenarios/session/end?userId=${STUDENT_ID}&versionId=${versionID}`;

  const closeSession = () => {
    function onSuccess(response) {
      // do nothing
    }

    function onFailure() {
      // setErrorBannerMessage('Failed to get scenarios! Please try again.');
      // setErrorBannerFade(true);
    }
    post(setFetchScenariosResponse, endpointSess, onFailure, onSuccess);
  };

  function goToPrevPage() {
    if (!pages[prevPageID].visited) {
      setPages((prevPages) => {
        const copy = { ...prevPages };
        copy[prevPageID].visited = true;
        return copy;
      });
    }
    setActivePage((prevPage) => prevPageID);
  }

  const history = useHistory();
  const goToHome = () => {
    closeSession();
    history.push('/');
  };

  return (
    <div>
      <Grid container direction="row" justify="center" alignItems="center">
        <Box mt={5}>
          <TextTypography variant="h4" align="center" gutterBottom>
            Student Feedback
          </TextTypography>
        </Box>
      </Grid>
      <Grid container direction="row" justify="space-between">
        <Grid item style={{ marginRight: '0rem', marginTop: '-3rem' }}>
          <Button variant="contained" disableElevation onClick={goToPrevPage}>
            Back
          </Button>
        </Grid>
        <Grid item style={{ marginRight: '0rem', marginTop: '-3rem' }}>
          {/* <Button variant="outlined">Next</Button> */}
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item lg={12}>
          <Box m="2rem" />
        </Grid>
      </Grid>
    </div>
  );
}
