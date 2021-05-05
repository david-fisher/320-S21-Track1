import React,{useEffect,useState} from "react";
import { makeStyles, withStyles, Typography, Box, Button, Grid } from "@material-ui/core";
import Checkbox from "./components/checkbox";
import { BACK_URL, STUDENT_ID, SCENARIO_ID } from "../constants/config";
import axios from 'axios';
import { ScenariosContext } from "../Nav";
import HTMLRenderer from "./components/htmlRenderer";
import Introduction from "./introduction.js";
import ProjectAssignment from "./projectAssignment.js";
import Reflection from "./reflection.js";
import Conclusion from "./conclusion.js";
import GatheredInformation from "./gatheredInformation.js";
import Stakeholders from "./stakeholders.js";
import RefreshIcon from '@material-ui/icons/Refresh';
import get from '../universalHTTPRequests/get';
import post from '../universalHTTPRequests/post';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    color: "#5b7f95"
  },
  errorContainer: {
    marginTop: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  }
}));

const TextTypography = withStyles({
  root: {
    color: "#373a3c"
  }
})(Typography);

function Action({ pages, setPages, activePage, numConversations, setActivePage, content_url, nextPageID, prevPageID, title }) {
  function goToPage(pageID) {
    if (!pages[pageID].visited) {
      setPages((prevPages) => {
        let copy = { ...prevPages };
        copy[pageID].visited = true;
        return copy;
      });
    }
    setActivePage((prevPage) => pageID);
  }

  const [actionQuestion, setActionQuestion, setActionChoices] = React.useState('');
  const [questionID, setQuestionID] = React.useState('');
  const [scenarios, setScenarios] = React.useContext(ScenariosContext);
  const [nextPage, setNextPage] = React.useState(-1);
  const [chosenAction, setChosenAction] = React.useState(-1);

  // useEffect(() => {
  //   // backend call
  //   (async () => {
  //     axios({
  //       method: 'get',
  //       url: BACK_URL + content_url,
  //       headers: {
  //         scenarioID: scenarios.currentScenarioID,
  //         studentID: STUDENT_ID,
  //       }
  //     }).then(response => {
  //       console.log(response);
  //       if (scenarios.currentScenarioID == 1)
  //       {
  //         setActionQuestion(text => response.data[0].question);
  //         setQuestionID(id => response.data[0].option_id);
  //       }
  //       if (scenarios.currentScenarioID == 2){
  //         setActionQuestion(text => response.data[1].question);
  //         setQuestionID(id => response.data[1].option_id);
  //       }
  //     }).catch((err)=>{
  //       console.log("err",err);
  //       //alert(err);
  //     });
  //   })();
  // }, [scenarios]);

  // async function handleResponse(data) {
  //   const request_data = {}
  //   console.log("Question ID's " + questionID);
  //   request_data[questionID[0].toString()] = data;
  //   await axios({
  //     url: BACK_URL + content_url,
  //     method: 'put',
  //     data: {
  //       scenarioID: scenarios.currentScenarioID,
  //       studentID: STUDENT_ID,
  //       data: request_data
  //     }
  //   });
  // }
   // MAKE API CALL
   let pageId = activePage
   const endpointGet = '/scenarios/action/prompt?versionId=1'+'&pageId='+(activePage)// version id hardcoded
   const endpointGet2 = '/scenarios/action?versionId='+1+'&pageId='+(activePage)+'&userId='+STUDENT_ID
   const endpointPost = '/scenarios/action?versionId=1'+'&pageId='+(activePage)
   const endpointSess = '/scenarios/session/start?userId='+STUDENT_ID+'&versionId=1'
 
   const [action, setAction] = useState({     //temporary array of reflection
    
    page_id: 0,
    page_type: "",
    page_title: "",
    version_id: 5,
    body: "",
    choices: []
    
   });
   
   const [fetchActionResponse, setFetchActionResponse] = useState({
     data: null,
     loading: false,
     error: false,
   });
   const [fetchScenariosResponse, setFetchScenariosResponse] = useState({
    data: null,
    loading: false,
    error: false,
  });
   const [shouldFetch, setShouldFetch] = useState(0);

   function onFailure() {
    //setErrorBannerMessage('Failed to get scenarios! Please try again.');
    //setErrorBannerFade(true);
  }

   function onSuccess2(response) {
      console.log(response.data)
      let npage = response.data.result.map((data) => (
        {
          next: data.next_page,
          type: data.page_type,
          title: data.page_title,
          id: data.page_id,
        }
      ));
      let next_html = (<Introduction activePage={npage[0].id}/>);
      if(npage[0].type === "PLAIN"){
        next_html = (<ProjectAssignment lastPage={1}/>);
      } else if (npage[0].type === "REFLECTION"){
        next_html = (<Reflection content_url="/scenarios/initialReflection" res_url="/scenarios/initialReflection/response" nextPageID={npage[0].next} prevPageID={activePage} title={npage.title}/>);
      } else if (npage[0].type === "STAKEHOLDERPAGE"){
        next_html = (<Stakeholders prevPageID={activePage} nextPageID={npage[0].next} numConversations={numConversations}/>);
      } else if (npage[0].type === "INITIALACTION" || npage[0].type === "FINALACTION"){
        next_html = (<Action numConversations={numConversations} activePage={npage[0].id} content_url="/scenarios/action" nextPageID={npage[0].next} prevPageID={activePage} title={npage.title}/>);
      } else if (npage[0].type === "CONCLUSION"){
        next_html = (<Conclusion prevPageID={activePage}/>);
      } else {
        next_html = (<Reflection activePage={npage[0].id} content_url="/scenarios/reflection" res_url="/scenarios/reflection/response" nextPageID="initialAction" prevPageID={activePage} title={npage.title}/>);
      }
      let len = Object.keys(pages).length
      let next_page = {
        visited: false,
        completed: false,
        title: npage[0].title,
        pageNumber: len+1,
        html: next_html
      }
      setPages((prevPages) => {
        let copy = { ...prevPages };
        copy[npage[0].id] = next_page;
        return copy;
      });
      if(npage[0].next !== undefined){
        let next = npage[0].next;
        let endpoint = "/scenarios/task?versionId=1&pageId=" + next;
        get(setFetchScenariosResponse, endpoint, onFailure, onSuccess2);
      }
    }
 
   //Get Action Page
   let getData = () => {
     function onSuccess(response) {
       // Right now hardcoded for middle reflection
       //pages["middleReflection"].pid = parseInt(pages[activePage].pid)+4 // Set next page id
       let ppage = ({
          page_id: response.data.result.page_id,
          page_type: response.data.result.page_type,
          page_title: response.data.result.page_title,
          version_id: response.data.result.version_id,
          body: response.data.result.body,
          choices: response.data.result.choices
       })
       let pp = {
        data: ppage
       }
       setAction(ppage);
       //check if we've already submitted an action for this scen
       get(setFetchScenariosResponse, (endpointGet2), onFailure, onSuccess1);
       debugger;
     }
     function onSuccess1(response) {
      // Right now hardcoded for middle reflection
      //pages["middleReflection"].pid = parseInt(pages[activePage].pid)+4 // Set next page id
      if(response.data.status == 200){
        setNextPage((cur) => response.data.result.next_page);
        setChosenAction((cur) => response.data.result.choice);
      }
      let endpoint = "/scenarios/task?versionId=1&pageId=" + response.data.result.next_page;
      get(setFetchScenariosResponse, endpoint, onFailure, onSuccess2)
    }
     get(setFetchActionResponse, (endpointGet), onFailure, onSuccess);
   };

   let getAction = (selectedAction) => {
    function startSess(response) {
      //do nothing
    }
    function onSuccess(response) {
      // Right now hardcoded for middle reflection
      //pages["middleReflection"].pid = parseInt(pages[activePage].pid)+4 // Set next page id
      let body = ({
         response_id: response.data.result.response_id,
         choice: response.data.result.choice,
         choice_text: response.data.result.choice_text,
         next: response.data.result.next_page,
      })
      console.log(body.next);
      setNextPage((cur) => body.next);
      setChosenAction((cur) => selectedAction);
      let endpoint = "/scenarios/task?versionId=1&pageId=" + body.next;
      get(setFetchActionResponse, endpoint, onFailure, onSuccess2);
    }
    function onFailure() {
      //setErrorBannerMessage('Failed to get scenarios! Please try again.');
      //setErrorBannerFade(true);
    }
    post(setFetchActionResponse, (endpointSess), onFailure, startSess)
    let body = {"choice_id" : selectedAction, "user_id" : STUDENT_ID};
    post(setFetchActionResponse, (endpointPost), onFailure, onSuccess, JSON.stringify(body));
   }
 

  const classes = useStyles();
 
  useEffect(getData, [shouldFetch]);

  if (fetchActionResponse.error) {
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
      <Grid container direction="row" justify="center" alignItems="center">
        <Box mt={5}>
          <TextTypography variant="h4" align="center" gutterBottom>
            {action.page_title}
          </TextTypography>
        </Box>
      </Grid>
      <Grid container direction="row" justify="space-between">
        <Grid item style={{ marginRight: "0rem", marginTop: "-3rem" }}>
          <Button variant="contained" disableElevation onClick={() => goToPage(activePage-1)}>Back</Button>
        </Grid>
        <Grid item style={{ marginRight: "0rem", marginTop: "-3rem" }}>
          <Button variant="contained" disableElevation disabled={nextPage === -1} color="primary" onClick={() => goToPage(nextPage)} >Next</Button>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item lg={12}>
          {/* {action.data.map(d =>( */}
            <TextTypography variant="h6" align="center" gutterBottom>
                {action.body}
              </TextTypography>
            <Box mx="auto">
            {action.choices.map((choice) => (
              <Box p={3}>
                <Button
                  variant={(choice.choices_id === chosenAction) ? "contained" : "outlined"}
                  color={(choice.choices_id === chosenAction) ? "secondary" : "primary"}
                  disabled={nextPage !== -1}
                  size="large"
                  onClick={() => getAction(choice.choices_id)} // save choice and do something According to this choice
                >
                  {choice.choice_text}
                </Button> 
              </Box>
            ))}

            </Box>
          {/* ))} */}
        </Grid>
        <Grid item lg={12}>
          {/* <Checkbox content_url = {content_url} nextPage={() => goToPage(nextPageID)} handleResponse={handleResponse} pages={pages} nextPageName={nextPageID} />  */}
        </Grid>
      </Grid>
    </div>
  );
}

export default Action;