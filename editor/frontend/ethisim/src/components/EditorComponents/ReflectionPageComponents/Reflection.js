import React, { useState, useEffect, useContext } from 'react';
import { Typography, Container, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Title from '../GeneralPageComponents/Title';
import QuestionFields from './QuestionComponent/questions';
import universalPost from '../../../universalHTTPRequests/post';
import universalDelete from '../../../universalHTTPRequests/delete';
import SuccessBanner from '../../Banners/SuccessBanner';
import ErrorBanner from '../../Banners/ErrorBanner';
import LoadingSpinner from '../../LoadingSpinner';
import GlobalUnsavedContext from '../../Context/GlobalUnsavedContext';
import { ReflectionPageHelpInfo } from './ReflectionPageHelpInfo';
import GenericHelpButton from '../../HelpButton/GenericHelpButton';
import HTMLPreview from '../HTMLPreview';
import Toggle from '../GeneralPageComponents/Body_TextEditor_CodeEditor';
import checkEditorType from '../GeneralPageComponents/checkEditorType';

Reflection.propTypes = {
  scenarioComponents: PropTypes.any,
  setScenarioComponents: PropTypes.any,
  setCurrentPageID: PropTypes.any,
  page_id: PropTypes.any,
  page_type: PropTypes.any,
  page_title: PropTypes.any,
  scenario_ID: PropTypes.any,
  version_ID: PropTypes.any,
  next_page_id: PropTypes.any,
  body: PropTypes.any,
  bodies: PropTypes.any,
  xCoord: PropTypes.any,
  yCoord: PropTypes.any,
  reflection_questions: PropTypes.any,
};

const useStyles = makeStyles((theme) => ({
  saveButton: {
    margin: theme.spacing(2),
    float: 'right',
    textTransform: 'unset',
  },
  bannerContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
}));

export default function Reflection(props) {
  const {
    scenarioComponents,
    setScenarioComponents,
    setCurrentPageID,
    page_id,
    page_type,
    page_title,
    scenario_ID,
    version_ID,
    next_page_id,
    body,
    reflection_questions,
    xCoord,
    yCoord,
  } = props;

  const classes = useStyles();

  // Used to differentiate between Code Editor and Text Editor format
  const { formattedBody, option } = checkEditorType(body);
  const [editorOption, setEditorOption] = useState(option);

  const [postValues, setPostValues] = useState({
    data: null,
    loading: false,
    error: null,
  });
    // eslint-disable-next-line
    const [deleteValues, setDeleteValues] = useState({
    data: null,
    loading: false,
    error: null,
  });

  reflection_questions.sort((a, b) => a.RQ_ID - b.RQ_ID);
  const [pageID, setPageID] = useState(page_id);
  const [title, setTitle] = useState(page_title);
  const [bodyText, setBodyText] = useState(formattedBody);
  // This makes sure that the body will be the most updated version, hot fix
  useEffect(() => setBodyText(formattedBody), [formattedBody]);
  const [questions, setQuestions] = useState(reflection_questions);
  const [questionsForReqBody, setQuestionsForReqBody] = useState(
    reflection_questions.map((a) => ({ REFLECTION_QUESTION: a.REFLECTION_QUESTION })),
  );
  const [errorTitle, setErrorTitle] = useState(false);
  const [errorTitleText, setErrorTitleText] = useState('');
  const [errorBody, setErrorBody] = useState(false);
  const [errorQuestions, setErrorQuestions] = useState(false);
  const [errorQuestionsMessage, setErrorQuestionsMessage] = useState('');
  const [globalUnsaved, setGlobalUnsaved] = useContext(GlobalUnsavedContext);

  const postReqBody = {
    PAGE: pageID,
    PAGE_TYPE: page_type,
    PAGE_TITLE: title,
    PAGE_BODY: bodyText,
    SCENARIO: scenario_ID,
    VERSION: version_ID,
    NEXT_PAGE: next_page_id,
    REFLECTION_QUESTIONS: questionsForReqBody,
    X_COORDINATE: xCoord,
    Y_COORDINATE: yCoord,
  };

  function handlePost(setPostValues, postReqBody, s_id, first_time) {
    const endpoint = `/page?page_id=${pageID}`;

    function onSuccess(resp) {
      const deleteEndPoint = `/page?page_id=${pageID}`;
      postReqBody.PAGE = resp.data.PAGE;
      const newScenarioComponents = [...scenarioComponents];
      const component = newScenarioComponents.find(
        (x) => x.id === pageID,
      );
      component.id = resp.data.PAGE;
      component.title = title;
      const firstHalf = newScenarioComponents.splice(0, 5);
      newScenarioComponents.sort((a, b) => b.id - a.id);
      setPageID(resp.data.PAGE);
      setCurrentPageID(resp.data.PAGE);
      setScenarioComponents(firstHalf.concat(newScenarioComponents));
      setSuccessBannerFade(true);
      setSuccessBannerMessage('Successfully saved page!');
      setGlobalUnsaved(false);
      universalDelete(setDeleteValues, deleteEndPoint, null, null, {
        PAGE: pageID,
      });
    }

    function onFailure() {
      setErrorBannerFade(true);
      setErrorBannerMessage('Failed to save page! Please try again.');
    }

    let validInput = true;

    if (!title || !title.trim()) {
      setErrorTitle(true);
      setErrorTitleText('Page title cannot be empty');
      validInput = false;
    } else if (title.length >= 1000) {
      setErrorTitle(true);
      setErrorTitleText('Page title must have less than 1000 characters');
      validInput = false;
    } else {
      setErrorTitle(false);
    }

    if (!bodyText || !bodyText.trim()) {
      setErrorBody(true);
      validInput = false;
    } else {
      setErrorBody(false);
    }

    let error = false;
    for (let i = 0; i < questions.length; i++) {
      if (
        !questions[i].REFLECTION_QUESTION
                || !questions[i].REFLECTION_QUESTION.trim()
      ) {
        setErrorQuestions(true);
        setErrorQuestionsMessage(
          'At least one reflection question is blank',
        );
        validInput = false;
        error = true;
      }
    }
    if (!error) {
      setErrorQuestions(false);
    }

    if (validInput) {
      const trimmedQuestions = questions.map((obj) => obj.REFLECTION_QUESTION.trim());
      const questionSet = new Set(trimmedQuestions);
      if (trimmedQuestions.length > questionSet.size) {
        setErrorQuestions(true);
        setErrorQuestionsMessage(
          'You cannot have duplicate reflection questions',
        );
        validInput = false;
      }
    }

    if (validInput) {
      // Used to differentiate between Code Editor and Text Editor format
      if (editorOption === 'CodeEditor') {
        postReqBody.PAGE_BODY = `${bodyText}<!--CodeEditor-->`;
      }
      universalPost(
        setPostValues,
        endpoint,
        onFailure,
        onSuccess,
        postReqBody,
      );
    } else {
      setErrorBannerFade(true);
      setErrorBannerMessage(
        'There are currently errors within your page. Please fix all errors in order to save.',
      );
    }
  }

  const setReqBodyNew = (qs) => {
    const qsrb = [];
    for (let i = 0; i < qs.length; i++) {
      qsrb.push({ REFLECTION_QUESTION: qs[i] });
    }

    setQuestionsForReqBody(qsrb);
  };

  const savePage = () => {
    handlePost(setPostValues, postReqBody, scenario_ID, false);
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

  if (postValues.loading) {
    return <LoadingSpinner />;
  }

  return (
    <Container component="main" style={{ marginTop: '-15px' }}>
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
      <Typography align="center" variant="h2">
        Reflection Page
      </Typography>
      <GenericHelpButton
        description={ReflectionPageHelpInfo}
        title="Reflection Page Help"
      />
      {globalUnsaved ? (
        <Typography variant="h6" align="center" color="error">
          Unsaved
        </Typography>
      ) : null}
      <HTMLPreview title={title} body={bodyText} questions={questions} />
      <Title
        title={title}
        setTitle={setTitle}
        error={errorTitle}
        errorMessage={errorTitleText}
      />
      <Toggle
        body={bodyText}
        setBody={setBodyText}
        error={errorBody}
        option={editorOption}
        setOption={setEditorOption}
      />
      <QuestionFields
        questions={questions}
        setQuestions={setQuestions}
        setReqBodyNew={setReqBodyNew}
      />
      {errorQuestions ? (
        <Typography
          style={{ marginLeft: 50 }}
          variant="body1"
          display="block"
          color="error"
        >
          {errorQuestionsMessage}
        </Typography>
      ) : null}
      <Button
        className={classes.saveButton}
        variant="contained"
        color="primary"
        onClick={savePage}
      >
        Save
      </Button>
    </Container>
  );
}
