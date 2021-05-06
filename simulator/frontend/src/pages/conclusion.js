import React, {useState, useEffect} from "react";
import { withStyles, Typography, Box, Grid, Button } from "@material-ui/core";
import QA from "./components/q&a";
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { BACK_URL, STUDENT_ID, SCENARIO_ID } from "../constants/config";
import { ScenariosContext } from "../Nav";
import post from '../universalHTTPRequests/post';


const TextTypography = withStyles({
  root: {
    color: "#373a3c"
  }
})(Typography);

const questions = [{text: "We would appreciate receiving any comments that you have on this online ethics simulation: ", id: 1}];

function Conclusion({pages, setPages, prevPageID, version_id, activePage, setActivePage}) {
  const [body,setBody] = useState('');
  const [scenarios, setScenarios] = React.useContext(ScenariosContext);
  const [fetchScenariosResponse, setFetchScenariosResponse] = useState({
    data: null,
    loading: false,
    error: false,
  });
  const [shouldFetch, setShouldFetch] = useState(0);

  // useEffect(() => {
  //   // backend call
  //   axios({
  //     method: 'get',
  //     url: BACK_URL + '/scenarios/conclusion',
  //     headers: {
  //       scenarioID: scenarios.currentScenarioID,
  //       studentID: STUDENT_ID,
  //     }
  //   }).then(response => {
  //     setBody(text => response.data[0].body_text);
  //   }).catch((err)=>{
  //     console.log("err",err);
  //     //alert(err);
  //   });
  // }, [scenarios])

  const endpointSess = '/scenarios/session/end?userId='+STUDENT_ID+'&versionId='+version_id

  let closeSession = () => {
    function onSuccess(response) {      
      //do nothing
    }

    function onFailure() {
      //setErrorBannerMessage('Failed to get scenarios! Please try again.');
      //setErrorBannerFade(true);
    }
    post(setFetchScenariosResponse, (endpointSess), onFailure, onSuccess);
  };


  function goToPrevPage(){
    if (!pages[prevPageID].visited) {
      setPages(prevPages => {
        let copy = {...prevPages};
        copy[prevPageID].visited = true;
        return copy;
      });
    }
    setActivePage(prevPage => prevPageID)
  }

  let history = useHistory();
  const goToHome = () => {
    closeSession();
    history.push('/');
  }

  return (
    <div>
      <Grid container direction="row" justify="center" alignItems="center">
        <Box mt = {5}>
          <TextTypography variant="h4" align="center" gutterBottom>
            Conclusion
          </TextTypography>
        </Box>
      </Grid>
      <Grid container direction="row" justify="space-between">
        <Grid item style={{ marginRight: "0rem", marginTop: "-3rem" }}>
          <Button variant="contained" disableElevation onClick={goToPrevPage}>Back</Button>
        </Grid>
        <Grid item style={{ marginRight: "0rem", marginTop: "-3rem" }}>
          {/*<Button variant="outlined">Next</Button>*/}
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item lg={12}>
          <Box m="2rem">
          </Box>
          <QA header={body} questions={questions}
            handleResponse={async (data) => console.log(data)}
            nextPage={goToHome} pages={pages} nextPageName={"home"}
            prevResponses={{}}/>
        </Grid>
      </Grid>
    </div>
  );
}

export default Conclusion;
