import React, { useContext, useState, useEffect } from "react";
import { makeStyles, withStyles, Typography, Box, Grid, Button,
  Card, CardContent, Modal, Dialog, DialogContent, DialogContentText, Paper, Avatar } from "@material-ui/core";
import { createMuiTheme, useTheme } from "@material-ui/core/styles";
import { GatheredInfoContext } from './simulationWindow';
import { BACK_URL, STUDENT_ID, SCENARIO_ID } from "../constants/config";
import axios from 'axios';
import Conversation from './conversation';
import { ScenariosContext } from "../Nav";
import get from '../universalHTTPRequests/get';
import { BorderStyle } from "@material-ui/icons";
import './stakeholders.css';

const TextTypography = withStyles({
  root: {
    color: "#373a3c"
  }
})(Typography);

const introText = "Please select the Stakeholder you would like to interact with...";



function ellipses(str, cutoff) {
  let newStr = str;
  if (str.length >= cutoff) {
    newStr = str.substring(0, cutoff - 1) + '…';
    let lastSpace = newStr.lastIndexOf(' ');
    if (lastSpace !== -1) {
      newStr = newStr.substring(0, lastSpace) + '…';
    }
  }
  return newStr;
}

function Stakeholders({ pages, setPages, activePage, setActivePage }) {
  const [stakeholders, setStakeholders] = React.useState([])
  const [scenarios, setScenarios] = React.useContext(ScenariosContext);
  const [conversationLimit, setConversationLimit] = React.useState(2);
  const [stakeholdersDisabled, setStakeholdersDisabled] = React.useState({});
  const [stakeholdersSelected, setStakeholdersSelected] = React.useState([]);
  const cardStyles = makeStyles({
    root: {
    },
    
    card:{
      width: 600,
      height: 125,
      //wordBreak: 'break-word',
      display:'flex',
      borderRadius: '35px',
    },
    name: {
      color: '#000000',
      fontWeight: 'fontWeightBold',
      marginBottom: '-10px'
    },
    selected: {
      borderRight: '6px solid lime'
    },
    background: {
      color: '#000000'
    },
    job: {
      color: '#881c1c',
      marginBottom:'10px'
    },
    disabled: {
      backgroundColor: '#f9f9f9',
      color: '#c2c2c2'
    },
    shdialog:{
      backgroundColor: 'black',
      borderRadius: '35px'
    },
    dialogName:{
      color: '#000000',
      marginTop: '10px',
      marginBottom: '2px'
    },
    dialogJob:{
      color: '#881c1c',
      marginBottom: '15px'
    },
  });
  const classes = cardStyles();
  const [modalOpenToggles, setModalOpenToggles] = React.useState({});
  const [gatheredInfo, setGatheredInfo] = useContext(GatheredInfoContext);
  const [showStakeholders, setShowStakeholders] = React.useState(true);
  const [currentStakeholder, setCurrentStakeholder] = React.useState({});
  const [numStakeholderTalkedTo, setNumStakeholderTalkedTo] = React.useState(0);
  const createdCardStyles = cardStyles();
  const stakeholdersGrid = getStakeholdersGrid(stakeholders);
  
  const endpointGet = '/scenarios/stakeholder/page?versionId=' + SCENARIO_ID + "&scenarioId=" + SCENARIO_ID;

  const [fetchScenariosResponse, setFetchScenariosResponse] = useState({
    data: null,
    loading: false,
    error: null,
  });
  const [shouldFetch, setShouldFetch] = useState(0);

  
  let getData = () => {
    function onSuccess(response){
      // setConversationLimit(...)
      let holders = response.data.result;
      setStakeholders(holders);
      setStakeholdersDisabled(prev => {
        return holders.reduce((obj, stakeholder) => {
          obj[stakeholder.stakeholder_id] = false;
          return obj;
        }, {});
      });
      // need isVisited for stakeholder in endpoint
    }

    function onFailure(err){
      console.log('Error');
    }
    get(setFetchScenariosResponse, (endpointGet), onFailure, onSuccess);
  }
  useEffect(getData, [shouldFetch]);
  
  let checkStakeholderVisited = () => {

    let endpoint = "/scenarios/stakeholder/had?userId=" + STUDENT_ID + "&versionId=" + SCENARIO_ID;

    function onSuccess(response){
      let holders = response.data.result;
      let selected = []
      for(let i = 0; i < holders.length; ++i){
        selected.push(holders[i].stakeholder_id)
      }
      setStakeholdersSelected(selected);
    }

    function onFailure(err){
      console.log('Error');
    }

    get(setFetchScenariosResponse, (endpoint), onFailure, onSuccess);
  }
  useEffect(checkStakeholderVisited, [shouldFetch]);


  function getStakeholderCards(id, name, job, description, photo, styles) {
    
    const PAGE_ID_OF_PAGE_BEFORE_CONVERSATIONS = 'gatheredInformation';
    function toggleModal(id, toggle) {
      setModalOpenToggles(prev => {
        let newToggles = {...prev};
        newToggles[id] = toggle;
        return newToggles;
      });
    }
    let cardClass, nameClass, jobClass, descriptionClass;
    if (stakeholdersDisabled[id]) {
      cardClass = `${styles.card} ${styles.disabled}`;
      nameClass = descriptionClass = styles.disabled;
    }
    /* else if (stakeholdersSelected.includes(id)){
      cardClass = `${styles.card} ${styles.selected}`;
      nameClass = styles.name;
      jobClass = styles.job;
      descriptionClass = styles.background;
    } */
    else {
      cardClass = styles.card;
      nameClass = styles.name;
      jobClass = styles.job;
      descriptionClass = styles.background;
    }
    return (
      <>
        <Button disabled={stakeholdersDisabled[id]} style={{textTransform: 'none'}} onClick={() => toggleModal(id, true)}>
          <Paper elevation={2} className={cardClass}>
            <div id="stakeholder-container" style={{display:"flex" , justifyContent:"center"}}>
              <Avatar id="stakeholder-img" alt="Stakeholder Photo" src={photo}/>
            </div>
            <div id="info-container" style={{flex: 1}}>
            <Box fontSize="20px" fontWeight="fontWeightBold" className={nameClass} align='left'>
              {name}
            </Box> 
            <Box fontWeight="fontWeightBold" className={jobClass} align='left'>
              {job}
            </Box> 
            <Typography variant="body2" component="p" align='left' className={descriptionClass}>
              {ellipses(description, 130)} 
            </Typography>
            </div>
          </Paper>
        </Button>
        <Dialog
          PaperProps={{
            style: {
              width: '350px',
              borderRadius:'30px'
            },
          }}
          open={modalOpenToggles[id]}
          onClose={() => toggleModal(id, false)}
          maxWidth= {'sm'}
          fullWidth= {false}
          >
          <DialogContent>
              <div style={{display:"flex" , justifyContent:"center"}}>
                <Avatar style={{height:"150px", width:"150px"}} alt="Stakeholder Photo" size src={photo}/>
              </div>
              <Box fontSize="25px" fontWeight="fontWeightBold" className={classes.dialogName} align='center'>
              {name}
              </Box> 
              <Box fontSize="15px" fontWeight="fontWeightBold" className={classes.dialogJob} align='center'>
                {job}
              </Box> 
              <Typography variant="body2" component="p" align='center' className={descriptionClass}>
                {description}
              </Typography>
                <br/>
                <br/>
              <div style={{display:"flex" , justifyContent:"center"}}>
                <Button disabled={stakeholdersDisabled[id]} variant="contained" onClick={() => {
                  setCurrentStakeholder(prev => ({
                    name: name,
                    id: id,
                    job: job,
                    description: description,
                    photo: photo
                  }));
                  
                  setStakeholdersDisabled(prev => { 
                    let newStakeholdersDisabled = {...prev};
                    if (numStakeholderTalkedTo + 1 >= conversationLimit) {
                      for (const id in newStakeholdersDisabled) {
                        newStakeholdersDisabled[id] = true;
                      }
                    }else {
                      newStakeholdersDisabled[id] = true;
                    }
                    return newStakeholdersDisabled;
                  });
                  setNumStakeholderTalkedTo(prev => {
                    return (prev + 1)
                  });
                  
                  /* axios({
                    method: 'put',
                    url: BACK_URL + '/scenarios/stakeholder?versionId=' + SCENARIO_ID + "&scenarioId=" + SCENARIO_ID,
                    data: {
                      scenarioID: scenarios.currentScenarioID,
                      studentID: STUDENT_ID,
                      stakeholderID: id
                    }
                  }).catch(err => {
                    console.error(err);
                    alert(err); 
                  }) */
                  setShowStakeholders(false);
                  toggleModal(id, false);
                  setGatheredInfo(infos => {
                    let ind = infos.findIndex(info => info.pageId === PAGE_ID_OF_PAGE_BEFORE_CONVERSATIONS);
                    if (ind < 0) { ind = infos.length; }
                    let newInfos = [...infos];
                    newInfos.splice(ind, 0,
                      { name: name, job: job, description: description, id: `stakeholder:${id}`, pageId: 'stakeholders'});
                    return newInfos;
                  });
                }}>Speak to {name}</Button>
              </div>
          </DialogContent>
        </Dialog>
      </>
    )
  }

  function getStakeholdersGrid(stakeholders) {
    let items = stakeholders.map(stakeholder => getStakeholderCards(
      stakeholder.stakeholder_id, stakeholder.name, stakeholder.job, stakeholder.description, stakeholder.photo, createdCardStyles));
    return (
      <div>
        <Grid container spacing={3} justify={'center'}>
          {items.map(item => ((
            <Grid item>
              {item}
            </Grid>
          )))}
        </Grid>
      </div>
    )
  }

  function goToGatheredInformation() {
    if (!pages.gatheredInformation.visited) {
      setPages(prevPages => {
        let copy = { ...prevPages };
        copy.gatheredInformation.visited = true;
        return copy;
      });
    }
    setActivePage(prevPage => 'gatheredInformation')
  }

  function goToMiddleReflection() {
    if (!pages.middleReflection.visited) {
      setPages(prevPages => {
        let copy = { ...prevPages };
        copy.middleReflection.visited = true;
        return copy;
      });
    }
    setActivePage(prevPage => 'middleReflection')
  }
  return (
    <>
      {showStakeholders &&
        <div>
        <Grid container direction="row" justify="center" alignItems="center">
          <Box mt={5}>
            <TextTypography variant="h4" align="center" gutterBottom>
              Stakeholders
            </TextTypography>
          </Box>
        </Grid>
        <Grid container direction="row" justify="space-between">
          <Grid item style={{ marginRight: "0rem", marginTop: "-3rem" }}>
            <Button variant="contained" disableElevation onClick={goToGatheredInformation}>Back</Button>
          </Grid>
          <Grid item style={{ marginRight: "0rem", marginTop: "-3rem" }}>
            <Button variant="contained" disableElevation color="primary" onClick={goToMiddleReflection}>Next</Button>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item lg={12} md={12} sm={12}>
            <Box m="1rem" align={'center'}>
              <TextTypography>
                You've spoken to <b>{numStakeholderTalkedTo} out of {conversationLimit}</b> stakeholders</TextTypography>
            </Box>
            <TextTypography variant="body1" align="center">
              {introText}
            </TextTypography>
          </Grid>
          <div style={{display:'flex', flex:'1', justifyContent:'center'}}>
          {stakeholdersGrid}
          </div>
        </Grid>
      </div>
      }
      {!showStakeholders &&
        <Conversation stakeholder={currentStakeholder} showStakeholders={showStakeholders} setShowStakeholders={setShowStakeholders}/>
      }
    </>
  );
}

export default Stakeholders;
