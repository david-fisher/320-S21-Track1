import React, { useState, useEffect, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
// import Author from './Author';
import {
  Button,
  TextField,
  Typography,
  Container,
  Divider,
} from '@material-ui/core';
import RefreshIcon from '@material-ui/icons/Refresh';
import ErrorIcon from '@material-ui/icons/Error';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import PropTypes from 'prop-types';
import put from '../../../universalHTTPRequests/put';
import get from '../../../universalHTTPRequests/get';
import LoadingSpinner from '../../LoadingSpinner';
import SuccessBanner from '../../Banners/SuccessBanner';
import ErrorBanner from '../../Banners/ErrorBanner';
import Tags from './DropDown';
import GlobalUnsavedContext from '../../../Context/GlobalUnsavedContext';
import ScenarioAccessLevelContext from '../../../Context/ScenarioAccessLevelContext';
import GenericHelpButton from '../../HelpButton/GenericHelpButton';
import { LogisticsHelpInfo } from './LogistcsHelpInfo';

const useStyles = makeStyles((theme) => ({
  textfields: {
    '& > *': {
      margin: theme.spacing(1),
      width: '100%',
    },
  },
  buttons: {
    '& > *': {
      margin: theme.spacing(1),
      marginBottom: theme.spacing(1),
      width: '100%',
      textTransform: 'unset',
    },
  },
  authorButtons: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    textTransform: 'unset',
  },
  subdiv: {
    marginTop: theme.spacing(1),
    width: '750px',
    '@media (max-width: 1100px)': {
      width: '100%',
    },
  },
  bannerContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  errorContainer: {
    marginTop: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  container: {
    marginTop: '-15px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconError: {
    paddingRight: theme.spacing(2),
    fontSize: '75px',
  },
  iconRefreshLarge: {
    fontSize: '75px',
  },
  iconRefreshSmall: {
    fontSize: '30px',
  },
}));

Logistics.propTypes = {
  scenario_ID: PropTypes.any,
};

export default function Logistics({ scenario_ID }) {
  // Need scenario id
  const endpointGetLogistics = '/logistics?scenario_id=';
  const endpointGetCourses = '/api/courses/';
  const endPointPut = '/logistics';

  const classes = useStyles();
  // temporary until backend implements id's
  const [fetchCourseResponse, setFetchCourseResponse] = useState({
    data: null,
    loading: false,
    error: null,
  });
  const [globalUnsaved, setGlobalUnsaved] = useContext(GlobalUnsavedContext);
  const accessLevel = useContext(ScenarioAccessLevelContext);

  // eslint-disable-next-line
  const [id, setId] = useState(scenario_ID);

  // Authors mock implementation
  const [authors, setAuthors] = useState([]);

  // Set fake ID for list item
  const initialAuthorsWithID = authors.map((author) => ({
    author,
    id: Math.floor(Math.random() * 10000),
  }));

  const [authorsWithID, setAuthorsWithID] = useState(initialAuthorsWithID);

  const resetAuthorsWithID = (authorsWithID) => {
    const initialAuthorsWithID = authors.map((author) => ({
      author,
      id: Math.floor(Math.random() * 10000),
    }));
    setAuthorsWithID(initialAuthorsWithID);
  };

  useEffect(resetAuthorsWithID, [authors]);

  // eslint-disable-next-line
    const removeAuthor = (authorID) => {
    const leftAuthors = authorsWithID.filter(
      (author) => author.id !== authorID,
    );
    setAuthorsWithID(leftAuthors);
  };

  // eslint-disable-next-line
    const addAuthor = (e) => {
    let newAuthors = authorsWithID.map((data) => data.author);
    newAuthors = [...newAuthors, ''];
    setAuthors(newAuthors);
    const newAuthorsWithID = [
      ...authorsWithID,
      {
        id: Math.floor(Math.random() * 10000),
        author: '',
      },
    ];
    setAuthorsWithID(newAuthorsWithID);
  };

  // eslint-disable-next-line
    const [shouldFetch, setShouldFetch] = useState(0);
  const [shouldRender, setShouldRender] = useState(false);
  const [fetchLogisticsResponse, setFetchLogisticsResponse] = useState({
    data: null,
    loading: true,
    error: null,
  });
  const [menuCourseItems, setMenuCourseItems] = useState(null);
  // eslint-disable-next-line
    const [responseSave, setResponseSave] = useState({
    data: null,
    loading: false,
    error: null,
  });
  const [successBannerMessage, setSuccessBannerMessage] = useState('');
  const [successBannerFade, setSuccessBannerFade] = useState(false);
  const [errorBannerMessage, setErrorBannerMessage] = useState('');
  const [errorBannerFade, setErrorBannerFade] = useState(false);
  const [errorName, setErrorName] = useState(false);
  const [errorNameText, setErrorNameText] = useState('');
  const [errorNumConvos, setErrorNumConvos] = useState(false);
  const [errorNumConvosText, setErrorNumConvosText] = useState('');
  const [errorCourses, setErrorCourses] = useState(false);
  const [currentCourses, setCurrentCourses] = useState([]);
  const [scenarioName, setScenarioName] = useState('');
  const [numConvos, setNumConvos] = useState(0);
  const [isPublic, setIsPublic] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [isDemo, setIsDemo] = useState(false);

  // For Banners
  useEffect(() => {
    const timeout = setTimeout(() => {
      setSuccessBannerFade(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [successBannerFade]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setErrorBannerFade(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [errorBannerFade]);

  const handleOnChangePublic = (event) => {
    setGlobalUnsaved(true);
    setIsPublic(event.target.checked);
    setEdit({ ...NewScenario, PUBLIC: event.target.checked });
  };

  const handleOnChangeFinish = (event) => {
    setGlobalUnsaved(true);
    setIsFinished(event.target.checked);
    setEdit({ ...NewScenario, IS_FINISHED: event.target.checked });
  };

  const handleOnChangeDemo = (event) => {
    setGlobalUnsaved(true);
    setIsDemo(event.target.checked);
    setEdit({ ...NewScenario, DEMO_MODE: event.target.checked });
  };

  const handleOnChangeNumConvo = (event) => {
    setGlobalUnsaved(true);
    NewScenario.NUM_CONVERSATION = event.target.value;
    setNumConvos(event.target.value);
    setEdit(NewScenario);
  };

  const handleOnChange = (event) => {
    NewScenario.NAME = event.target.value;
    setGlobalUnsaved(true);
    setScenarioName(event.target.value);
    setEdit(NewScenario);
  };

  const updateSelectedClasses = (selectedClasses) => {
    // set new scenario courses to selected classes
    const sel = [];
    selectedClasses.map((element) => sel.push({ COURSE: element.COURSE, NAME: element.NAME }));
    NewScenario.COURSES = sel;
    setGlobalUnsaved(true);
    setCurrentCourses(sel);
    setEdit(NewScenario);
  };

  const makeNewCourses = (response) => {
    const sel = [];

    for (let i = 0; i < response.length; i++) {
      for (let j = 0; j < NewScenario.COURSES.length; j++) {
        if (response[i].NAME === NewScenario.COURSES[j].NAME) {
          sel.push(response[i]);
        }
      }
    }

    NewScenario.COURSES = sel;
    setCurrentCourses(sel);
    setEdit(NewScenario);
  };

  const [NewScenario, setEdit] = useState({
    SCENARIO: 0,
    VERSION: null,
    NAME: '',
    PUBLIC: false,
    NUM_CONVERSATION: 0,
    PROFESSOR: 0,
    IS_FINISHED: false,
    DEMO_MODE: false,
    DATE_CREATED: ' ',
    COURSES: [],
  });

  const getData = () => {
    function onSuccess(response) {
      NewScenario.SCENARIO = response.data.SCENARIO;
      NewScenario.VERSION = response.data.VERSION;
      NewScenario.NAME = response.data.NAME;
      NewScenario.PUBLIC = response.data.PUBLIC;
      NewScenario.NUM_CONVERSATION = response.data.NUM_CONVERSATION;
      NewScenario.PROFESSOR = response.data.PROFESSOR;
      NewScenario.IS_FINISHED = response.data.IS_FINISHED;
      NewScenario.DEMO_MODE = response.data.DEMO_MODE;
      NewScenario.DATE_CREATED = response.data.DATA_CREATED;
      NewScenario.COURSES = response.data.COURSES;
      setScenarioName(response.data.NAME);
      setIsFinished(response.data.IS_FINISHED);
      setIsDemo(response.data.DEMO_MODE);
      setIsPublic(response.data.PUBLIC);
      setNumConvos(response.data.NUM_CONVERSATION);
      setEdit(NewScenario);
      getCourses();
    }

    // code for implementing authors
    /*
     Authors
                </form>

                {authorsWithID.map((data) => (
                    <Author
                        key={data.id}
                        id={data.id}
                        removeAuthor={removeAuthor}
                        author={data.author}
                        listOfAuthors={authorsWithID}
                        setListOfAuthors={setAuthorsWithID}
                    />
                ))}
                <Button variant="contained" color="primary" onClick={addAuthor}>
                    Add Author
                </Button>

        */

    function onFailure() {
      // GET request failed, loading animation should end
      setFetchCourseResponse({
        data: null,
        loading: false,
        error: null,
      });
    }

    // Smooth loading animation, loading animation will not reset during both GET requests (GET logistics and GET courses)
    setFetchCourseResponse({
      data: null,
      loading: true,
      error: null,
    });
    get(
      setFetchLogisticsResponse,
      endpointGetLogistics + id,
      onFailure,
      onSuccess,
    );
  };

  let getCourses = () => {
    function onSuccessCourse(response) {
      setMenuCourseItems(response.data);
      makeNewCourses(response.data);
      setShouldRender(true);
    }

    function onFailureCourse() {
      setErrorBannerMessage('Failed to save! Please try again.');
      setErrorBannerFade(true);
    }
    get(
      setFetchCourseResponse,
      endpointGetCourses,
      onFailureCourse,
      onSuccessCourse,
    );
  };

  useEffect(getData, [shouldFetch]);

  const handleSave = () => {
    function onSuccessLogistic(response) {
      setGlobalUnsaved(false);
      setSuccessBannerMessage('Successfully Saved!');
      setSuccessBannerFade(true);
    }

    function onFailureLogistic() {
      setErrorBannerMessage('Failed to save! Please try again.');
      setErrorBannerFade(true);
    }

    let validInput = true;

    if (!NewScenario.NAME || !NewScenario.NAME.trim()) {
      setErrorName(true);
      setErrorNameText('Scenario name cannot be empty');
      validInput = false;
    } else if (NewScenario.NAME.length >= 1000) {
      setErrorName(true);
      setErrorNameText(
        'Scenario name must have less than 1000 characters',
      );
      validInput = false;
    } else {
      setErrorName(false);
    }

    if (
      isNaN(NewScenario.NUM_CONVERSATION)
            || NewScenario.NUM_CONVERSATION === ''
    ) {
      setErrorNumConvos(true);
      setErrorNumConvosText(
        'Max Number of Conversations Must Be A Number',
      );
      validInput = false;
    } else {
      setErrorNumConvos(false);
    }

    if (NewScenario.COURSES.length === 0) {
      setErrorCourses(true);
      validInput = false;
    } else {
      setErrorCourses(false);
    }

    if (validInput) {
      put(
        setResponseSave,
        endPointPut,
        onFailureLogistic,
        onSuccessLogistic,
        NewScenario,
      );
    } else {
      setErrorBannerFade(true);
      setErrorBannerMessage(
        'There are currently errors within your page. Please fix all errors in order to save.',
      );
    }
  };

  if (fetchLogisticsResponse.error) {
    return (
      <div className={classes.errorContainer}>
        <ErrorBanner
          fade={errorBannerFade}
          errorMessage={errorBannerMessage}
        />
        <div className={classes.container}>
          <ErrorIcon className={classes.iconError} />
          <Typography align="center" variant="h3">
            Error in fetching scenario logistics.
          </Typography>
        </div>
        <div className={classes.container}>
          <Button
            variant="contained"
            color="primary"
            onClick={getData}
          >
            <RefreshIcon className={classes.iconRefreshLarge} />
          </Button>
        </div>
      </div>
    );
  }

  if (fetchCourseResponse.error) {
    return (
      <div className={classes.errorContainer}>
        <ErrorBanner
          fade={errorBannerFade}
          errorMessage={errorBannerMessage}
        />
        <div className={classes.container}>
          <ErrorIcon className={classes.iconError} />
          <Typography align="center" variant="h3">
            Error in fetching scenario courses.
          </Typography>
        </div>
        <div className={classes.container}>
          <Button
            variant="contained"
            color="primary"
            onClick={getData}
          >
            <RefreshIcon className={classes.iconRefreshLarge} />
          </Button>
        </div>
      </div>
    );
  }

  // Loading for both GET requests
  if (fetchLogisticsResponse.loading || fetchCourseResponse.loading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <div className={classes.bannerContainer}>
        <SuccessBanner
          fade={successBannerFade}
          successMessage={successBannerMessage}
        />
        <ErrorBanner
          fade={errorBannerFade}
          errorMessage={errorBannerMessage}
        />
      </div>
      <Container component="main">
        <div className={classes.container}>
          {/* MarginLeft to account for generic help button icon, centers the title */}
          <Typography
            align="center"
            variant="h2"
            style={{ marginLeft: '100px', width: '100%' }}
          >
            Logistics
          </Typography>
          <GenericHelpButton
            description={LogisticsHelpInfo}
            title="Logistics Help"
          />
        </div>
        {globalUnsaved && accessLevel !== 3 ? (
          <Typography variant="h6" align="center" color="error">
            Unsaved
          </Typography>
        ) : null}
        <form
          className={classes.textfields}
          noValidate
          autoComplete="off"
        >
          Simulation Title
          {errorName ? (
            <TextField
              error
              helperText={errorNameText}
              value={scenarioName}
              rows={1}
              onChange={handleOnChange}
            />
          ) : (
            <TextField
              value={scenarioName}
              rows={1}
              onChange={handleOnChange}
            />
          )}
          Courses
          {shouldRender ? (
            <Tags
              courses={menuCourseItems}
              current={currentCourses}
              update={updateSelectedClasses}
            />
          ) : null}
          {errorCourses ? (
            <Typography
              style={{ marginLeft: 15 }}
              variant="caption"
              display="block"
              color="error"
            >
              At least one course must be selected
            </Typography>
          ) : null}
          Max Number Of Selected Conversations
          {errorNumConvos ? (
            <TextField
              error
              helperText={errorNumConvosText}
              value={numConvos || ''}
              rows={1}
              onChange={handleOnChangeNumConvo}
            />
          ) : (
            <TextField
              value={numConvos || ''}
              rows={1}
              onChange={handleOnChangeNumConvo}
            />
          )}
          <Divider style={{ margin: '20px 0' }} />
        </form>

        <form style={{ marginLeft: -15, marginTop: 10 }}>
          <FormControlLabel
            control={(
              <Checkbox
                checked={isPublic}
                onChange={handleOnChangePublic}
                color="primary"
              />
                          )}
            label="Make Public"
            labelPlacement="start"
          />

          <FormControlLabel
            control={(
              <Checkbox
                checked={isFinished}
                onChange={handleOnChangeFinish}
                color="primary"
              />
                          )}
            label="Published"
            labelPlacement="start"
          />
          <FormControlLabel
            control={(
              <Checkbox
                checked={isDemo}
                onChange={handleOnChangeDemo}
                color="primary"
              />
                          )}
            label="Demo Mode"
            labelPlacement="start"
          />
        </form>
        <div className={classes.subdiv}>
          <form
            className={classes.buttons}
            noValidate
            autoComplete="off"
          />
        </div>

        <div className={classes.subdiv}>
          <form
            className={classes.buttons}
            noValidate
            autoComplete="off"
          >
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              disabled={accessLevel === 3}
            >
              Save Scenario Info
            </Button>
          </form>
        </div>
      </Container>
    </div>
  );
}
