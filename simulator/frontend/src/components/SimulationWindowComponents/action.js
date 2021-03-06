import React, { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  makeStyles,
  withStyles,
  Typography,
  Box,
  Button,
  Grid,
} from '@material-ui/core';
import InnerHTML from 'dangerously-set-html-content';
import get from '../../universalHTTPRequestsSimulator/get';
import post from '../../universalHTTPRequestsSimulator/post';
import GlobalContext from '../../Context/GlobalContext';
import ErrorBanner from '../Banners/ErrorBanner';
import LoadingSpinner from '../LoadingSpinner';
import GenericWarning from '../GenericWarning';
import { Link } from 'react-router-dom';

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
  bannerContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
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
};
export default function Action({
  scenarioID,
  pageID,
  pageTitle,
  body,
  choices,
  getNextPage,
  getPrevPage,
  prevPageEndpoint,
}) {
  const classes = useStyles();
  // eslint-disable-next-line
  let [contextObj, setContextObj] = useContext(GlobalContext);
  const [actions, setActions] = useState([]);
  const [chosenAction, setChosenAction] = useState(-1);
  // eslint-disable-next-line
  const [fetchActionResponse, setFetchActionResponse] = useState({
    data: null,
    loading: false,
    error: false,
  });
  // gets player's action choice if they exist
  const endpointGET = `/api/action_page_responses/?SESSION_ID=${contextObj.sessionID}&PAGE_ID_id=${pageID}`;
  // player submits action choice, can only submit once
  const endpointPOST = '/api/action_page_responses/';
  // eslint-disable-next-line
  const endpointSess = `/scenarios/session/start?userId=${contextObj.userID}&versionId=${scenarioID}`;

  const [actionData, setActionData] = useState({
    data: null,
    loading: false,
    error: null,
  });

  const [selectActionFunc, setSelectActionFunc] = useState(null);

  const getActionData = () => {
    const actionsForPage = choices.map((obj) => ({
      PAGE_ID: obj.PAGE_id, APC_ID: obj.APC_ID, SESSION_ID: contextObj.sessionID, CHOICE: obj.CHOICE, RESULT_PAGE_id: obj.RESULT_PAGE_id,
    })).sort((a, b) => a.APC_ID - b.APC_ID);
    setActions(actionsForPage);
    function onSuccess(response) {
      // Player has already chosen an action
      (response.data.length !== 0) ? setChosenAction(response.data[0].APC_ID) : setChosenAction(-1);
      setContextObj((prev) => ({
        ...prev,
        [pageID]: {
          chosenAction: (response.data.length !== 0) ? response.data[0].APC_ID : -1,
          actions: actionsForPage,
        },
      }));
    }
    function onFailure(e) {
      setChosenAction(-1);
      setErrorBannerFade(true);
      setErrorBannerMessage('Failed to get action data! Please try again.');
    }
    if (contextObj[pageID]) {
      setChosenAction(contextObj[pageID].chosenAction);
      setActions(contextObj[pageID].actions);
    } else {
      get(setActionData, endpointGET, onFailure, onSuccess);
    }
  };
  useEffect(getActionData, []);

  const getAction = (selectedAction, nextPageID) => {
    function onSuccess(response) {
      getNextPage(
        `/page?page_id=${nextPageID}`,
        contextObj.activeIndex,
        contextObj.pages,
        contextObj.sessionID,
      );
      setChosenAction(selectedAction);
      setContextObj((prev) => ({
        ...prev,
        [pageID]: {
          chosenAction: selectedAction,
          actions,
        },
      }));
    }
    function onFailure() {
      setErrorBannerMessage('Failed to save action! Please try again.');
      setErrorBannerFade(true);
    }

    if (chosenAction === -1) {
      const requestBody = {
        APC_ID: selectedAction,
        SESSION_ID: contextObj.sessionID,
        PAGE_ID: pageID,
      };
      post(setFetchActionResponse, endpointPOST, onFailure, onSuccess, requestBody);
    } else if (selectedAction === chosenAction) {
      getNextPage(
        `/page?page_id=${nextPageID}`,
        contextObj.activeIndex,
        contextObj.pages,
        contextObj.sessionID,
      );
    }
  };

  const [errorBannerMessage, setErrorBannerMessage] = useState('');
  const [errorBannerFade, setErrorBannerFade] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setErrorBannerFade(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [errorBannerFade]);

  const [openWarning, setOpenWarning] = useState(false);
  const handleOpenWarning = () => {
    setOpenWarning(true);
  };

  if (actionData.loading) {
    return (
      <div>
        <div style={{ marginTop: '100px' }}>
          <LoadingSpinner />
        </div>
      </div>
    );
  }
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
      <Button
          variant="contained"
          disableElevation
          color="primary"
          disabled={chosenAction === -1}
          onClick={() => {
            const nextPageID = actions.filter((obj) => obj.APC_ID === chosenAction)[0].RESULT_PAGE_id;
            getNextPage(
              `/page?page_id=${nextPageID}`,
              contextObj.activeIndex,
              contextObj.pages,
              contextObj.sessionID,
            );
          }}
        >
          Next
        </Button>
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
          <TextTypography variant="h4" align="center" gutterBottom>
            {pageTitle}
          </TextTypography>
        </Box>
      </Grid>
      <Grid container spacing={2}>
        <Grid item style={{ width: '100%' }}>
          <Grid item style={{ width: '100%' }}>
            <InnerHTML html={body.replace(/\\"/g, '"')} />
          </Grid>
          <Box mx="auto">
            {actions.map((choice) => (
              <Box p={3} key={choice.APC_ID}>
                <Button
                  variant="outlined"
                  color="primary"
                  disabled={chosenAction !== -1 && choice.APC_ID !== chosenAction}
                  className={classes.button}
                  size="large"
                  onClick={chosenAction !== -1 ? () => getAction(choice.APC_ID, choice.RESULT_PAGE_id) : () => {
                    setSelectActionFunc(() => () => getAction(choice.APC_ID, choice.RESULT_PAGE_id));
                    handleOpenWarning();
                  }}
                >
                  {choice.CHOICE}
                </Button>
              </Box>
            ))}
          </Box>
        </Grid>
        <GenericWarning
          func={selectActionFunc}
          setOpen={setOpenWarning}
          open={openWarning}
          title="Warning"
          description="You will not be able to change your selection after you submit. Are you sure you want to submit?"
        />
      </Grid>
    </div>
  );
}
