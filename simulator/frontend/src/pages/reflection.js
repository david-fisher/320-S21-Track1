import React, { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  withStyles,
  Typography,
  Box,
  Grid,
  Button,
  makeStyles,
} from '@material-ui/core';
import RefreshIcon from '@material-ui/icons/Refresh';
import ErrorIcon from '@material-ui/icons/Error';
import InnerHTML from 'dangerously-set-html-content';
import TextField from '@material-ui/core/TextField';
import { STUDENT_ID } from '../constants/config';
import GlobalContext from '../Context/GlobalContext';
import get from '../universalHTTPRequestsSimulator/get';
import post from '../universalHTTPRequestsSimulator/post';
import LoadingSpinner from '../components/LoadingSpinner';
import SuccessBanner from '../components/Banners/SuccessBanner';
import ErrorBanner from '../components/Banners/ErrorBanner';

const TextTypography = withStyles({
  root: {
    color: '#373a3c',
    whiteSpace: 'pre-wrap',
  },
})(Typography);

const useStyles = makeStyles((theme) => ({
  textBox: {
    overflowY: 'auto',
    maxHeight: window.innerHeight * 0.6,
    marginTop: theme.spacing(4),
    borderRadius: '5px',
    boxShadow: '0px 0px 2px',
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
  bannerContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  container: {
    marginTop: theme.spacing(1),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  issue: {
    marginTop: theme.spacing(10),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  iconError: {
    fontSize: '75px',
  },
  iconRefreshLarge: {
    fontSize: '75px',
  },
}));

Reflection.propTypes = {
  pageTitle: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  questions: PropTypes.array,
  getNextPage: PropTypes.func.isRequired,
  getPrevPage: PropTypes.func.isRequired,
  nextPageEndpoint: PropTypes.string.isRequired,
  prevPageEndpoint: PropTypes.string.isRequired,
  scenarioID: PropTypes.number.isRequired,
  pageID: PropTypes.number.isRequired,
};
export default function Reflection({
  pageTitle,
  body,
  questions,
  getNextPage,
  getPrevPage,
  nextPageEndpoint,
  prevPageEndpoint,
  scenarioID,
  pageID,
}) {
  const [contextObj, setContextObj] = useContext(GlobalContext);
  const classes = useStyles();

  const [savedAnswers, setSavedAnswers] = useState(false);
  // variables to show error if not all reflection questions are answered
  const [errorName, setErrorName] = useState(false);
  // MAKE API CALL
  const [reflection, setReflection] = useState([]);
  // gets reflection responses if they exist
  const endpointGET = `/api/reflections_taken/?SESSION_ID=${contextObj.sessionID}&PAGE_ID=${pageID}`;
  // player submits responses to reflection questions, can only submit once
  const endpointPOST = `/multi_reflection?SESSION_ID=${contextObj.sessionID}`;

  const [reflectionData, setReflectionData] = useState({
    data: null,
    loading: false,
    error: null,
  });
  const getReflectionData = () => {
    function onSuccess(response) {
      console.log(response);
      // Player has already responded
      if (response.data.length !== 0) {
        setSavedAnswers(true);
        setReflection(response.data.map((obj, index) => ({
          ...obj, REFLECTION_QUESTION: questions.filter((o) => o.RQ_ID = obj.RQ_ID)[0].REFLECTION_QUESTION,
        })).sort((a, b) => a.RQ_ID - b.RQ_ID));
      } else {
        setSavedAnswers(false);
        setReflection(questions.map((obj) => ({
          PAGE_ID: obj.PAGE_id, RQ_ID: obj.RQ_ID, SESSION_ID: contextObj.sessionID, REFLECTIONS: '', REFLECTION_QUESTION: obj.REFLECTION_QUESTION,
        })).sort((a, b) => a.RQ_ID - b.RQ_ID));
      }
    }
    // eslint-disable-next-line
    function onFailure(e) {
      setErrorBannerFade(true);
      setErrorBannerMessage('Failed to get reflection question page! Please try again.');
    }
    get(setReflectionData, endpointGET, onFailure, onSuccess);
  };

  useEffect(getReflectionData, []);
  const postData = () => {
    // eslint-disable-next-line
    function onSuccess(response) {
      setSavedAnswers(true);
      setSuccessBannerFade(true);
      setSuccessBannerMessage('Successfully saved answers');
    }
    // eslint-disable-next-line
    function onFailure() {
      setErrorBannerFade(true);
      setErrorBannerMessage('Failed to save your answers! Please try again.');
    }
    // eslint-disable-next-line

    if (reflection.some(({ REFLECTIONS }) => !REFLECTIONS || !REFLECTIONS.trim())) {
      setErrorName(true);
      return;
    }
    setErrorName(false);
    post(setReflectionData, endpointPOST, onFailure, onSuccess, reflection);
  };

  console.log(reflection);

  const updateResponse = (e, id) => {
    setReflection((prev) => {
      for (let i = 0; i < prev.length; ++i) {
        if (prev[i].RQ_ID === id) {
          prev[i].REFLECTIONS = e.target.value;
          break;
        }
      }
      return prev;
    });
  };

  const [successBannerMessage, setSuccessBannerMessage] = useState('');
  const [successBannerFade, setSuccessBannerFade] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSuccessBannerFade(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [successBannerFade]);

  const [errorBannerMessage, setErrorBannerMessage] = useState('');
  const [errorBannerFade, setErrorBannerFade] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setErrorBannerFade(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [errorBannerFade]);

  if (reflectionData.error) {
    return (
      <div>
        <div className={classes.issue}>
          <ErrorIcon className={classes.iconError} />
          <Typography align="center" variant="h3">
            Error in fetching reflection question data.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={getReflectionData}
          >
            <RefreshIcon className={classes.iconRefreshLarge} />
          </Button>
        </div>
      </div>
    );
  }

  if (reflectionData.loading) {
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
          color="primary"
          disableElevation
          onClick={() => getPrevPage(contextObj.activeIndex - 1)}
        >
          Back
        </Button>
      </Grid>
      <Grid item className={classes.nextButton}>
        <Button
          variant="contained"
          disabled={!savedAnswers}
          disableElevation
          color="primary"
          onClick={() => getNextPage(
            nextPageEndpoint,
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
      <div className={classes.bannerContainer}>
        <SuccessBanner
          successMessage={successBannerMessage}
          fade={successBannerFade}
        />
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
      <Grid containerstyle={{ width: '100%' }}>
        <Grid item style={{ width: '100%' }}>
          <InnerHTML html={body.replace(/\\"/g, '"')} />
        </Grid>
      </Grid>

      <Grid container style={{ width: '100%' }}>
        {errorName ? (
          <Typography
            style={{ }}
            variant="h6"
            align="center"
            color="error"
          >
            You must answer all questions!
          </Typography>
        ) : null}
        <Grid item style={{ width: '100%' }}>
          {reflection.map((prompt) => (
            <Box m="2rem" p={1} className={classes.textBox} key={prompt.RQ_ID}>
              <p>{prompt.REFLECTION_QUESTION}</p>
              <TextField
                style={{ width: '100%' }}
                id="outlined-multiline-static"
                multiline
                disabled={savedAnswers}
                defaultValue={prompt.REFLECTIONS}
                variant="outlined"
                onChange={(e) => {
                  updateResponse(e, prompt.RQ_ID);
                }}
              />
            </Box>
          ))}
          <Grid container justify="center" alignItems="center" style={{ marginBottom: '1rem' }}>
            <Button
              variant="contained"
              color="primary"
              justify="right"
              disabled={savedAnswers}
              onClick={postData}
            >
              Submit Answers
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}
