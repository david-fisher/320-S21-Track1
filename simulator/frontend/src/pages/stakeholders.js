import React, { useContext, useState, useEffect } from "react";
import {
  makeStyles, withStyles, Typography, Box, Grid, Button,
  Dialog, DialogContent, Paper, Avatar, Tab, Tabs
} from "@material-ui/core";
import { createMuiTheme, useTheme } from "@material-ui/core/styles";
import { GatheredInfoContext } from './simulationWindow';
import { BACK_URL, STUDENT_ID, SCENARIO_ID } from "../constants/config";
import axios from 'axios';
import Conversation from './conversation';
import { ScenariosContext } from "../Nav";
import get from '../universalHTTPRequests/get';
import PropTypes from 'prop-types';
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

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

const StyledTab = withStyles((theme) => ({
  root: {
    textTransform: 'none',
    color: '#000',
    fontWeight: theme.typography.fontWeightRegular,
    fontSize: theme.typography.pxToRem(18),
    backgroundColor: 'white',
    //backgroundColor: '#d9d9d9',
    '&:hover': {
      backgroundColor: '#8c8c8c',
      color: 'white',
      opacity: 1,
      selected: {
        backgroundColor: '#8c8c8c'
      }

    },
  },
}))((props) => <Tab disableRipple {...props} />);

const StyledTabs = withStyles({
  root: {

  },

  indicator: {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    '& > span': {
      maxWidth: 200,
      width: '100%',
      backgroundColor: '#881c1c',
    },
  },
})((props) => <Tabs {...props} TabIndicatorProps={{ children: <span /> }} />);

