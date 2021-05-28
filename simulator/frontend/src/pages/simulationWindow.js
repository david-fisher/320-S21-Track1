import React, { useState, createContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Grid, Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Stepper from './components/stepper';
import GenericPage from './genericPage';
import Reflection from './reflection';
import Action from './action';
import Stakeholders from './stakeholders';
import Feedback from './feedback';
import { STUDENT_ID } from '../constants/config';
import LoadingSpinner from './components/LoadingSpinner';
import get from '../universalHTTPRequestsEditor/get';
import post from '../universalHTTPRequestsEditor/post';
import ErrorBanner from './components/Banners/ErrorBanner';
import GlobalContext from '../Context/GlobalContext';

const useStyles = makeStyles((theme) => ({
  bannerContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
}));

export const GatheredInfoContext = createContext();

SimulationWindow.propTypes = {
  location: PropTypes.any,
};
export default function SimulationWindow(props) {
  const classes = useStyles();
  const location = useLocation();

  const pathArray = location.pathname.split('/');
  const scenarioID = props.location.data
    ? props.location.data.scenarioID
    : pathArray[pathArray.length - 2];
  const firstPage = props.location.data
    ? props.location.data.firstPage
    : pathArray[pathArray.length - 1];

  const numConversations = props.location.data
    ? props.location.data.numConversations
    : 3;
  // eslint-disable-next-line
  const [sessionID, setSessionID] = useState(-1); //TODO should not be hardcoded
  const scenarioPlayerContext = useState({ pages: [], activeIndex: 0 });
  const [playerContext, setPlayerContext] = scenarioPlayerContext;
  const endpointSess = `/scenarios/session/start?userId=${STUDENT_ID}&versionId=${scenarioID}`;
  const firstPageEndpoint = `/page?page_id=${firstPage}`;
  // eslint-disable-next-line
  const endpointGetMeta = "/scenarios?userId=" + STUDENT_ID;
  const [fetchScenariosResponse, setFetchScenariosResponse] = useState({
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
    }
    function onSuccess(response) {
      console.log(response);
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
      post(setFetchScenariosResponse, endpointSess, onFailure, startSess);
    }
    function onFailure() {
      setErrorBannerMessage('Failed to start session! Please try again.');
      setErrorBannerFade(true);
    }

    get(setFetchScenariosResponse, firstPageEndpoint, onFailure, onSuccess);
  };

  function getPageComponent(type, data, nextPageEndpoint, prevPageEndpoint) {
    switch (type) {
      case 'G':
        return (
          <GenericPage
            isIntro={false}
            pageID={data.PAGE}
            pageTitle={data.PAGE_TITLE}
            body={data.PAGE_BODY}
            getNextPage={getNextPage}
            getPrevPage={getPrevPage}
            nextPageEndpoint={nextPageEndpoint}
            prevPageEndpoint={prevPageEndpoint}
          />
        );
      case 'R':
        return (
          <Reflection
            scenarioID={scenarioID}
            pageID={data.PAGE}
            pageTitle={data.PAGE_TITLE}
            body={data.PAGE_BODY}
            questions={data.REFLECTION_QUESTIONS}
            getNextPage={getNextPage}
            getPrevPage={getPrevPage}
            nextPageEndpoint={nextPageEndpoint}
            prevPageEndpoint={prevPageEndpoint}
          />
        );
      case 'S':
        return (
          <Stakeholders
            scenarioID={scenarioID}
            pageID={data.PAGE}
            pageTitle={data.PAGE_TITLE}
            body={data.PAGE_BODY}
            getNextPage={getNextPage}
            getPrevPage={getPrevPage}
            nextPageEndpoint={nextPageEndpoint}
            prevPageEndpoint={prevPageEndpoint}
          />
        );
      case 'A':
        return (
          <Action
            sessionID={sessionID}
            scenarioID={scenarioID}
            pageID={data.PAGE}
            pageTitle={data.PAGE_TITLE}
            body={data.PAGE_BODY}
            choices={data.CHOICES}
            choiceChosen={data.choiceChosen}
            getNextPage={getNextPage}
            getPrevPage={getPrevPage}
            prevPageEndpoint={prevPageEndpoint}
          />
        );
      case 'F':
        return (
          <Feedback
            sessionID={sessionID}
            scenarioID={scenarioID}
            getPrevPage={getPrevPage}
            prevPageEndpoint={prevPageEndpoint}
          />
        );
      default:
    }
  }

  let getPrevPage = (prevPageEndpoint, pages) => {
    function onSuccess(response) {
      const { data } = response;
      const indexInPages = pages.findIndex((obj) => obj.id === data.PAGE);
      setPlayerContext((oldObj) => ({
        ...oldObj,
        activeIndex: indexInPages,
      }));
    }

    function onFailure() {
      setErrorBannerMessage('Failed to get page! Please try again.');
      setErrorBannerFade(true);
    }

    get(setFetchScenariosResponse, prevPageEndpoint, onFailure, onSuccess);
  };

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
      console.log(e);
      setErrorBannerMessage('Failed to get page! Please try again.');
      setErrorBannerFade(true);
    }
    get(setFetchScenariosResponse, nextPageEndpoint, onFailure, onSuccess);
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

  if (fetchScenariosResponse.loading) {
    return (
      <div>
        <div style={{ marginTop: '100px' }}>
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <GlobalContext.Provider value={scenarioPlayerContext}>
      <div className={classes.bannerContainer}>
        <ErrorBanner errorMessage={errorBannerMessage} fade={errorBannerFade} />
      </div>
      <Grid container spacing={2}>
        {/* <GatheredInfoContext.Provider value={infoIdsState}> */}
        <Grid item lg={3} md={2} sm={2}>
          <Stepper setActivePage={getPrevPage} />
        </Grid>
        <Grid item lg={8} md={8} sm={8}>
          <Box>
            {playerContext.pages[playerContext.activeIndex]
              && playerContext.pages[playerContext.activeIndex].component}
          </Box>
        </Grid>
        {/*
          <Grid container item lg={3} md={2} sm={2}>
            <Grid item lg={12}>
             <InfoGatheredList pages={pages}/>
            </Grid>
            <Grid item lg={12}>
            </Grid>
          </Grid>
        </GatheredInfoContext.Provider>
        */}
      </Grid>
    </GlobalContext.Provider>
  );
}
