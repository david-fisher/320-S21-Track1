import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import {
  withStyles,
  Typography,
  Box,
  Grid,
  Button,
  makeStyles,
} from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import { STUDENT_ID } from '../constants/config';
import GlobalContext from '../Context/GlobalContext';

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
}));

Reflection.propTypes = {
  pageTitle: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  questions: PropTypes.array,
  getNextPage: PropTypes.func.isRequired,
  getPrevPage: PropTypes.func.isRequired,
  nextPageEndpoint: PropTypes.string.isRequired,
  prevPageEndpoint: PropTypes.string.isRequired,
  versionID: PropTypes.number.isRequired,
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
  versionID,
  pageID,
}) {
  body = body.replace(/\\"/g, '"');
  // eslint-disable-next-line
  let [contextObj, setContextObj] = useContext(GlobalContext);

  // For the sake of the demo
  questions = [
    {
      id: 1,
      page: 1,
      reflection_question: 'What are your initial thoughts on autonomous cars?',
      response: '',
    },
    {
      id: 2,
      page: 1,
      reflection_question:
        'What are the ethical conundrums that comes to mind right away for you when you hear about autonomous cars?',
      response: '',
    },
  ];
  if (pageTitle === 'Reflect on Initial Information') {
    questions = [
      {
        id: 1,
        page: 1,
        reflection_question: 'What new responsibilities do you have after being assigned to this project?',
        response: '',
      },
      {
        id: 2,
        page: 1,
        reflection_question:
          "What aren't you sure about, or what questions are raised for you about those responsibilities?",
        response: '',
      },
    ];
  } else if (pageTitle === 'Reflect on Additional Information') {
    questions = [
      {
        id: 1,
        page: 1,
        reflection_question: 'Why did you select your chosen source(s) of information?',
        response: '',
      },
      {
        id: 2,
        page: 1,
        reflection_question:
          'What did you learn that most affects the action that you will take next?',
        response: '',
      },
    ];
  } else if (pageTitle === 'Reflect on Consequences') {
    questions = [
      {
        id: 1,
        page: 1,
        reflection_question: 'Do the consequences presented match your expectations for what you thought would happen? Explain your answer.',
        response: '',
      },
      {
        id: 2,
        page: 1,
        reflection_question:
          'Considering these consequences, how satisfied are you with your choices? In other words, how would you approach a similar situation in the future? Be sure to explain what you might keep the same and what you would change.',
        response: '',
      },
    ];
  } else if (pageTitle === 'Conclusion') {
    questions = [
      {
        id: 1,
        page: 1,
        reflection_question: 'We would appreciate receiving any comments that you have on this online ethics simulation:',
        response: '',
      },
    ];
  }

  const classes = useStyles();

  const [savedAnswers, setSavedAnswers] = React.useState(false);
  // variables to show error if not all reflection questions are answered
  const [errorName, setErrorName] = useState(false);
  // MAKE API CALL
  const [reflection, setReflection] = useState(questions);

  // eslint-disable-next-line
  const endpointPost =
    `/scenarios/reflection?versionId=${
      versionID
    }&pageId=${
      pageID
    }&userId=${
      STUDENT_ID}`;
  const postData = () => {
    // eslint-disable-next-line
    function onSuccess(response) {
      console.log(response);
    }
    // eslint-disable-next-line
    function onFailure() {
      console.log('Error');
    }
    // eslint-disable-next-line
    let data = {
      body: reflection.prompts,
    };

    if (reflection.some(({ response }) => !response || !response.trim())) {
      setErrorName(true);
      return;
    }
    setErrorName(false);
    // TODO post(setFetchScenariosResponse, (endpointPost), onFailure, onSuccess, data)
    setSavedAnswers(true);
  };

  console.log(savedAnswers);
  console.log(reflection);

  const updateResponse = (e, id) => {
    setReflection((prev) => {
      for (let i = 0; i < prev.length; ++i) {
        if (prev[i].id === id) {
          prev[i].response = e.target.value;
          console.log(prev[i].response);
          break;
        }
      }
      return prev;
    });
  };

  const Buttons = (
    <Grid container direction="row" justify="space-between">
      <Grid item className={classes.backButton}>
        <Button
          variant="contained"
          color="primary"
          disableElevation
          onClick={() => getPrevPage(prevPageEndpoint, contextObj.pages)}
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
          <div dangerouslySetInnerHTML={{ __html: body }} />
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
          {questions.map((prompt) => (
            <Box m="2rem" p={1} className={classes.textBox} key={prompt.id}>
              <p>{prompt.reflection_question}</p>
              <TextField
                style={{ width: '100%' }}
                id="outlined-multiline-static"
                label="Answer"
                multiline
                defaultValue={prompt.response}
                variant="outlined"
                onChange={(e) => {
                  updateResponse(e, prompt.id);
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
