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
import post from '../universalHTTPRequests/post';
import React,{useEffect,useState} from "react";
import TextField from '@material-ui/core/TextField';
import RefreshIcon from '@material-ui/icons/Refresh';

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
  errorContainer: {
    marginTop: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  }
}));

function Reflection({ pages, setPages, activePage, setActivePage,
  content_url, res_url,version_id, nextPageID, prevPageID , title}) {

  function goToPage(pageID) {
    if (pages[activePage].pageNumber === Object.keys(pages).length){
      console.log("This is the last page!");
    }
    else if (!pages[pageID].visited) {
      setPages((prevPages) => {
        let copy = { ...prevPages };
        copy[pageID].visited = true;
        return copy;
      });
    }
    setActivePage((prevPage) => pageID);
  }

  const classes = useStyles();

  const [savedAnswers, setSavedAnswers] = React.useState(false);
  const [bodyText, setBodyText] = React.useState('');
  const [prompts, setPrompts] = React.useState([]);
  const [promptResponses, setPromptResponses] = React.useState({});
  const [scenarios, setScenarios] = React.useContext(ScenariosContext);

  // MAKE API CALL
  let pageId = activePage;
  const endpointGet = '/scenarios/reflection/response?versionId='+version_id+'&pageId='+(activePage)+'&userId=' + STUDENT_ID;

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
      //pages["initialAction"].pid = parseInt(pages[activePage].pid)+1 // Set next page id


      let ppage = response.data.body.map((data) => (data));
      let pp = {
        prompts: ppage,
        message: response.data.message
      }
      if(pp.prompts[0].response.length > 1){
        setSavedAnswers(true);
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
  
  const endpointPost = '/scenarios/reflection?versionId=' + version_id + '&pageId=' + activePage + '&userId=' + STUDENT_ID;
  
  let postData = () => {
    function onSuccess(response) {
      console.log(response);
    }

    function onFailure() {
      console.log('Error')
    }
    let data = {
      body: reflection.prompts
    }

    post(setFetchScenariosResponse, (endpointPost), onFailure, onSuccess, data)
    setSavedAnswers((cur) => true);
  }
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

  let updateResponse = (e, prompt_id) => {  
    setIntro( prev => {
    for(let i = 0; i < prev.prompts.length; ++i){ 
      if(prev.prompts[i].prompt_id === prompt_id){
        prev.prompts[i].response = e.target.value;
        break;
      }
    }
    return prev;
    })
  }

  return (
    <div>
      <Grid container direction="row" justify="center" alignItems="center">
        <Box mt={5}>
          <TextTypography variant="h4" align="center" gutterBottom>
            Reflection
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
            disabled={!savedAnswers}
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
                        defaultValue={prompt.response}
                        variant="outlined"
                        onChange={(e) => {updateResponse(e,prompt.prompt_id)}}
                />
            </Box>
          ))}
          <Grid container justify="center" alignItems="center" >
            <Button
              variant="contained"
              color='primary'
              justify='right'
              onClick={postData} 
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
