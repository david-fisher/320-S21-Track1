import React, { useContext, useState, useEffect } from 'react';
import {
  makeStyles,
  withStyles,
  Typography,
  Box,
  Grid,
  Button,
  Dialog,
  DialogContent,
  Paper,
  Avatar,
  Tab,
  Tabs,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import { STUDENT_ID } from '../constants/config';
import Conversation from './conversation';
import get from '../universalHTTPRequests/get';
import './stakeholders.css';
import GlobalContext from '../Context/GlobalContext';
import GenericWarning from './components/GenericWarning';

const TextTypography = withStyles({
  root: {
    color: '#373a3c',
  },
})(Typography);

const introText = 'Please select the Stakeholder you would like to interact with...';

function ellipses(str, cutoff) {
  let newStr = str;
  if (str.length >= cutoff) {
    newStr = `${str.substring(0, cutoff - 1)}…`;
    const lastSpace = newStr.lastIndexOf(' ');
    if (lastSpace !== -1) {
      newStr = `${newStr.substring(0, lastSpace)}…`;
    }
  }
  return newStr;
}

TabPanel.propTypes = {
  children: PropTypes.any,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};
function TabPanel(props) {
  const {
    children, value, index, ...other
  } = props;

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

const StyledTab = withStyles((theme) => ({
  root: {
    textTransform: 'none',
    color: '#000',
    fontWeight: theme.typography.fontWeightRegular,
    fontSize: theme.typography.pxToRem(18),
    backgroundColor: 'white',
    // backgroundColor: '#d9d9d9',
    '&:hover': {
      backgroundColor: '#8c8c8c',
      color: 'white',
      opacity: 1,
      selected: {
        backgroundColor: '#8c8c8c',
      },
    },
  },
}))((props) => <Tab disableRipple {...props} />);

const StyledTabs = withStyles({
  root: {},
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

const cardStyles = makeStyles({
  root: {},

  card: {
    width: 600,
    height: 125,
    // wordBreak: 'break-word',
    display: 'flex',
    borderRadius: '35px',
    '&:hover': {
      backgroundColor: '#f3e4e3',
    },
  },
  name: {
    color: '#000000',
    fontWeight: 'fontWeightBold',
  },
  selected: {
    borderRight: '6px solid lime',
  },
  background: {
    color: '#000000',
  },
  job: {
    color: '#881c1c',
    marginBottom: '10px',
  },
  disabled: {
    backgroundColor: '#f9f9f9',
    color: '#c2c2c2',
  },
  shdialog: {
    backgroundColor: 'black',
    borderRadius: '35px',
  },
  dialogName: {
    color: '#000000',
    marginTop: '10px',
    marginBottom: '2px',
  },
  dialogJob: {
    color: '#881c1c',
    marginBottom: '15px',
  },
});

Stakeholders.propTypes = {
  getNextPage: PropTypes.any.isRequired,
  getPrevPage: PropTypes.any.isRequired,
  nextPageEndpoint: PropTypes.any.isRequired,
  prevPageEndpoint: PropTypes.any.isRequired,
  versionID: PropTypes.number.isRequired,
};
export default function Stakeholders({
  getNextPage,
  getPrevPage,
  nextPageEndpoint,
  prevPageEndpoint,
  versionID,
}) {
  const [stakeholders, setStakeholders] = React.useState([]);
  // eslint-disable-next-line
  let [contextObj, setContextObj] = useContext(GlobalContext);
  const { sessionID } = contextObj;
  // eslint-disable-next-line
  const [conversationLimit, setConversationLimit] = React.useState(
    contextObj.numConversations,
  );
  const [stakeholdersDisabled, setStakeholdersDisabled] = React.useState({});
  const [stakeholdersSelected, setStakeholdersSelected] = React.useState([]);
  const [selectedIds, setSelectedIds] = React.useState([]);

  const classes = cardStyles();
  const [modalOpenToggles, setModalOpenToggles] = React.useState({});
  // const [gatheredInfo, setGatheredInfo] = useContext(GatheredInfoContext);
  const [showStakeholders, setShowStakeholders] = React.useState(true);
  const [currentStakeholder, setCurrentStakeholder] = React.useState({});
  const [numStakeholderTalkedTo, setNumStakeholderTalkedTo] = React.useState(0);
  const createdCardStyles = cardStyles();
  const stakeholdersGrid = getStakeholdersGrid(stakeholders, false);
  const stakeholdersSelectedGrid = getStakeholdersGrid(
    stakeholdersSelected,
    true,
  );

  const endpointGet = `/scenarios/stakeholder/page?versionId=${versionID}&scenarioId=${versionID}`;
  // eslint-disable-next-line
  const [fetchScenariosResponse, setFetchScenariosResponse] = useState({
    data: null,
    loading: false,
    error: null,
  });
  // eslint-disable-next-line
  const [shouldFetch, setShouldFetch] = useState(0);
  const getData = () => {
    function onSuccess(response) {
      // setConversationLimit(...)
      const holders = response.data.result;
      setStakeholders(holders);
      setStakeholdersDisabled(() => holders.reduce((obj, stakeholder) => {
        obj[stakeholder.stakeholder_id] = false;
        return obj;
      }, {}));
      // need isVisited for stakeholder in endpoint
    }
    function onFailure() {
      console.log('Error');
    }
    get(setFetchScenariosResponse, endpointGet, onFailure, onSuccess);
  };
  useEffect(getData, [shouldFetch]);

  const checkStakeholderVisited = () => {
    const endpoint = `/scenarios/stakeholder/had?userId=${STUDENT_ID}&versionId=${versionID}`;

    function onSuccess(response) {
      console.log(response.data.result);
      const holders = response.data.result;
      setStakeholdersSelected(holders);
      const ids = [];
      for (let i = 0; i < holders.length; ++i) {
        setNumStakeholderTalkedTo((prev) => prev + 1);
        ids.push(holders[i].stakeholder_id);
      }
      setSelectedIds(ids);
      if (holders.length === conversationLimit) {
        setStakeholdersDisabled((prev) => {
          for (const key of Object.keys(prev)) {
            if (!ids.includes(parseInt(key))) {
              prev[key] = true;
            }
          }
          console.log(prev);
          return prev;
        });
      }
      // eslint-disable-next-line
      stakeholdersGrid = getStakeholdersGrid(stakeholders, false);
    }

    function onFailure() {
      console.log('Error');
    }

    get(setFetchScenariosResponse, endpoint, onFailure, onSuccess);
  };

  useEffect(checkStakeholderVisited, [conversationLimit]);

  function getStakeholderCards(
    id,
    name,
    job,
    description,
    introduction,
    photo,
    styles,
  ) {
    function onClickStakeholder() {
      setCurrentStakeholder(() => ({
        name,
        id,
        job,
        description,
        introduction,
        photo,
      }));

      if (!selectedIds.includes(id)) {
        setStakeholders((prev) => {
          const holders = prev;
          for (let i = 0; i < holders.length; ++i) {
            if (holders[i].stakeholder_id === id) {
              const selectedHolder = holders[i];
              holders.splice(i, 1);

              setSelectedIds((prev) => {
                if (!prev.includes(id)) {
                  prev.push(id);
                }
                return prev;
              });

              setStakeholdersSelected((prev) => {
                const h = prev;
                if (!h.some((item) => item.stakeholder_id === id)) {
                  h.push(selectedHolder);
                }
                return h;
              });
            }
          }
          return holders;
        });

        setStakeholdersDisabled((prev) => {
          const newStakeholdersDisabled = { ...prev };
          if (numStakeholderTalkedTo + 1 >= conversationLimit) {
            for (const sID in newStakeholdersDisabled) {
              if (!selectedIds.includes(sID)) {
                newStakeholdersDisabled[sID] = true;
              }
            }
          }
          return newStakeholdersDisabled;
        });

        setNumStakeholderTalkedTo((prev) => prev + 1);

        setStakeholdersDisabled((prev) => {
          const newStakeholdersDisabled = { ...prev };
          selectedIds.forEach((val) => {
            newStakeholdersDisabled[val] = false;
          });
          return newStakeholdersDisabled;
        });
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
    }

    function toggleModal(id, toggle) {
      setModalOpenToggles((prev) => {
        const newToggles = { ...prev };
        newToggles[id] = toggle;
        return newToggles;
      });
    }

    let cardClass;
    let nameClass;
    let jobClass;
    let descriptionClass;

    if (stakeholdersDisabled[id]) {
      cardClass = `${styles.card} ${styles.disabled}`;
      nameClass = descriptionClass = styles.disabled;
    } else {
      cardClass = styles.card;
      nameClass = styles.name;
      jobClass = styles.job;
      descriptionClass = styles.background;
    }
    return (
      <>
        <Button
          disabled={stakeholdersDisabled[id]}
          style={{ textTransform: 'none' }}
          onClick={() => toggleModal(id, true)}
        >
          <Paper elevation={2} className={cardClass}>
            <div
              id="stakeholder-container"
              style={{ display: 'flex', justifyContent: 'center' }}
            >
              <Avatar
                id="stakeholder-img"
                alt="Stakeholder Photo"
                src={photo}
              />
            </div>
            <div id="info-container" style={{ flex: 1 }}>
              <Box
                fontSize="20px"
                fontWeight="fontWeightBold"
                className={nameClass}
                align="left"
              >
                <Typography variant="h5">
                  {name}
                </Typography>
              </Box>
              <Box
                fontWeight="fontWeightBold"
                className={jobClass}
                align="left"
              >
                <Typography variant="h5">
                  {job}
                </Typography>
              </Box>
            </div>
          </Paper>
        </Button>
        <Dialog
          PaperProps={{
            style: {
              borderRadius: '30px',
            },
          }}
          open={modalOpenToggles[id]}
          onClose={() => toggleModal(id, false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogContent>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Avatar
                style={{ height: '150px', width: '150px' }}
                alt="Stakeholder Photo"
                size
                src={photo}
              />
            </div>
            <Box
              fontSize="25px"
              fontWeight="fontWeightBold"
              className={classes.dialogName}
              align="center"
            >
              {name}
            </Box>
            <Box
              fontSize="15px"
              fontWeight="fontWeightBold"
              className={classes.dialogJob}
              align="center"
            >
              {job}
            </Box>
            <div dangerouslySetInnerHTML={{ __html: description }} />
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                disabled={stakeholdersDisabled[id]}
                variant="contained"
                onClick={onClickStakeholder}
              >
                Speak to
                {' '}
                {name}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  function getStakeholdersGrid(stakeholders, selected) {
    if (!selected) {
      const stakeholdersNotSelected = stakeholders;
      for (let i = 0; i < stakeholdersNotSelected.length; ++i) {
        if (selectedIds.includes(stakeholdersNotSelected[i].stakeholder_id)) {
          stakeholdersNotSelected.splice(i, 1);
        }
      }
      const items = stakeholdersNotSelected.map((stakeholder) => getStakeholderCards(
        stakeholder.stakeholder_id,
        stakeholder.name,
        stakeholder.job,
        stakeholder.description,
        stakeholder.introduction,
        stakeholder.photo,
        createdCardStyles,
      ));
      return (
        <div>
          <Grid container spacing={3} justify="center">
            {items.map((item) => (
              <Grid item key={item.stakeholder_id}>
                {item}
              </Grid>
            ))}
          </Grid>
        </div>
      );
    }

    const items = stakeholdersSelected.map((stakeholder) => getStakeholderCards(
      stakeholder.stakeholder_id,
      stakeholder.name,
      stakeholder.job,
      stakeholder.description,
      stakeholder.introduction,
      stakeholder.photo,
      createdCardStyles,
    ));
    return (
      <div>
        <Grid container spacing={3} justify="center">
          {items.map((item) => (
            <Grid item>{item}</Grid>
          ))}
        </Grid>
      </div>
    );
  }

  const [openWarning, setOpenWarning] = useState(false);
  const handleOpenWarning = () => {
    setOpenWarning(true);
  };

  const Buttons = (
    <Grid container direction="row" justify="space-between">
      <GenericWarning
        func={() => getNextPage(
          nextPageEndpoint,
          contextObj.activeIndex,
          contextObj.pages,
        )}
        setOpen={setOpenWarning}
        open={openWarning}
        title="Warning"
        description={
          conversationLimit - numStakeholderTalkedTo > 1
            ? `You can talk to ${
              conversationLimit - numStakeholderTalkedTo
            } more stakeholders. Are you sure you want to move on?`
            : `You can talk to ${
              conversationLimit - numStakeholderTalkedTo
            } more stakeholder. Are you sure you want to move on?`
        }
      />
      <Grid item style={{ marginRight: '0rem', marginTop: '1rem' }}>
        <Button
          variant="contained"
          color="primary"
          disableElevation
          disabled={!showStakeholders}
          className={classes.backButton}
          onClick={() => getPrevPage(prevPageEndpoint, contextObj.pages)}
        >
          Back
        </Button>
      </Grid>
      <Grid item style={{ marginRight: '0rem', marginTop: '1rem' }}>
        <Button
          variant="contained"
          disableElevation
          disabled={!showStakeholders}
          className={classes.nextButton}
          color="primary"
          onClick={
            numStakeholderTalkedTo >= conversationLimit
              ? () => getNextPage(
                nextPageEndpoint,
                contextObj.activeIndex,
                contextObj.pages,
              )
              : handleOpenWarning
          }
        >
          Next
        </Button>
      </Grid>
    </Grid>
  );

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
      {Buttons}
      {showStakeholders && (
        <div>
          <Grid container direction="row" justify="center" alignItems="center">
            <Box mt={5}>
              <TextTypography variant="h4" align="center" gutterBottom>
                Stakeholders
              </TextTypography>
            </Box>
          </Grid>
          <Grid container spacing={2}>
            <Grid item lg={12} md={12} sm={12}>
              <Box m="1rem" align="center">
                <TextTypography>
                  You've spoken to
                  {' '}
                  <b>
                    {numStakeholderTalkedTo}
                    {' '}
                    out of
                    {' '}
                    {conversationLimit}
                  </b>
                  {' '}
                  stakeholders
                </TextTypography>
              </Box>
              <TextTypography variant="body1" align="center">
                {introText}
              </TextTypography>
            </Grid>
            <Grid container direction="column">
              <StyledTabs
                value={value}
                variant="fullWidth"
                centered
                onChange={handleChange}
                aria-label="Tabs"
              >
                <StyledTab label="Available Stakeholders" {...a11yProps(0)} />
                <StyledTab
                  className={classes.tab}
                  label="Spoken To Stakeholders"
                  {...a11yProps(1)}
                />
              </StyledTabs>
              <TabPanel value={value} index={0}>
                <Grid>
                  <div
                    style={{
                      display: 'flex',
                      flex: '1',
                      justifyContent: 'center',
                    }}
                  >
                    {stakeholdersGrid}
                  </div>
                </Grid>
              </TabPanel>
              <TabPanel value={value} index={1}>
                <Grid>
                  <div
                    style={{
                      display: 'flex',
                      flex: '1',
                      justifyContent: 'center',
                    }}
                  >
                    {stakeholdersSelectedGrid}
                  </div>
                </Grid>
              </TabPanel>
            </Grid>
          </Grid>
        </div>
      )}
      {!showStakeholders && (
        <Conversation
          sessionID={sessionID}
          stakeholder={currentStakeholder}
          showStakeholders={showStakeholders}
          versionID={versionID}
          setShowStakeholders={setShowStakeholders}
        />
      )}
    </>
  );
}
