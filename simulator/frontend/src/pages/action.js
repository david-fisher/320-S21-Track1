import React,{useEffect,useState} from "react";
import { makeStyles, withStyles, Typography, Box, Button, Grid } from "@material-ui/core";
import Checkbox from "./components/checkbox";
import { BACK_URL, STUDENT_ID, SCENARIO_ID } from "../constants/config";
import axios from 'axios';
import { ScenariosContext } from "../Nav";
import HTMLRenderer from "./components/htmlRenderer";
import get from '../universalHTTPRequests/get';

// const useStyles = makeStyles((theme) => ({
//   root: {
//     backgroundColor: theme.palette.background.paper,
//     color: "#5b7f95"
//   },
// }));

const TextTypography = withStyles({
  root: {
    color: "#373a3c"
  }
})(Typography);

function Action({ pages, setPages, activePage, setActivePage, content_url, nextPageID, prevPageID, title }) {
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

  const [actionQuestion, setActionQuestion, setActionChoices] = React.useState('');
  const [questionID, setQuestionID] = React.useState('');
  const [scenarios, setScenarios] = React.useContext(ScenariosContext);

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
   let pageId = parseInt(pages[activePage].pid)
   const endpointGet = '/scenarios/action/prompt?versionId=1'+'&pageId='+(pageId+1) // version id hardcoded
 
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
   const [shouldFetch, setShouldFetch] = useState(0);
 
   //Get Reflection Page
   let getData = () => {
     function onSuccess(response) {
       // Right now hardcoded for middle reflection
       pages["middleReflection"].pid = parseInt(pages[activePage].pid)+4 // Set next page id
 
       
       let ppage = ({
          page_id: response.data.result.page_id,
          page_type: response.data.result.page_type,
          page_title: response.data.result.page_type,
          version_id: response.data.result.version_id,
          body: response.data.result.body,
          choices: response.data.result.choices
         
       })
       let pp = {
        data: ppage
       }
       setAction(ppage);
       debugger;
     }
 
     function onFailure() {
       //setErrorBannerMessage('Failed to get scenarios! Please try again.');
       //setErrorBannerFade(true);
     }
     get(setFetchActionResponse, (endpointGet), onFailure, onSuccess);
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
          <Button variant="contained" disableElevation onClick={() => goToPage(prevPageID)}>Back</Button>
        </Grid>
        <Grid item style={{ marginRight: "0rem", marginTop: "-3rem" }}>
          <Button variant="contained" disableElevation color="primary" onClick={() => goToPage(nextPageID)} >Next</Button>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item lg={12}>
          {/* {action.data.map(d =>( */}
            <TextTypography variant="h6" align="center" gutterBottom>
                {action.body}
              </TextTypography>
            <Box m="2rem">
            {action.choices.map((choice) => (
              <Button
                variant="contained"
                color='primary'
                // onClick={} // save choice and do something According to this choice
              >
                {choice.choice_text}
              </Button> 

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