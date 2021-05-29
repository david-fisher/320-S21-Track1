import React, { useState, useEffect, useContext } from 'react';
import {
  Button, Typography, Container,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Title from '../GeneralPageComponents/Title';
import universalPost from '../../../universalHTTPRequests/post';
import universalDelete from '../../../universalHTTPRequests/delete';
import SuccessBanner from '../../Banners/SuccessBanner';
import ErrorBanner from '../../Banners/ErrorBanner';
import LoadingSpinner from '../../LoadingSpinner';
import GlobalUnsavedContext from '../../Context/GlobalUnsavedContext';
import { ActionPageHelpInfo } from './ActionPageHelpInfo';
import GenericHelpButton from '../../HelpButton/GenericHelpButton';
import HTMLPreview from '../HTMLPreview';
import Choice from './Choice';
import Toggle from '../GeneralPageComponents/Body_TextEditor_CodeEditor';
import checkEditorType from '../GeneralPageComponents/checkEditorType';

Action.propTypes = {
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
  choices: PropTypes.array,
};

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  form: {
    marginTop: theme.spacing(1),
    width: '100%',
  },
  submit: {
    marginTop: theme.spacing(2),
    backgroundColor: theme.palette.primary.main,
    color: 'white',
    textTransform: 'unset',
  },
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

export default function Action(props) {
  const classes = useStyles();
  const {
    scenarioComponents,
    setScenarioComponents,
    setCurrentPageID,
    page_id,
    page_type,
    page_title,
    scenario_ID,
    next_page_id,
    body,
    choices,
    xCoord,
    yCoord,
  } = props;

  // Used to differentiate between Code Editor and Text Editor format
  const { initialBody, option } = checkEditorType(body);
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

  choices.sort((a, b) => a.APC_ID - b.APC_ID);
  const [pageID, setPageID] = useState(page_id);
  const [title, setTitle] = useState(page_title);
  const [bodyText, setBodyText] = useState(initialBody);
  // This makes sure that the body will be the most updated version, hot fix
  useEffect(() => setBodyText(initialBody), [body, initialBody]);
  const [choicesArr, setChoicesArr] = useState(choices);
  const [errorTitle, setErrorTitle] = useState(false);
  const [errorTitleText, setErrorTitleText] = useState(false);
  const [errorBody, setErrorBody] = useState(false);
  const [errorChoices, setErrorChoices] = useState(false);
  const [globalUnsaved, setGlobalUnsaved] = useContext(GlobalUnsavedContext);

  const postReqBody = {
    PAGE: pageID,
    PAGE_TYPE: page_type,
    PAGE_TITLE: title,
    PAGE_BODY: bodyText,
    SCENARIO: scenario_ID,
    NEXT_PAGE: next_page_id,
    CHOICES: choicesArr,
    X_COORDINATE: xCoord,
    Y_COORDINATE: yCoord,
  };

  function handlePost(setPostValues, postReqBody, s_id, first_time) {
    const endpoint = `/page?page_id=${pageID}`;

    function onSuccess(resp) {
      const deleteEndPoint = `/page?page_id=${pageID}`;
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

    const arr = choicesArr.map(({ CHOICE }) => CHOICE.trim());
    if (choicesArr.some(({ CHOICE }) => !CHOICE && !CHOICE.trim()) || (new Set(arr)).size !== arr.length) {
      setErrorChoices(true);
      validInput = false;
    } else {
      setErrorChoices(false);
    }

    if (validInput) {
      postReqBody.CHOICES = choicesArr.map(({ CHOICE, NEXT_PAGE }) => ({ CHOICE, NEXT_PAGE }));
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
  const savePage = () => {
    handlePost(setPostValues, postReqBody, scenario_ID, false);
  };

  function setNewID() {
    let newID = Math.floor(Math.random() * 10000000);
    let collision = choicesArr.filter((data) => data.APC_ID === newID).length !== 0;
    while (collision) {
      newID = Math.floor(Math.random() * 10000000);
      const checkNewID = newID;
      collision = choicesArr.filter((data) => data.APC_ID === checkNewID)
        .length !== 0;
    }
    return newID;
  }

  const addChoice = (e) => {
    setGlobalUnsaved(true);
    e.preventDefault();
    const newChoicesArr = choicesArr.concat({
      APC_ID: setNewID(),
      CHOICE: '',
      NEXT_PAGE: null,
      PAGE_id: page_id,
    });
    setChoicesArr(newChoicesArr);
  };

  const removeChoice = (id) => {
    setGlobalUnsaved(true);
    const leftChoices = choicesArr.filter((q) => q.APC_ID !== id);
    setChoicesArr(leftChoices);
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
        Action Page
      </Typography>
      <GenericHelpButton
        description={ActionPageHelpInfo}
        title="Action Page Help"
      />
      {globalUnsaved ? (
        <Typography variant="h6" align="center" color="error">
          Unsaved
        </Typography>
      ) : null}
      <HTMLPreview title={title} body={bodyText} choices={choicesArr} />
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
      <div className={classes.container}>
        <Button
          className={classes.saveButton}
          variant="contained"
          color="primary"
          onClick={addChoice}
        >
          Add Choice
        </Button>
        {errorChoices ? (
          <Typography variant="h6" align="center" color="error">
            All choices must be filled in and there cannot be duplicate choices!
          </Typography>
        ) : null}
        <form className={classes.form}>
          {choicesArr.map((obj, index) => (
            <Choice
              key={obj.APC_ID}
              id={obj.APC_ID}
              choice={obj.CHOICE}
              choices={choicesArr}
              setChoices={setChoicesArr}
              removeChoice={removeChoice}
              index={index + 1}
            />
          ))}
          <Button
            className={classes.saveButton}
            variant="contained"
            color="primary"
            onClick={savePage}
          >
            Save
          </Button>
        </form>
      </div>
    </Container>
  );
}
