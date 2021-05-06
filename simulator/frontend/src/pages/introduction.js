import React,{useEffect,useState} from "react";
import {
  withStyles,
  Typography,
  Box,
  Grid,
  Button,
  makeStyles,
} from "@material-ui/core";
import { BACK_URL, STUDENT_ID, SCENARIO_ID } from "../constants/config";
import axios from 'axios';
import HTMLRenderer from './components/htmlRenderer';
import { ScenariosContext } from "../Nav";
import { GatheredInfoContext } from './simulationWindow';
import RefreshIcon from '@material-ui/icons/Refresh';
import get from '../universalHTTPRequests/get';


 
const TextTypography = withStyles({
  root: {
    color: "#373a3c",
    whiteSpace: "pre-line",
  },
})(Typography);

const useStyles = makeStyles((theme) => ({
  textBox: {
    overflowY: "auto",
    maxHeight: window.innerHeight * 0.6,
    marginTop: theme.spacing(4),
    borderRadius: "5px",
    boxShadow: "0px 0px 2px",
  },
  errorContainer: {
    marginTop: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  }
}));

function Introduction({ pages, setPages, activePage, setActivePage, version_id,first_page}) {

  const [gatheredInfo, setGatheredInfo] = React.useContext(GatheredInfoContext);
  const [scenarios, setScenarios] = React.useContext(ScenariosContext);
  
  const endpointGet = '/scenarios/task?versionId='+version_id+'&pageId='+activePage // Version hardcoded

  const [intro, setIntro] = useState({     //temporary array of intro
    intro_page: [{
      title: " ",
      body: " ",
      next: 2,
    }]
  });

  const [fetchScenariosResponse, setFetchScenariosResponse] = useState({
    data: null,
    loading: false,
    error: false,
  });
  const [shouldFetch, setShouldFetch] = useState(0);

  //Get Intro Page
  let getData = () => {
    function onSuccess(response) {      
      let ipage = response.data.result.map((data) => (
        {
          title: data.page_title,
          body: data.body,
          next: data.next_page,
        }
      ));
      let ip = {
        intro_page: ipage,
      }
      setIntro(ip);
      debugger;
    }

    function onFailure() {
      //setErrorBannerMessage('Failed to get scenarios! Please try again.');
      //setErrorBannerFade(true);
    }
    get(setFetchScenariosResponse, (endpointGet), onFailure, onSuccess);
  };




  function goToNextPage() {
    if (!pages[intro.intro_page[0].next].visited) {
      setPages((prevPages) => {
        let copy = { ...prevPages };
        copy[activePage].completed = true;
        copy[intro.intro_page[0].next].visited = true;
        return copy;
      });
      setGatheredInfo(infos => {
        let newInfos = [...infos];
        newInfos.push({id: 'page', name: intro.intro_page[0].title, pageId: activePage});
        return newInfos;
      });
    }
    setActivePage((prevPage) => intro.intro_page[0].next);
  }

  const [introText, setIntroText] = React.useState('');
  
  const classes = useStyles();
  

  useEffect(getData, [shouldFetch]);
  

  if (fetchScenariosResponse.error) {
    return (
      <div className={classes.errorContainer}>
        <Box mt={5}>
          <Grid container direction="row" justify="center" alignItems="center">
            <TextTypography variant="h4" align="center" gutterBottom>
              Error fetching scenario data.
            </TextTypography>
          </Grid>
        </Box>
        <Button
          variant="contained"
          color="primary"
          onClick={getData}
        >
          <RefreshIcon className={classes.iconRefreshLarge} />
        </Button>
      </div>)
  }

  return (
    <div>
      <Box mt={5}>
        <Grid container direction="row" justify="center" alignItems="center">
          <TextTypography variant="h4" align="center" gutterBottom>
            {intro.intro_page[0].title}
          </TextTypography>
        </Grid>
      </Box>
      <Grid container direction="row" justify="space-between">
        <Grid
          item
          style={{
            marginLeft: "0rem",
            marginRight: "0rem",
            marginTop: "-3rem",
          }}
        >
          {/*  <Button>Back</Button>*/}
        </Grid>
        <Grid item style={{ marginRight: "0rem", marginTop: "-3rem" }}>
            <Button
              variant="contained"
              disableElevation
              color="primary"
              onClick={goToNextPage}
            >
              Next
            </Button>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item lg={12}>
          {intro.intro_page.map(page => (
            <Box p={2} className={classes.textBox}>
              <p>{page.body}</p>
            </Box>
          ))}
        </Grid>
      </Grid>
    </div>
  );
}

export default Introduction;
