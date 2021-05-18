import React,{useEffect,useState, useContext} from "react";
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
import TextField from '@material-ui/core/TextField';
import RefreshIcon from '@material-ui/icons/Refresh';
import createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import GlobalContext from '../Context/GlobalContext';

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

export default function Reflection({ pageTitle, body, questions, getNextPage, getPrevPage, nextPageEndpoint, prevPageEndpoint, versionID, pageID }) {
  const window = (new JSDOM('')).window;
  const DOMPurify = createDOMPurify(window);
  let [contextObj, setContextObj] = useContext(GlobalContext);

  questions = [
    {
      id: 1,
      page: 1,
      reflection_question: "What are your initial thoughts on autonomous cars?",
      response: "",
    },
    {
      id: 2,
      page: 1,
      reflection_question: "What are the ethical conundrums that comes to mind right away for you when you hear about autonomous cars?",
      response: "",
    }
  ]
  const classes = useStyles();

  const [savedAnswers, setSavedAnswers] = React.useState(false);
  const [bodyText, setBodyText] = React.useState('');
  const [prompts, setPrompts] = React.useState([]);
  const [promptResponses, setPromptResponses] = React.useState({});
  const [scenarios, setScenarios] = React.useContext(ScenariosContext);

  // MAKE API CALL
  let pageId = pageID;
  const endpointGet = '/scenarios/reflection/response?versionId='+versionID+'&pageId='+(pageID)+'&userId=' + STUDENT_ID;

  const [reflection, setReflection] = useState(questions);
  
  const [fetchScenariosResponse, setFetchScenariosResponse] = useState({
    data: null,
    loading: false,
    error: false,
  });
  const [shouldFetch, setShouldFetch] = useState(0);

  //Get Reflection Page
  let getData = () => {
    function onSuccess(response) {
      let ppage = response.data.body.map((data) => (data));
      let pp = {
        prompts: ppage,
        message: response.data.message
      }
      if(pp.prompts[0].response.length > 1){
        setSavedAnswers(true);
      }
      setReflection(pp);
      debugger;
    }

    function onFailure() {
      //setErrorBannerMessage('Failed to get scenarios! Please try again.');
      //setErrorBannerFade(true);
    }
    //get(setFetchScenariosResponse, (endpointGet), onFailure, onSuccess);
  };

  const endpointPost = '/scenarios/reflection?versionId=' + versionID + '&pageId=' + pageID + '&userId=' + STUDENT_ID;
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

    //TODO post(setFetchScenariosResponse, (endpointPost), onFailure, onSuccess, data)
    setSavedAnswers(true);
  }

  console.log(reflection);

  let updateResponse = (e,id) => {  
    setReflection(prev => {
    for(let i = 0; i < questions.length; ++i){ 
      if(questions[i].id === id){
        questions[i].response = e.target.value;
        break;
      }
    }
    return prev;
    })
  }

  const Buttons = (
    <Grid container direction="row" justify="space-between">
      <Grid item style={{ marginRight: "0rem", marginTop: "1rem" }}>
        <Button
          variant="contained"
          color="primary"
          disableElevation
          onClick={() => getPrevPage(prevPageEndpoint, contextObj.activeIndex, contextObj.pages)}
        >
          Back
        </Button>
      </Grid>
      <Grid item style={{ marginRight: "0rem", marginTop: "1rem" }}>
        <Button
          variant="contained"
          disabled={!savedAnswers}
          disableElevation
          color="primary"
          onClick={() => getNextPage(nextPageEndpoint, contextObj.activeIndex, contextObj.pages)}
        >
          Next
        </Button>
      </Grid>
    </Grid>
  );
  return (
    <div>
      {Buttons}
      <Grid container direction="row" justify="center" alignItems="center">
        <Box mt={5}>
          <TextTypography variant="h4" align="center" gutterBottom>
            {pageTitle}
          </TextTypography>
        </Box>
      </Grid>
      <Grid container spacing={2}>
        <Grid item lg={12}>
          { <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(body) }} /> }
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item lg={12}>         
          {questions.map(prompt => (
            <Box m="2rem" p={1} className={classes.textBox}>
              <p>{prompt.prompt}</p>
              <TextField
                style={{ width: 565 }}
                id="outlined-multiline-static"
                label="Answer"
                multiline
                defaultValue={prompt.response}
                variant="outlined"
                onChange={(e) => {updateResponse(e, prompt.id)}}
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
        </Grid>
      </Grid>
    </div>
  );
}
