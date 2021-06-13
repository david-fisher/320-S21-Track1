import React, { useState, createContext, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import {
  Grid, Box, Typography, Button,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import RefreshIcon from '@material-ui/icons/Refresh';
import ErrorIcon from '@material-ui/icons/Error';
import PropTypes from 'prop-types';
import Stepper from '../components/stepper';
import GenericPage from '../components/SimulationWindowComponents/generic';
import Reflection from '../components/SimulationWindowComponents/reflection';
import Action from '../components/SimulationWindowComponents/action';
import Stakeholders from '../components/SimulationWindowComponents/stakeholders';
import Feedback from '../components/SimulationWindowComponents/feedback';
import { STUDENT_ID } from '../constants/config';
import LoadingSpinner from '../components/LoadingSpinner';
import get from '../universalHTTPRequestsEditor/get';
import post from '../universalHTTPRequestsSimulator/post';
import ErrorBanner from '../components/Banners/ErrorBanner';
import GlobalContext from '../Context/GlobalContext';

const useStyles = makeStyles((theme) => ({
  bannerContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  container: {
    '@media (max-width:800px)': {
      flexDirection: 'column',
    },
  },
  stepper: {
    '@media (max-width:800px)': {
      maxWidth: '100%',
      overflowX: 'scroll',
    },
  },
  content: {
    '@media (max-width:800px)': {
      maxWidth: '100%',
      padding: '5px',
    },
  },
  errorContainer: {
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

export const GatheredInfoContext = createContext();

SimulationWindow.propTypes = {
  location: PropTypes.any,
};
export default function SimulationWindow(props) {
  const classes = useStyles();
  const location = useLocation();
  const history = useHistory();
  // eslint-disable-next-line
  const pathArray = location.pathname.split('/');

  const scenarioID = props.location.data
    ? props.location.data.scenarioID
    : history.push('/dashboard'); // prevents users from manually inserting scenarioID - firstPage in URL
  const firstPage = props.location.data
    ? props.location.data.firstPage
    : history.push('/dashboard');

  const numConversations = props.location.data
    ? props.location.data.numConversations
    : 3;
  // eslint-disable-next-line
  const [sessionID, setSessionID] = useState(-1); //TODO should not be hardcoded
  const scenarioPlayerContext = useState({ pages: [], activeIndex: 0 });
  const [playerContext, setPlayerContext] = scenarioPlayerContext;

  const endpointSession = `/scenarios/session/start?userId=${STUDENT_ID}&scenarioId=${scenarioID}`;
  const firstPageEndpoint = `/page?page_id=${firstPage}`;

  // eslint-disable-next-line
  const endpointGetMeta = "/scenarios?userId=" + STUDENT_ID;
  const [fetchFirstPage, setFirstPage] = useState({
    data: null,
    loading: false,
    error: false,
  });
  // eslint-disable-next-line
  const [startSession, setStartSession] = useState({
    data: null,
    loading: false,
    error: false,
  });
  // eslint-disable-next-line
  const [startSessionPage, setStartSessionPage] = useState({
    data: null,
    loading: false,
    error: false,
  });

  // start overall session for scenario (if necessary) => start session time for page (if necessary) => get first page data
  const getFirstPage = () => {
    let sessionID;
    function startSess(resp) {
      setPlayerContext(() => ({
        numConversations,
        sessionID: resp.data.result.sessionId,
        activeIndex: 0,
        pages: [],
      }));
      sessionID = resp.data.result.sessionId;
      get(setFirstPage, firstPageEndpoint, onFailure, onSuccessGetFirstPage);
    }
    let data;
    let next;
    let nextEndpoint;
    let component;
    let newPage;
    function onSuccessGetFirstPage(resp) {
      data = resp.data;
      const endpointSessionPage = `/scenarios/sessiontimes/start?sessionId=${sessionID}&pageId=${data.PAGE}`;
      post(setStartSessionPage, endpointSessionPage, onFailure, onSuccessNewSession);
    }
    function onSuccessNewSession(resp) {
      next = data.NEXT_PAGE;
      nextEndpoint = `/page?page_id=${next}`;
      component = (
        <GenericPage
          isIntro
          sessionID={sessionID}
          pageTitle={data.PAGE_TITLE}
          body={data.PAGE_BODY}
          getNextPage={getNextPage}
          nextPageEndpoint={nextEndpoint}
        />
      );
      newPage = {
        visited: !!resp.data.result.endtime,
        completed: !!resp.data.result.endtime,
        id: data.PAGE,
        title: data.PAGE_TITLE,
        pageEndpoint: firstPageEndpoint,
        nextPageEndpoint: nextEndpoint,
        component,
      };
      setPlayerContext((oldObj) => ({
        ...oldObj,
        numConversations,
        activeIndex: 0,
        pages: [...oldObj.pages, newPage],
      }));
    }
    function onFailure() {
      setErrorBannerMessage('Failed to start session! Please try again.');
      setErrorBannerFade(true);
    }
    // This allows for a cleaner loading spinner animation (rather than being cut up)
    setStartSessionPage({
      data: null,
      loading: true,
      error: false,
    });
    post(setStartSession, endpointSession, null, startSess);
  };

  function getPageComponent(type, data, nextPageEndpoint, prevPageEndpoint) {
    switch (type) {
      case 'G':
        return (
          <GenericPage
            key={data.PAGE}
            isIntro={false}
            pageID={data.PAGE}
            pageTitle={data.PAGE_TITLE}
            body={data.PAGE_BODY}
            getNextPage={getNextPage}
            getPrevPage={getExistingPage}
            nextPageEndpoint={nextPageEndpoint}
            prevPageEndpoint={prevPageEndpoint}
          />
        );
      case 'R':
        return (
          <Reflection
            key={data.PAGE}
            scenarioID={scenarioID}
            pageID={data.PAGE}
            pageTitle={data.PAGE_TITLE}
            body={data.PAGE_BODY}
            questions={data.REFLECTION_QUESTIONS}
            getNextPage={getNextPage}
            getPrevPage={getExistingPage}
            nextPageEndpoint={nextPageEndpoint}
            prevPageEndpoint={prevPageEndpoint}
          />
        );
      case 'S':
        return (
          <Stakeholders
            key={data.PAGE}
            scenarioID={scenarioID}
            pageID={data.PAGE}
            pageTitle={data.PAGE_TITLE}
            body={data.PAGE_BODY}
            getNextPage={getNextPage}
            getPrevPage={getExistingPage}
            nextPageEndpoint={nextPageEndpoint}
            prevPageEndpoint={prevPageEndpoint}
          />
        );
      case 'A':
        return (
          <Action
            key={data.PAGE}
            sessionID={sessionID}
            scenarioID={scenarioID}
            pageID={data.PAGE}
            pageTitle={data.PAGE_TITLE}
            body={data.PAGE_BODY}
            choices={data.CHOICES}
            choiceChosen={data.choiceChosen}
            getNextPage={getNextPage}
            getPrevPage={getExistingPage}
            prevPageEndpoint={prevPageEndpoint}
          />
        );
      case 'F':
        return (
          <Feedback
            sessionID={sessionID}
            scenarioID={scenarioID}
            getPrevPage={getExistingPage}
            prevPageEndpoint={prevPageEndpoint}
          />
        );
      default:
    }
  }

  const getExistingPage = (index) => {
    setPlayerContext((oldObj) => ({
      ...oldObj,
      activeIndex: index,
    }));
  };

  // eslint-disable-next-line
  const [endSessionPage, setEndSessionPage] = useState({
    data: null,
    loading: false,
    error: false,
  });
  const [fetchNextPage, setNextPage] = useState({
    data: null,
    loading: false,
    error: false,
  });
  // End session Time => Get Page Data=> Start new Session Time for next page => Load page data
  let getNextPage = (nextPageEndpoint, index, pages, sessionID) => {
    // TODO Last page, show feedback page
    if (!nextPageEndpoint) {
      const component = getPageComponent(
        'F',
        null,
        null,
        pages[index].pageEndpoint,
      );
      const newPage = {
        visited: false,
        completed: false,
        title: 'Feedback',
        id: -1,
        pageEndpoint: null,
        nextPageEndpoint: null,
        component,
      };
      const copy = [...pages, newPage];
      copy[index].completed = true;
      copy[index].visited = true;
      setPlayerContext((oldObj) => ({
        ...oldObj,
        activeIndex: oldObj.activeIndex + 1,
        pages: copy,
      }));
      return;
    }

    let data;
    let next;
    let nextEndpoint;
    let component;
    let newPage;
    let copy;
    function onSuccess(resp) {
      data = resp.data;
      const indexInPages = pages.findIndex((obj) => obj.id === data.PAGE);
      if (indexInPages === -1) {
        const endpointSessionPage = `/scenarios/sessiontimes/start?sessionId=${sessionID}&pageId=${data.PAGE}`;
        post(setStartSessionPage, endpointSessionPage, onFailure, onSuccessNewSession);
      } else {
        setPlayerContext((oldObj) => ({
          ...oldObj,
          activeIndex: indexInPages,
        }));
      }
    }
    function onSuccessNewSession(resp) {
      next = data.NEXT_PAGE;
      nextEndpoint = !next || next <= 0
        ? null
        : `/page?page_id=${next}`;
      component = getPageComponent(
        data.PAGE_TYPE,
        data,
        nextEndpoint,
        pages[index].pageEndpoint,
      );
      newPage = {
        visited: !!resp.data.result.endtime,
        completed: !!resp.data.result.endtime,
        title: data.PAGE_TITLE,
        id: data.PAGE,
        pageEndpoint: nextPageEndpoint,
        nextPageEndpoint: nextEndpoint,
        component,
      };
      copy = [...pages, newPage];
      copy[index].completed = true;
      copy[index].visited = true;
      setPlayerContext((oldObj) => ({
        ...oldObj,
        activeIndex: oldObj.activeIndex + 1,
        pages: copy,
      }));
    }

    function onFailure(e) {
      setErrorBannerMessage('Failed to get page! Please try again.');
      setErrorBannerFade(true);
    }

    function onSuccessPost(resp) {
      get(setNextPage, nextPageEndpoint, onFailure, onSuccess);
    }
    const endpointEndSessionPage = `/scenarios/sessiontimes/end?sessionId=${sessionID}&pageId=${pages[index].id}`;
    if ((index + 1) < pages.length) {
      setPlayerContext((oldObj) => ({
        ...oldObj,
        activeIndex: oldObj.activeIndex + 1,
      }));
    } else {
      setStartSessionPage({
        ...startSessionPage,
        loading: true,
      });
      post(setEndSessionPage, endpointEndSessionPage, onFailure, onSuccessPost);
    }
  };

  useEffect(getFirstPage, []);

  const [errorBannerMessage, setErrorBannerMessage] = useState('');
  const [errorBannerFade, setErrorBannerFade] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setErrorBannerFade(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [errorBannerFade]);

  if (fetchFirstPage.error) {
    // TODO fix
    const onClick = fetchFirstPage.error ? getFirstPage : fetchNextPage.error ? getNextPage : getExistingPage;
    return (
      <div>
        <div className={classes.issue}>
          <ErrorIcon className={classes.iconError} />
          <Typography align="center" variant="h3">
            Error in fetching page data.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={onClick}
          >
            <RefreshIcon className={classes.iconRefreshLarge} />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <GlobalContext.Provider value={scenarioPlayerContext}>
      <div className={classes.bannerContainer}>
        <ErrorBanner errorMessage={errorBannerMessage} fade={errorBannerFade} />
      </div>
      <Grid container className={classes.container}>
        <Grid item xs={3} className={classes.stepper}>
          <Stepper setActivePage={getExistingPage} />
        </Grid>
        <Grid item xs={8} className={classes.content}>
          {(startSessionPage.loading || fetchNextPage.loading)
            ? (
              <div style={{ marginTop: '100px' }}>
                <LoadingSpinner />
              </div>
            )
            : (
              <Box>
                {playerContext.pages[playerContext.activeIndex]
              && playerContext.pages[playerContext.activeIndex].component}
              </Box>
            )}
        </Grid>
      </Grid>
    </GlobalContext.Provider>
  );
}