function Stakeholders({ pages, setPages, activePage, numConversations, prevPageID, nextPageID, setActivePage }) {
  const [stakeholders, setStakeholders] = React.useState([])
  const [scenarios, setScenarios] = React.useContext(ScenariosContext);
  const [conversationLimit, setConversationLimit] = React.useState(numConversations);
  const [stakeholdersDisabled, setStakeholdersDisabled] = React.useState({});
  const [stakeholdersSelected, setStakeholdersSelected] = React.useState([]);
  const [selectedIds, setSelectedIds] = React.useState([]);

  const cardStyles = makeStyles({
    root: {
    },

    card: {
      width: 600,
      height: 125,
      //wordBreak: 'break-word',
      display: 'flex',
      borderRadius: '35px',
      '&:hover': {
        backgroundColor: '#f3e4e3'
      }
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
      marginBottom: '10px'
    },
    disabled: {
      backgroundColor: '#f9f9f9',
      color: '#c2c2c2'
    },
    shdialog: {
      backgroundColor: 'black',
      borderRadius: '35px'
    },
    dialogName: {
      color: '#000000',
      marginTop: '10px',
      marginBottom: '2px'
    },
    dialogJob: {
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
  const stakeholdersGrid = getStakeholdersGrid(stakeholders, false);
  const stakeholdersSelectedGrid = getStakeholdersGrid(stakeholdersSelected, true)

  const endpointGet = '/scenarios/stakeholder/page?versionId=' + SCENARIO_ID + "&scenarioId=" + SCENARIO_ID;

  const [fetchScenariosResponse, setFetchScenariosResponse] = useState({
    data: null,
    loading: false,
    error: null,
  });
  const [shouldFetch, setShouldFetch] = useState(0);


  let getData = () => {
    function onSuccess(response) {
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
    function onFailure(err) {
      console.log('Error');
    }
    get(setFetchScenariosResponse, (endpointGet), onFailure, onSuccess);
  }
  useEffect(getData, [shouldFetch]);

  let checkStakeholderVisited = () => {
    let endpoint = "/scenarios/stakeholder/had?userId=" + STUDENT_ID + "&versionId=" + SCENARIO_ID;

    function onSuccess(response) {
      let holders = response.data.result;
      setStakeholdersSelected(holders)
      let ids = []
      for (let i = 0; i < holders.length; ++i) {
        setNumStakeholderTalkedTo(prev => {
          return (prev + 1);
        })
        ids.push(holders[i].stakeholder_id);
      }
      setSelectedIds(ids)
      if(holders.length === numConversations){
        setStakeholdersDisabled(prev => {
          for(var key of Object.keys(prev)){
            if(!ids.includes(parseInt(key))){
              prev[key] = true
            }
          }
          return prev;
        });
      }
      stakeholdersGrid = getStakeholdersGrid(stakeholders, false);
    }

    function onFailure(err) {
      console.log('Error');
    }

    get(setFetchScenariosResponse, (endpoint), onFailure, onSuccess);
  }

  useEffect(checkStakeholderVisited, [conversationLimit]);


  function getStakeholderCards(id, name, job, description, photo, styles) {

    const PAGE_ID_OF_PAGE_BEFORE_CONVERSATIONS = 'gatheredInformation';
    function toggleModal(id, toggle) {
      setModalOpenToggles(prev => {
        let newToggles = { ...prev };
        newToggles[id] = toggle;
        return newToggles;
      });
    }
    let cardClass, nameClass, jobClass, descriptionClass;
    if (stakeholdersDisabled[id]) {
      cardClass = `${styles.card} ${styles.disabled}`;
      nameClass = descriptionClass = styles.disabled;
    }
    else {
      cardClass = styles.card;
      nameClass = styles.name;
      jobClass = styles.job;
      descriptionClass = styles.background;
    }
    return (
      <>
        <Button disabled={stakeholdersDisabled[id]} style={{ textTransform: 'none' }} onClick={() => toggleModal(id, true)}>
          <Paper elevation={2} className={cardClass}>
            <div id="stakeholder-container" style={{ display: "flex", justifyContent: "center" }}>
              <Avatar id="stakeholder-img" alt="Stakeholder Photo" src={photo} />
            </div>
            <div id="info-container" style={{ flex: 1 }}>
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
              borderRadius: '30px'
            },
          }}
          open={modalOpenToggles[id]}
          onClose={() => toggleModal(id, false)}
          maxWidth={'sm'}
          fullWidth={false}
        >
          <DialogContent>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Avatar style={{ height: "150px", width: "150px" }} alt="Stakeholder Photo" size src={photo} />
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
            <br />
            <br />
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Button disabled={stakeholdersDisabled[id]} variant="contained" onClick={() => {
                setCurrentStakeholder(prev => ({
                  name: name,
                  id: id,
                  job: job,
                  description: description,
                  photo: photo
                }));


                if (!selectedIds.includes(id)) {
                  setStakeholders(prev => {
                    let holders = prev;
                    for (let i = 0; i < holders.length; ++i) {
                      if (holders[i].stakeholder_id === id) {
                        let selectedHolder = holders[i];
                        holders.splice(i, 1);

                        setSelectedIds(prev => {
                          if (!prev.includes(id))
                            prev.push(id)
                          return prev;
                        });

                        setStakeholdersSelected(prev => {
                          let h = prev
                          if (!h.some(item => (item.stakeholder_id === id)))
                            h.push(selectedHolder)
                          return h;
                        });


                      }
                    }

                    return holders;
                  });


                  setStakeholdersDisabled(prev => {
                    let newStakeholdersDisabled = { ...prev };
                    if (numStakeholderTalkedTo + 1 >= conversationLimit) {
                      for (const sID in newStakeholdersDisabled) {
                        if (!selectedIds.includes(sID)) {
                          newStakeholdersDisabled[sID] = true;
                        }
                      }
                    }
                    return newStakeholdersDisabled;
                  });


                  setNumStakeholderTalkedTo(prev => {
                    return (prev + 1)
                  });

                  setStakeholdersDisabled(prev => {
                    let newStakeholdersDisabled = { ...prev };
                    selectedIds.map(val => {
                      newStakeholdersDisabled[val] = false;
                    })
                    return newStakeholdersDisabled
                  })
                }

                setShowStakeholders(false);
                toggleModal(id, false);
                /* setGatheredInfo(infos => {
                  let ind = infos.findIndex(info => info.pageId === PAGE_ID_OF_PAGE_BEFORE_CONVERSATIONS);
                  if (ind < 0) { ind = infos.length; }
                  let newInfos = [...infos];
                  newInfos.splice(ind, 0,
                    { name: name, job: job, description: description, id: `stakeholder:${id}`, pageId: 'stakeholders'});
                  return newInfos;
                }); */
              }}>Speak to {name}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </>
    )
  }

  function getStakeholdersGrid(stakeholders, selected) {
    if (!selected) {
      let stakeholdersNotSelected = stakeholders
      for (let i = 0; i < stakeholdersNotSelected.length; ++i) {
        if (selectedIds.includes(stakeholdersNotSelected[i].stakeholder_id)) {
          stakeholdersNotSelected.splice(i, 1);
        }
      }
      let items = stakeholdersNotSelected.map(stakeholder => getStakeholderCards(
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
    else {
      let items = stakeholdersSelected.map(stakeholder => getStakeholderCards(
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
  }

  function goToPrevPage() {
    if (!pages[prevPageID].visited) {
      setPages(prevPages => {
        let copy = { ...prevPages };
        copy[prevPageID].visited = true;
        return copy;
      });
    }
    setActivePage(prevPage => prevPageID)
  }

  function goToNextPage() {
    if (!pages[nextPageID].visited) {
      setPages(prevPages => {
        let copy = { ...prevPages };
        copy[nextPageID].visited = true;
        return copy;
      });
    }
    setActivePage(prevPage => nextPageID)
  }

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

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
              <Button variant="contained" disableElevation onClick={goToPrevPage}>Back</Button>
            </Grid>
            <Grid item style={{ marginRight: "0rem", marginTop: "-3rem" }}>
              <Button variant="contained" disableElevation color="primary" onClick={goToNextPage}>Next</Button>
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
            <Grid container direction="column">
              <StyledTabs value={value} variant='fullWidth' centered onChange={handleChange} aria-label="Tabs">
                <StyledTab label="Available Stakeholders" {...a11yProps(0)} />
                <StyledTab className={classes.tab} label="Spoken To Stakeholders" {...a11yProps(1)} />
              </StyledTabs>
              <TabPanel value={value} index={0}>
                <Grid>
                  <div style={{ display: 'flex', flex: '1', justifyContent: 'center' }}>
                    {stakeholdersGrid}
                  </div>
                </Grid>
              </TabPanel>
              <TabPanel value={value} index={1}>
                <Grid>
                  <div style={{ display: 'flex', flex: '1', justifyContent: 'center' }}>
                    {stakeholdersSelectedGrid}
                  </div>
                </Grid>
              </TabPanel>
            </Grid>
          </Grid>
        </div>
      }
      {!showStakeholders &&
        <Conversation stakeholder={currentStakeholder} showStakeholders={showStakeholders} setShowStakeholders={setShowStakeholders} />
      }
    </>
  );
}

export default Stakeholders;

