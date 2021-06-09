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
import GenericPage from './genericPage';
import Reflection from './reflection';
import Action from './action';
import Stakeholders from './stakeholders';
import Feedback from './feedback';
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
  const endpointSess = `/scenarios/session/start?userId=${STUDENT_ID}&scenarioId=${scenarioID}`;
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
  const getFirstPage = () => {
    function startSess(response) {
      setPlayerContext(() => ({
        numConversations,
        sessionID: response.data.result.sessionId,
        activeIndex: 0,
        pages: [],
      }));
      get(setFirstPage, firstPageEndpoint, onFailure, onSuccess);
    }
    function onSuccess(response) {
      const { data } = response;
      const next = data.NEXT_PAGE;
      const nextEndpoint = `/page?page_id=${next}`;
      const component = (
        <GenericPage
          isIntro
          sessionID={sessionID}
          pageTitle={data.PAGE_TITLE}
          body={data.PAGE_BODY}
          getNextPage={getNextPage}
          nextPageEndpoint={nextEndpoint}
        />
      );
      const newPage = {
        visited: false,
        completed: false,
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
    setFirstPage({
      data: null,
      loading: true,
      error: false,
    });
    post(setStartSession, endpointSess, null, startSess);
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

  const [fetchNextPage, setNextPage] = useState({
    data: null,
    loading: false,
    error: false,
  });
  let getNextPage = (nextPageEndpoint, index, pages) => {
    // Last page, show feedback page
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

    function onSuccess(response) {
      const { data } = response;
      const indexInPages = pages.findIndex((obj) => obj.id === data.PAGE);
      if (indexInPages === -1) {
        const next = data.NEXT_PAGE;
        const nextEndpoint = !next || next <= 0
          ? null
          : `/page?page_id=${next}`;
        const component = getPageComponent(
          data.PAGE_TYPE,
          data,
          nextEndpoint,
          pages[index].pageEndpoint,
        );
        const newPage = {
          visited: false,
          completed: false,
          title: data.PAGE_TITLE,
          id: data.PAGE,
          pageEndpoint: nextPageEndpoint,
          nextPageEndpoint: nextEndpoint,
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
      } else {
        setPlayerContext((oldObj) => ({
          ...oldObj,
          activeIndex: indexInPages,
        }));
      }
    }

    function onFailure(e) {
      setErrorBannerMessage('Failed to get page! Please try again.');
      setErrorBannerFade(true);
    }

    if ((index + 1) < pages.length) {
      setPlayerContext((oldObj) => ({
        ...oldObj,
        activeIndex: oldObj.activeIndex + 1,
      }));
    } else {
      get(setNextPage, nextPageEndpoint, onFailure, onSuccess);
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
          {(fetchFirstPage.loading || fetchNextPage.loading)
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
