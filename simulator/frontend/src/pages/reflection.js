import QA from "./components/q&a";
import {
  withStyles,
  Typography,
  Box,
  Grid,
  Button,
  makeStyles,
} from "@material-ui/core";
import { BACK_URL, STUDENT_ID, SCENARIO_ID }from "../constants/config";
import axios from 'axios';
import { ScenariosContext } from "../Nav";
import get from '../universalHTTPRequests/get';
import React,{useEffect,useState} from "react";
import TextField from '@material-ui/core/TextField';

const TextTypography = withStyles({
  root: {
    color: "#373a3c",
    whiteSpace: "pre-wrap",
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
}));

function Reflection({ pages, setPages, activePage, setActivePage,
  content_url, res_url,version_id, nextPageID, prevPageID , title}) {

  function goToPage(pageID) {
    if (pages[pageID].completed) {
      if (!pages[pageID].visited) {
        setPages((prevPages) => {
          let copy = { ...prevPages };
          copy[pageID].visited = true;
          return copy;
        });
      }
      setActivePage((prevPage) => pageID);
    }
  }

  const classes = useStyles();

  const [bodyText, setBodyText] = React.useState('');
  const [prompts, setPrompts] = React.useState([]);
  const [promptResponses, setPromptResponses] = React.useState({});
  const [scenarios, setScenarios] = React.useContext(ScenariosContext);

  // React.useEffect(() => {
  //   (async () => {
  //     await axios({
  //       method: 'get',
  //       url: BACK_URL + content_url,
  //       headers: {
  //         scenarioID: scenarios.currentScenarioID
  //       }
  //     }).then(response => {
  //       setBodyText(response.data.body_text);
  //       setPrompts(prev => response.data.prompts);
  //     }).catch(err => {
  //       console.log(err);
  //       alert(err);
  //     });

  //     axios({
  //       method: 'get',
  //       url: BACK_URL + res_url,
  //       headers: {
  //         scenarioID: scenarios.currentScenarioID,
  //         studentID: STUDENT_ID
  //       }
  //     }).then(response => {
  //       setPromptResponses(response.data.reduce((prev, curr) => {
  //         prev[curr.prompt_num] = curr.response;
  //         return prev;
  //       }, {}));
  //     }).catch(err => {
  //       console.log(err);
  //     });
  //   })();
  // }, [scenarios, activePage]);

  // async function handleResponse(data) {
  //   await axios({
  //     url: BACK_URL + content_url,
  //     method: 'put',
  //     data: {
  //       scenarioID: scenarios.currentScenarioID,
  //       studentID: STUDENT_ID,
  //       data: data
  //     }
  //   });
  // }

  // MAKE API CALL
  let pageId = parseInt(pages[activePage].pid)
  const endpointGet = '/scenarios/reflection?version_id=1'+'&page_id='+(pageId+1) // version id hardcoded

  const [reflection, setIntro] = useState({     //temporary array of reflection
    prompts: [],
    message: ""
  });
  
  const [fetchScenariosResponse, setFetchScenariosResponse] = useState({
    data: null,
    loading: false,
    error: false,
  });
  const [shouldFetch, setShouldFetch] = useState(0);

  //Get Reflection Page
  let getData = () => {
    function onSuccess(response) {
      // Right now hardcoded for initial action
      pages["initialAction"].pid = parseInt(pages[activePage].pid)+1 // Set next page id


      let ppage = response.data.body.map((data) => (data));
      let pp = {
        prompts: ppage,
        message: response.data.message
      }
      setIntro(pp);
      debugger;
    }

    function onFailure() {
      //setErrorBannerMessage('Failed to get scenarios! Please try again.');
      //setErrorBannerFade(true);
    }
    get(setFetchScenariosResponse, (endpointGet), onFailure, onSuccess);
  };


  useEffect(getData, [shouldFetch]);
  return (
    <div>
      <Grid container direction="row" justify="center" alignItems="center">
        <Box mt={5}>
          <TextTypography variant="h4" align="center" gutterBottom>
            {title}
          </TextTypography>
        </Box>
      </Grid>
      <Grid container direction="row" justify="space-between">
        <Grid item style={{ marginRight: "0rem", marginTop: "-3rem" }}>
          <Button
            variant="contained"
            disableElevation
            onClick={() => goToPage(prevPageID)}
          >
            Back
          </Button>
        </Grid>
        <Grid item style={{ marginRight: "0rem", marginTop: "-3rem" }}>
          <Button
            variant="contained"
            // disabled // Add to disable and enable buttons
            disableElevation
            color="primary"
            onClick={()=>goToPage(nextPageID)}
          >
            Next
          </Button>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item lg={12}>
          <TextTypography variant="h6" align="center" gutterBottom>
          {reflection.message}
          </TextTypography>
          
          {reflection.prompts.map(prompt => (
            <Box m="2rem" p={1} className={classes.textBox}>
              {/* <p>ID: {prompt.prompt_id}</p> */}
              <p>{prompt.prompt}</p>
              <TextField
                        style={{ width: 565 }}
                        id="outlined-multiline-static"
                        label="Answer"
                        multiline
                        variant="outlined"

                />
            </Box>
          ))}
          <Grid container justify="center" alignItems="center" >
            <Button
              variant="contained"
              color='primary'
              justify='right'
              // onClick={} TODO ---> add post function
            >
              Save answers
            </Button> 
          </Grid>
            {/* <QA header={bodyText} questions={prompts} handleResponse={handleResponse}
              nextPage={() => goToPage(nextPageID)} pages={pages} nextPageName={nextPageID}
              prevResponses={promptResponses}/> */}
          
          <Grid container direction="row" justify="space-between">
            <Grid item style={{ marginLeft: "2rem", marginTop: "0rem" }}>
              {/* <Button
                variant="contained"
                color='primary'
                onClick={() => goToPage(prevPageID)} 
              >
                Accept project
              </Button> */}
            </Grid>
            <Grid item style={{ marginRight: "2rem", marginTop: "0rem" }}>
              {/* <Button
                variant="contained"
                color="primary"
                onClick= {() => goToPage(nextPageID)} 
              >
                Delay decision
              </Button> */}
            </Grid>
          </Grid>
          
        </Grid>
      </Grid>
    </div>
  );
}

export default Reflection;
