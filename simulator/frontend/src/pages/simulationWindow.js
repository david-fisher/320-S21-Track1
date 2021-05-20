import React, { useState, createContext, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import {Grid, Box,} from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import Stepper from "./components/stepper.js";
import GenericPage from "./genericPage.js";
import Reflection from "./reflection.js";
import Action from "./action.js";
import Stakeholders from "./stakeholders.js";
import Feedback from "./feedback.js";
import {STUDENT_ID} from "../constants/config";
import LoadingSpinner from './components/LoadingSpinner';
import get from '../universalHTTPRequests/get';
import post from '../universalHTTPRequests/post';
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

export default function SimulationWindow(props) {
  const classes = useStyles();
  const location = useLocation();

  const pathArray = location.pathname.split( '/' );
  const scenarioID = props.location.data
      ? props.location.data.version_id
      : pathArray[pathArray.length - 2];
  const firstPage = props.location.data
      ? props.location.data.first_page
      : pathArray[pathArray.length - 1];
  const versionID = scenarioID;

  const numConversations = props.location.data ? props.location.data.num_conversations : 3;
  // eslint-disable-next-line
  const [sessionID, setSessionID] = useState(-1); //TODO should not be hardcoded
  const scenarioPlayerContext = useState({pages: [], activeIndex: 0});
  const [playerContext, setPlayerContext] = scenarioPlayerContext;
  const endpointSess = `/scenarios/session/start?userId=${STUDENT_ID}&versionId=${versionID}`
  const firstPageEndpoint = `/scenarios/task?versionId=${versionID }&pageId=${ firstPage}`;
  // eslint-disable-next-line
  const endpointGetMeta = '/scenarios?userId=' + STUDENT_ID
  const [fetchScenariosResponse, setFetchScenariosResponse] = useState({
    data: null,
    loading: false,
    error: false,
  });
  const getFirstPage = () => {
    function startSess(response) {
      setPlayerContext(oldObj => ({
          numConversations,
          sessionID: response.data.result.sessionId,
          activeIndex: 0,
          pages: []
        }));
      get(setFetchScenariosResponse, firstPageEndpoint, onFailure, onSuccess);
    }
    function onSuccess(response) {
      const data = response.data.result[0];
      const next = response.data.result[0].next_page;
      const nextEndpoint = `/scenarios/task?versionId=${versionID}&pageId=${next}`;
      const component = <GenericPage isIntro sessionID={sessionID} pageTitle={data.page_title} body={data.body} getNextPage={getNextPage} nextPageEndpoint={nextEndpoint}/>;
      const newPage = {
        visited: false,
        completed: false,
        id: data.page_id,
        title: data.page_title,
        pageEndpoint: firstPageEndpoint,
        nextPageEndpoint: nextEndpoint,
        component,
      }
      setPlayerContext(oldObj => ({
          ...oldObj,
          pages: [...oldObj.pages, newPage]
        }));
    }
    function onFailure() {
      setErrorBannerMessage('Failed to get scenarios! Please try again.');
      setErrorBannerFade(true);
    }
    post(setFetchScenariosResponse, endpointSess, onFailure, startSess);
  }

  function getPageComponent(type, data, nextPageEndpoint, prevPageEndpoint) {
    switch(type) {
      case "G":
        return <GenericPage 
                  isIntro={false} 
                  pageTitle={data.page_title} 
                  body={data.body} 
                  getNextPage={getNextPage} 
                  getPrevPage={getPrevPage} 
                  nextPageEndpoint={nextPageEndpoint}
                  prevPageEndpoint={prevPageEndpoint}
                />;
      case "R":
        return <Reflection 
                  versionID={versionID} 
                  pageID={data.page_id} 
                  pageTitle={data.page_title} 
                  body={data.body} 
                  questions={data.questions} 
                  getNextPage={getNextPage} 
                  getPrevPage={getPrevPage} 
                  nextPageEndpoint={nextPageEndpoint}
                  prevPageEndpoint={prevPageEndpoint}
                />;
      case "S": 
        return <Stakeholders
                  versionID={versionID} 
                  pageID={data.page_id} 
                  pageTitle={data.page_title} 
                  body={data.body} 
                  getNextPage={getNextPage} 
                  getPrevPage={getPrevPage} 
                  nextPageEndpoint={nextPageEndpoint}
                  prevPageEndpoint={prevPageEndpoint}
                />;
      case "A":
        return <Action 
                  sessionID={sessionID}
                  versionID={versionID} 
                  pageID={data.page_id} 
                  pageTitle={data.page_title} 
                  body={data.body} 
                  choices={data.choices} 
                  choiceChosen={data.choiceChosen}
                  getNextPage={getNextPage} 
                  getPrevPage={getPrevPage} 
                  prevPageEndpoint={prevPageEndpoint}
                />;
      case "F":
        return <Feedback 
                  sessionID={sessionID}
                  versionID={versionID} 
                  getPrevPage={getPrevPage} 
                  prevPageEndpoint={prevPageEndpoint}
              />
      default:
    }
  }

  let getPrevPage = (prevPageEndpoint, pages) => {

    function onSuccess(response) {
      const data = response.data.result[0];
      const indexInPages = pages.findIndex((obj) => obj.id === data.page_id);
      setPlayerContext(oldObj => ({
          ...oldObj,
          activeIndex: indexInPages,
        }));
    }

    function onFailure() {
      setErrorBannerMessage('Failed to get page! Please try again.');
      setErrorBannerFade(true);
    }

    get(setFetchScenariosResponse, prevPageEndpoint, onFailure, onSuccess);
  }

  let getNextPage = (nextPageEndpoint, index, pages) => {
    // Last page, show feedback page
    if(!nextPageEndpoint) {
      const component = getPageComponent("F", null, null, pages[index].pageEndpoint);
      const newPage = {
        visited: false,
        completed: false,
        title: "Feedback",
        id: -1,
        pageEndpoint: null,
        nextPageEndpoint: null,
        component,
      }
      const copy = [...pages, newPage];
      copy[index].completed = true;
      copy[index].visited = true;
      setPlayerContext(oldObj => ({
          ...oldObj,
          activeIndex: oldObj.activeIndex + 1,
          pages: copy,
        }));
      return;
    } 

    function onSuccess(response) {
      const data = response.data.result[0];
      const indexInPages = pages.findIndex((obj) => obj.id === data.page_id);
      if(indexInPages === -1) {
        const next = response.data.result[0].next_page;
        const nextEndpoint = !next || next <= 0  ? null: `/scenarios/task?versionId=${versionID}&pageId=${next}`;
        const component = getPageComponent(data.page_type, data, nextEndpoint, pages[index].pageEndpoint);
        const newPage = {
          visited: false,
          completed: false,
          title: data.page_title,
          id: data.page_id,
          pageEndpoint: nextPageEndpoint,
          nextPageEndpoint: nextEndpoint,
          component,
        }
        const copy = [...pages, newPage];
        copy[index].completed = true;
        copy[index].visited = true;
        setPlayerContext(oldObj => ({
            ...oldObj,
            activeIndex: oldObj.activeIndex + 1,
            pages: copy,
          }));
      } else {
        setPlayerContext(oldObj => ({
          ...oldObj,
          activeIndex: indexInPages,
        }));
      }
    }

    function onFailure(e) {
      setErrorBannerMessage('Failed to get page! Please try again.');
      setErrorBannerFade(true);
    }

    get(setFetchScenariosResponse, nextPageEndpoint, onFailure, onSuccess);
  }

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
          <ErrorBanner
              errorMessage={errorBannerMessage}
              fade={errorBannerFade}
          />
      </div>
      <Grid container spacing={2}>
        {/* <GatheredInfoContext.Provider value={infoIdsState}> */}
          <Grid item lg={3} md={2} sm={2}>
          <Stepper setActivePage={getPrevPage} />
          </Grid>
          <Grid item lg={6} md={8} sm={8}>
            <Box mb={6}>
              {playerContext.pages[playerContext.activeIndex] && playerContext.pages[playerContext.activeIndex].component}
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
