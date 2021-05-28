import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import {
  makeStyles,
  withStyles,
  Typography,
  Box,
  Button,
  Grid,
} from '@material-ui/core';
import { STUDENT_ID } from '../constants/config';
import post from '../universalHTTPRequestsEditor/post';
import GlobalContext from '../Context/GlobalContext';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    color: '#5b7f95',
  },
  errorContainer: {
    marginTop: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  backButton: {
    marginLeft: '0rem',
    marginRight: '0rem',
    marginTop: '1rem',
  },
  nextButton: {
    marginRight: '0rem',
    marginTop: '1rem',
  },
  button: {
    width: '100%',
    textTransform: 'unset',
  },
}));

const TextTypography = withStyles({
  root: {
    color: '#373a3c',
  },
})(Typography);

Action.propTypes = {
  pageTitle: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  getNextPage: PropTypes.func.isRequired,
  getPrevPage: PropTypes.func.isRequired,
  prevPageEndpoint: PropTypes.string,
  scenarioID: PropTypes.number.isRequired,
  pageID: PropTypes.number.isRequired,
  choices: PropTypes.any,
  choiceChosen: PropTypes.any,
};
export default function Action({
  scenarioID,
  pageID,
  pageTitle,
  body,
  choices,
  choiceChosen,
  getNextPage,
  getPrevPage,
  prevPageEndpoint,
}) {
  // eslint-disable-next-line
  let [contextObj, setContextObj] = useContext(GlobalContext);
  body = body.replace(/\\"/g, '"');

  // eslint-disable-next-line
  const [chosenAction, setChosenAction] = React.useState(-1);
  // eslint-disable-next-line
  const [fetchActionResponse, setFetchActionResponse] = useState({
    data: null,
    loading: false,
    error: false,
  });
  // MAKE API CALL
  // let pageId = activePage
  // const endpointGet = '/scenarios/action/prompt?versionId='+version_id+'&pageId='+(activePage)// version id hardcoded
  // const endpointGet2 = '/scenarios/action?versionId='+version_id+'&pageId='+(activePage)+'&userId='+STUDENT_ID
  // eslint-disable-next-line
  const endpointPost =
    `/scenarios/action?versionId=${scenarioID}&pageId=${pageID}`;
  const endpointSess = `/scenarios/session/start?userId=${STUDENT_ID}&versionId=${scenarioID}`;

  const getAction = (selectedAction, nextPageID) => {
    console.log(pageID);
    function startSess(response) {
      // do nothing
    }
    // eslint-disable-next-line
    function onSuccess(response) {
      // Right now hardcoded for middle reflection
      // pages["middleReflection"].pid = parseInt(pages[activePage].pid)+4 // Set next page id
      // eslint-disable-next-line
      let body = {
        response_id: response.data.result.response_id,
        choice: response.data.result.choice,
        CHOICE: response.data.result.CHOICE,
        next: response.data.result.RESULT_PAGE_id,
      };
      console.log(response);
      setChosenAction((cur) => selectedAction);
    }
    function onFailure() {
      // setErrorBannerMessage('Failed to get scenarios! Please try again.');
      // setErrorBannerFade(true);
    }
    if (!choiceChosen) {
      post(setFetchActionResponse, endpointSess, onFailure, startSess);
      // TODO Remove once post request finishes
      getNextPage(
        `/page?page_id=${nextPageID}`,
        contextObj.activeIndex,
        contextObj.pages,
      );
      // eslint-disable-next-line
      let body = { choice_id: selectedAction, user_id: STUDENT_ID };
      // TODO post(setFetchActionResponse, endpointPost, onFailure, onSuccess, JSON.stringify(body));
    }
  };

  const classes = useStyles();

  const Buttons = (
    <Grid container direction="row" justify="space-between">
      <Grid item className={classes.backButton}>
        <Button
          variant="contained"
          disableElevation
          color="primary"
          onClick={() => getPrevPage(prevPageEndpoint, contextObj.pages)}
        >
          Back
        </Button>
      </Grid>
      <Grid item className={classes.nextButton}>
        <Button
          variant="contained"
          disableElevation
          color="primary"
          disabled={!choiceChosen}
          onClick={() => getNextPage(
            `/scenarios/task?versionId=${scenarioID}&pageId=${choiceChosen}`,
            contextObj.activeIndex,
            contextObj.pages,
          )}
        >
          Next
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
            {pageTitle}
          </TextTypography>
        </Box>
      </Grid>
      <Grid container spacing={2}>
        <Grid item style={{ width: '100%' }}>
          <Grid item style={{ width: '100%' }}>
            <div dangerouslySetInnerHTML={{ __html: body }} />
          </Grid>
          <Box mx="auto">
            {choices.map((choice) => (
              <Box p={3} key={choice.APC_ID}>
                <Button
                  variant="outlined"
                  color="primary"
                  disabled={choice.APC_ID === choiceChosen}
                  className={classes.button}
                  size="large"
                  onClick={() => getAction(choice.APC_ID, choice.RESULT_PAGE_id)}
                >
                  {choice.CHOICE}
                </Button>
              </Box>
            ))}
          </Box>
        </Grid>
      </Grid>
    </div>
  );
}
