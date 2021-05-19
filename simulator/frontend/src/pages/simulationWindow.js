import React, { useState, createContext, useEffect, useContext } from "react";
import { useLocation } from 'react-router-dom';
import {Grid, Typography, Box, Button} from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import Stepper from "./components/stepper.js";
import InfoGatheredList from "./components/gatheredList.js";
import Summary from "./summary.js";
import Conclusion from "./conclusion.js";
import GenericPage from "./genericPage.js";
import Reflection from "./reflection.js";
import Action from "./action.js";
import GatheredInformation from "./gatheredInformation.js";
import Stakeholders from "./stakeholders.js";
import Feedback from "./feedback.js";
import Radar from "./radarPlot.js";
import { ScenariosContext } from "../Nav.js";
import axios from "axios";
import {BACK_URL, STUDENT_ID, DEV_MODE, scenarioID} from "../constants/config";
import { useParams } from 'react-router-dom';
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

  let pathArray = location.pathname.split( '/' );
  const scenarioID = props.location.data
      ? props.location.data.version_id
      : pathArray[pathArray.length - 2];
  const firstPage = props.location.data
      ? props.location.data.first_page
      : pathArray[pathArray.length - 1];
  const versionID = scenarioID;

  //TODO endpoint that can filter scenarios by version/scenario ID
  /*  wait for endpoint that can filter scenarios by version/scenario ID
  if(!props.location.data) {
    function onSuccess(response) {
      console.log(response);
      let data = response.data.result[0];
      let next = response.data.result[0].next_page;
      let nextEndpoint = "/scenarios/task?versionId="+versionID+"&pageId="+next;
      setNextPageEndpoint(nextEndpoint);
      setActivePage(response.data.result[0]);
      let component = <Introduction pageTitle={data.page_title} body={data.body}/>;
      let newPage = {
        visited: false,
        completed: false,
        title: data.page_title,
        curPageEndpoint: firstPage,
        nextPageEndpoint: next,
        component,
      }
      console.log(newPage);
      setPages(oldArr => [...oldArr, newPage]);
    }
    function onFailure() {
      //setErrorBannerMessage('Failed to get scenarios! Please try again.');
      //setErrorBannerFade(true);
    }
    post(setFetchScenariosResponse, (endpointSess), onFailure, startSess);
    get(setFetchScenariosResponse, (endpointGet), onFailure, onSuccess);
  }
  */
  let numConversations = props.location.data ? props.location.data.num_conversation : 3;
  const [sessionID, setSessionID] = useState(-1); //TODO should not be hardcoded
  const scenarioPlayerContext = useState({pages: [], activeIndex: 0});
  const [playerContext, setPlayerContext] = scenarioPlayerContext;
  const endpointSess = '/scenarios/session/start?userId='+STUDENT_ID+'&versionId='+versionID
  const firstPageEndpoint = '/scenarios/task?versionId='+versionID+ '&pageId='+ firstPage;
  const endpointGetMeta = '/scenarios?userId=' + STUDENT_ID
  const { id } = useParams();
  const [fetchScenariosResponse, setFetchScenariosResponse] = useState({
    data: null,
    loading: false,
    error: false,
  });
  const [shouldFetch, setShouldFetch] = useState(0);

  let getFirstPage = () => {
    function startSess(response) {
      setSessionID(response.data.result.sessionId);
    }
    function onSuccess(response) {
      let data = response.data.result[0];
      let next = response.data.result[0].next_page;
      let nextEndpoint = "/scenarios/task?versionId="+versionID+"&pageId="+next;
      let component = <GenericPage isIntro={true} pageTitle={data.page_title} body={data.body} getNextPage={getNextPage} nextPageEndpoint={nextEndpoint}/>;
      let newPage = {
        visited: false,
        completed: false,
        title: data.page_title,
        pageEndpoint: firstPageEndpoint,
        nextPageEndpoint: nextEndpoint,
        component,
      }
      setPlayerContext(oldObj => {
        return {
          activeIndex: 0,
          pages: [...oldObj.pages, newPage]
        }
      });
    }
    function onFailure() {
      setErrorBannerMessage('Failed to get scenarios! Please try again.');
      setErrorBannerFade(true);
    }
    post(setFetchScenariosResponse, endpointSess, onFailure, startSess);
    get(setFetchScenariosResponse, firstPageEndpoint, onFailure, onSuccess);
  }

  let getPrevPage = (prevPageEndpoint, index, pages) => {

    function onSuccess(response) {
      let data = response.data.result[0];
      let next = response.data.result[0].next_page;
      let nextEndpoint = "/scenarios/task?versionId="+versionID+"&pageId="+next;
      setPlayerContext(oldObj => {
        return {
          ...oldObj,
          activeIndex: oldObj.activeIndex - 1,
        }
      });
    }

    function onFailure() {
      setErrorBannerMessage('Failed to get page! Please try again.');
      setErrorBannerFade(true);
    }

    get(setFetchScenariosResponse, prevPageEndpoint, onFailure, onSuccess);
  }

  console.log(playerContext.activeIndex);
  console.log(playerContext.pages);

  let getNextPage = (nextPageEndpoint, index, pages) => {
    console.log(index);
    function onSuccess(response) {
      let data = response.data.result[0];
      let next = response.data.result[0].next_page;
      let nextEndpoint = "/scenarios/task?versionId="+versionID+"&pageId="+next;
      let component = getPageComponent(data.page_type, data, nextEndpoint, pages[index].pageEndpoint);
      if(index === pages.length - 1) {
        let newPage = {
          visited: false,
          completed: false,
          title: data.page_title,
          pageEndpoint: nextPageEndpoint,
          nextPageEndpoint: nextEndpoint,
          component,
        }
        setPlayerContext(oldObj => {
          return {
            activeIndex: oldObj.activeIndex + 1,
            pages: [...oldObj.pages, newPage]
          }
        });
      } else {
        setPlayerContext(oldObj => {
        return {
          ...oldObj,
          activeIndex: oldObj.activeIndex + 1,
        }
      });
      }
    }

    function onFailure(e) {
      setErrorBannerMessage('Failed to get page! Please try again.');
      setErrorBannerFade(true);
    }

    get(setFetchScenariosResponse, nextPageEndpoint, onFailure, onSuccess);
  }

  function getPageComponent(type, data, nextPageEndpoint, prevPageEndpoint) {
    console.log(data);
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
                  questions={data.questions} 
                  getNextPage={getNextPage} 
                  getPrevPage={getPrevPage} 
                  nextPageEndpoint={nextPageEndpoint}
                  prevPageEndpoint={prevPageEndpoint}
                />;
      case "A":
        return <Action 
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
      default: 
    }
  }

  useEffect(getFirstPage, []);
  //useEffect(getFirstData, [shouldFetch]);

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
        {/*<GatheredInfoContext.Provider value={infoIdsState}>*/}
          <Grid item lg={3} md={2} sm={2}>
          {/*
            <Stepper activePage={activePage} pages={pages} setPages={setPages} setActivePage={setActivePage} key={activePage} />
          */}
          </Grid>
          <Grid item lg={6} md={8} sm={8}>
            <Box mb={6}>
              {playerContext.pages[playerContext.activeIndex] && playerContext.pages[playerContext.activeIndex].component}
            </Box>
          </Grid>
          <Grid container item lg={3} md={2} sm={2}>
            <Grid item lg={12}>
            
            {/* <InfoGatheredList pages={pages}/>*/}
            </Grid>
            <Grid item lg={12}>
            </Grid>
          </Grid>
        {/*</GatheredInfoContext.Provider>*/}
      </Grid>
    </GlobalContext.Provider>
  );
}
