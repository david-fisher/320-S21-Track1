import React, { useState, createContext, useEffect, useContext } from "react";
import { useLocation } from 'react-router-dom';
import {Grid, Typography, Box, Button} from "@material-ui/core";
import Stepper from "./components/stepper.js";
import InfoGatheredList from "./components/gatheredList.js";
import Summary from "./summary.js";
import Conclusion from "./conclusion.js";
import Introduction from "./introduction.js";
import ProjectAssignment from "./projectAssignment.js";
import Reflection from "./reflection.js";
import Action from "./action.js";
import GatheredInformation from "./gatheredInformation.js";
import Stakeholders from "./stakeholders.js";
import Feedback from "./feedback.js";
import Radar from "./radarPlot.js";
import { ScenariosContext } from "../Nav.js";
import axios from "axios";
import {BACK_URL, STUDENT_ID, DEV_MODE, SCENARIO_ID} from "../constants/config";
import { useParams } from 'react-router-dom';
import get from '../universalHTTPRequests/get';


export const GatheredInfoContext = createContext();

function SimulationWindow(props) {
  const location = useLocation();
  //console.log(props.location.data)
  // let scenario_id = location.pathname.split('/').pop();
  const scenario_id = props.location.data
      ? props.location.data.version_id
      : location.pathname.split('/').pop();
  const version_id = scenario_id;

  
  const [activePage, setActivePage] = useState("2");
  let numConversations = 0;
  const [pages, setPages] = useState({
    2: { visited: true, completed: true, title: "Introduction", pageNumber: 1, html: (<Introduction />) },
    // projectAssignment: { visited: false, completed: true, pageNumber: 1, pid:0, html: (<ProjectAssignment />) },
    // initialReflection: { visited: false, completed: true, pageNumber: 2, pid:0, html: (<Reflection
    //   content_url="/scenarios/initialReflection" res_url="/scenarios/initialReflection/response" nextPageID="initialAction" prevPageID="projectAssignment" title="Reflect on Initial Information"/>) },
    // initialAction: { visited: false, completed: true, pageNumber: 3, pid:0, html: (<Action
    //   content_url="/scenarios/initialAction" nextPageID="gatheredInformation" prevPageID="initialReflection" title="Initial Action"/>) },
    // gatheredInformation: { visited: false, completed: false, pageNumber: 4, pid:0, html: (<GatheredInformation />) },
    // stakeholders: { visited: false, completed: true, pageNumber: 5,pid:0, html: (<Stakeholders />) },
    // middleReflection: { visited: false, completed: true, pageNumber: 6,pid:0, html: (<Reflection
    //   content_url="/scenarios/middleReflection" res_url="/scenarios/middleReflection/response"
    //   nextPageID="finalAction" prevPageID="stakeholders" title="Reflect on Stakeholder Information"/>) },
    // finalAction: { visited: false, completed: true, pageNumber: 7,pid:0, html: (<Action
    //   content_url="/scenarios/FinalAction" nextPageID="summary" prevPageID="middleReflection" title="Final Action"/>) },
    // summary: { visited: false, completed: false, pageNumber: 8,pid:0, html: (<Summary />) },
    // feedback: { visited: false, completed: true, pageNumber: 9,pid:0, html: (<Feedback />) },
    // finalReflection: { visited: false, completed: true, pageNumber: 10,pid:0, html: (<Reflection
    //   content_url="/scenarios/finalReflection" res_url="/scenarios/finalReflection/response"
    //   nextPageID="conclusion" prevPageID="feedback" title="Reflect on Final Information"/>) },
    // conclusion:  { visited: false, completed: false, pageNumber: 11,pid:0, html: (<Conclusion />) 
    // issueCoverage: {visited: false, completed: true, pageNumber: 12, pid:0, html: (<Radar />)}
  });

  const endpointGet = '/scenarios/task?versionId='+version_id+'&pageId='+activePage
  const endpointGetMeta = '/scenarios?userId=' + STUDENT_ID
  const infoIdsState = useState([]);
  const [scenarios, setScenarios] = useContext(ScenariosContext);
  const { id } = useParams();

  // // Asynchronously initialize infoIdsState and scenarios
  // useEffect(() => {
  //   // placeholder async function until redux is set up
  //   async function imitateGetCompleteStakeholders() { return [] };// {name: 'Stakeholder 0', id: 's0'}] }

  //   imitateGetCompleteStakeholders().then(stakeholders => {
  //     infoIdsState[1](ids => {
  //       return [
  //         ...stakeholders.map(stakeholder => {
  //           stakeholder.pageId = 'stakeholders';
  //           return stakeholder;
  //         })
  //       ];
  //     });
  //   });

  //     axios({
  //       method: 'get',
  //       url: BACK_URL + 'scenarios?userId=' + STUDENT_ID
  //     }).then(response => {
  //       setScenarios(prev => {
  //         return {
  //           scenarioList: response.data.body,
  //           currentScenarioID: id
  const [fetchScenariosResponse, setFetchScenariosResponse] = useState({
    data: null,
    loading: false,
    error: false,
  });
  const [shouldFetch, setShouldFetch] = useState(0);

   //Get next page
   let getData = () => {
    function onSuccess(response) {
      let scen = response.data.result.filter(
        (result) => result.version_id === version_id
      );
      numConversations = scen[0].num_conversation;
    }
    function onSuccess1(response) {
        let next = response.data.result[0].next_page;
        let endpoint = "/scenarios/task?versionId=1&pageId=" + next;
        get(setFetchScenariosResponse, endpoint, onFailure, onSuccess2)
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
    function onFailure() {
      //setErrorBannerMessage('Failed to get scenarios! Please try again.');
      //setErrorBannerFade(true);
    }
    get(setFetchScenariosResponse, (endpointGetMeta), onFailure, onSuccess);
    get(setFetchScenariosResponse, (endpointGet), onFailure, onSuccess1);
  };

  useEffect(getData, [shouldFetch]);

  return (
    <div>
      <Grid container direction="row" justify="center" alignItems="center">
      </Grid>
      <Grid container spacing={2}>
        <GatheredInfoContext.Provider value={infoIdsState}>
          <Grid item lg={3} md={2} sm={2}>
            <Stepper activePage={activePage} pages={pages} setPages={setPages} setActivePage={setActivePage} key={activePage} />
          </Grid>
          <Grid item lg={6} md={8} sm={8}>
            <Box mb={6} key={activePage}>
              {React.cloneElement(pages[activePage].html, {
                    pages: pages,
                    setPages: setPages,
                    activePage: activePage,
                    setActivePage: setActivePage,
                    version_id: scenario_id})}
                    {/* first_page: props.location.data.first_page,
                    nid: props.location.data.next */}
            </Box>
            {DEV_MODE && (
              <Typography>
                <br/>
                {scenarios.scenarioList && scenarios.scenarioList.map(scenario => {
                  return (<>
                    {Object.keys(scenario).map(key => ((<>{key}: {scenario[key]}<br/></>)))}
                    <Button variant="contained" disableElevation
                    onClick={() => setScenarios(scenarios => {
                      let newScenarios = {...scenarios};
                      newScenarios.currentScenarioID = scenario.id;
                      return newScenarios;
                    })}>
                      set as current scenario
                    </Button>
                    <br/> <br/>
                  </>)
                })}
              </Typography>)}
          </Grid>
          <Grid container item lg={3} md={2} sm={2}>
            <Grid item lg={12}>
              <InfoGatheredList pages={pages}/>
            </Grid>
            <Grid item lg={12}>

            </Grid>
          </Grid>
        </GatheredInfoContext.Provider>
      </Grid>
    </div>
  );
}

export default SimulationWindow;
