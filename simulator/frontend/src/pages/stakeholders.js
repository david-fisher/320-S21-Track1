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
  DialogTitle,
} from '@material-ui/core';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import InnerHTML from 'dangerously-set-html-content';
import PropTypes from 'prop-types';
import LoadingSpinner from '../components/LoadingSpinner';
import Conversation from './conversation';
import post from '../universalHTTPRequestsSimulator/post';
import getSimulator from '../universalHTTPRequestsSimulator/get';
import getEditor from '../universalHTTPRequestsEditor/get';
import GlobalContext from '../Context/GlobalContext';
import GenericWarning from '../components/GenericWarning';
import ErrorBanner from '../components/Banners/ErrorBanner';

const TextTypography = withStyles({
  root: {
    color: '#373a3c',
  },
})(Typography);

const introText = 'Please select the Stakeholder you would like to interact with...';

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
    color: 'white',
    fontWeight: theme.typography.fontWeightRegular,
    fontSize: theme.typography.pxToRem(18),
    backgroundColor: '#881c1c',
    borderColor: 'black',
    border: 'solid',
    borderRadius: '2%',
    // backgroundColor: '#d9d9d9',
    '&:hover': {
      backgroundColor: '#F7E7E7',
      color: 'black',
      opacity: 1,
      selected: {
        backgroundColor: '#F7E7E7',
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
      width: '100%',
      backgroundColor: '#881c1c',
    },
  },
})((props) => <Tabs {...props} TabIndicatorProps={{ children: <span /> }} />);

const cardStyles = makeStyles((theme) => ({
  root: {},

  card: {
    width: 'calc(100%)',
    minWidth: '100%',
    height: 125,
    wordBreak: 'break-word',
    display: 'flex',
    borderRadius: '35px',
    '&:hover': {
      backgroundColor: '#f3e4e3',
    },
  },
  name: {
    color: '#000000',
    fontWeight: 'fontWeightBold',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
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
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
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
    wordBreak: 'break-word',
  },
  dialogJob: {
    color: '#881c1c',
    marginBottom: '15px',
    wordBreak: 'break-word',
  },
  exitOutButton: {
    marginLeft: 'auto',
    float: 'right',
  },
  stakeholderContainer: {
    width: '125px',
    marginRight: '20px',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stakeholderImg: {
    height: '90px',
    width: '90px',
    left: '20px',
  },
  infoContainer: {
    paddingTop: '10px',
    marginLeft: '10px',
    maxWidth: '400px',
  },
  bannerContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
}));

Stakeholders.propTypes = {
  getNextPage: PropTypes.any.isRequired,
  getPrevPage: PropTypes.any.isRequired,
  nextPageEndpoint: PropTypes.any.isRequired,
  prevPageEndpoint: PropTypes.any.isRequired,
  scenarioID: PropTypes.number.isRequired,
};
export default function Stakeholders({
  getNextPage,
  getPrevPage,
  nextPageEndpoint,
  prevPageEndpoint,
  scenarioID,
}) {
  const classes = cardStyles();
  const [stakeholders, setStakeholders] = useState([]);
  // eslint-disable-next-line
  const [contextObj, setContextObj] = useContext(GlobalContext);
  // eslint-disable-next-line
  const [conversationLimit, setConversationLimit] = useState(
    contextObj.numConversations,
  );

  const [modalOpenToggles, setModalOpenToggles] = useState({});
  const [showStakeholders, setShowStakeholders] = useState(true);
  const [currentStakeholder, setCurrentStakeholder] = useState({});
  const [numStakeholderTalkedTo, setNumStakeholderTalkedTo] = useState(0);
  const [hasTalkedWithStakeholders, setHasTalkedWithStakeholders] = useState(false);
  const createdCardStyles = cardStyles();

  const [errorBannerMessage, setErrorBannerMessage] = useState('');
  const [errorBannerFade, setErrorBannerFade] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setErrorBannerFade(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [errorBannerFade]);

  const endpointStakeholdersGET = `/api/stakeholders/?SCENARIO=${scenarioID}`;
  const endpointConversationsHadGET = `/api/conversations_had/?SESSION_ID=${contextObj.sessionID}`;
  const endpointPOST = '/api/conversations_had/';

  // eslint-disable-next-line
  const [fetchData, setFetchData] = useState({
    data: null,
    loading: false,
    error: null,
  });
  const getData = () => {
    function onSuccess(response) {
      // setConversationLimit(...)
      const stakeholders = response.data.map((obj) => ({
        id: obj.STAKEHOLDER,
        name: obj.NAME,
        description: obj.DESCRIPTION,
        job: obj.JOB,
        introduction: obj.INTRODUCTION,
        photo: obj.PHOTO,
        selected: false,
      }));
      checkStakeholderVisited(stakeholders);
    }
    function onFailure(e) {
      setErrorBannerMessage('Failed to get stakeholder data! Please refresh the page.');
      setErrorBannerFade(true);
    }
    setFetchConversationsHad({
      data: null,
      loading: true,
      error: null,
    });
    getEditor(setFetchData, endpointStakeholdersGET, onFailure, onSuccess);
  };
  useEffect(getData, []);

  const [fetchConversationsHad, setFetchConversationsHad] = useState({
    data: null,
    loading: false,
    error: null,
  });
  const checkStakeholderVisited = (stakeholders) => {
    function onSuccess(response) {
      const stakeholdersSelected = response.data;
      stakeholdersSelected.forEach((selectedStakeholder) => {
        stakeholders.filter((stakeholder) => stakeholder.id === selectedStakeholder.STAKEHOLDER_ID)[0].selected = true;
      });
      setNumStakeholderTalkedTo(stakeholdersSelected.length);
      // TODO check with session time rather than stakeholdersSelected
      if (stakeholdersSelected.length > 0) {
        setHasTalkedWithStakeholders(true);
      }
      setStakeholders(stakeholders);
    }

    function onFailure(e) {
      setErrorBannerMessage('Failed to get stakeholder data! Please refresh the page.');
      setErrorBannerFade(true);
    }

    getSimulator(setFetchConversationsHad, endpointConversationsHadGET, onFailure, onSuccess);
  };

  // eslint-disable-next-line
  const [postConversationHad, setPostConversationHad] = useState({
    data: null,
    loading: false,
    error: null,
  });
  function getStakeholderCards(
    id,
    name,
    job,
    description,
    introduction,
    selected,
    photo,
    styles,
  ) {
    function onClickStakeholder() {
      function onSuccess() {
        setCurrentStakeholder(() => ({
          name,
          id,
          job,
          description,
          introduction,
          photo,
          selected: true,
        }));
        const stakeholdersCopy = [...stakeholders];
        stakeholdersCopy.filter((stakeholder) => stakeholder.id === id)[0].selected = true;
        setNumStakeholderTalkedTo(numStakeholderTalkedTo + 1);
        setStakeholders(stakeholdersCopy);
        setShowStakeholders(false);
        toggleModal(id, false);
      }

      function onFailure(e) {
        setErrorBannerMessage('Failed to get stakeholder data! Please refresh the page.');
        setErrorBannerFade(true);
      }

      const requestBody = {
        SESSION_ID: contextObj.sessionID,
        STAKEHOLDER_ID: id,
      };
      if (!selected) {
        post(setPostConversationHad, endpointPOST, onFailure, onSuccess, requestBody);
      } else {
        setCurrentStakeholder(() => ({
          name,
          id,
          job,
          description,
          introduction,
          photo,
          selected: true,
        }));
        setShowStakeholders(false);
        toggleModal(id, false);
      }
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

    if ((conversationLimit === numStakeholderTalkedTo || hasTalkedWithStakeholders) && !selected) {
      cardClass = `${styles.card} ${styles.disabled}`;
      nameClass = styles.disabled;
    } else {
      cardClass = styles.card;
      nameClass = styles.name;
      jobClass = styles.job;
    }
    return (
      <>
        <Button
          disabled={(conversationLimit === numStakeholderTalkedTo || hasTalkedWithStakeholders) && !selected}
          style={{ textTransform: 'none', minWidth: '100%', width: 'calc(100%)' }}
          onClick={() => toggleModal(id, true)}
        >
          <Paper elevation={2} className={cardClass}>
            <div
              className={classes.stakeholderContainer}
              id="stakeholder-container"
              style={{ display: 'flex', justifyContent: 'center' }}
            >
              <Avatar
                className={classes.stakeholderImg}
                id="stakeholder-img"
                alt="Stakeholder Photo"
                src={photo}
              />
            </div>
            <div id="info-container" className={classes.infoContainer} style={{ flex: 1, minWidth: 'calc(100% - 125px)' }}>
              <Box
                fontSize="20px"
                fontWeight="fontWeightBold"
                className={nameClass}
                align="left"
              >
                <Typography variant="h5" noWrap>
                  {name}
                </Typography>
              </Box>
              <Box
                fontWeight="fontWeightBold"
                className={jobClass}
                align="left"
              >
                <Typography variant="h5" noWrap>
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
          <DialogTitle disableTypography style={{ display: 'flex' }}>
            <Typography
              variant="h5"
              align="center"
              component="div"
              style={{ display: 'flex' }}
            >
              {`Biography of ${name}`}
            </Typography>
            <Button
              className={classes.exitOutButton}
              variant="contained"
              color="primary"
              onClick={() => toggleModal(id, false)}
            >
              <HighlightOffIcon />
            </Button>
          </DialogTitle>
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
            <InnerHTML html={description} />
            <div style={
              {
                display: 'flex',
                justifyContent: 'center',
                marginTop: '1rem',
                marginBottom: '1rem',
              }
            }
            >
              <Button
                disabled={(conversationLimit === numStakeholderTalkedTo || hasTalkedWithStakeholders) && !selected}
                variant="contained"
                onClick={onClickStakeholder}
                color="primary"
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

  function getStakeholdersGrid(selected) {
    if (!selected) {
      const stakeholdersNotSelected = stakeholders.filter((stakeholder) => !stakeholder.selected);
      const items = stakeholdersNotSelected.map((stakeholder) => getStakeholderCards(
        stakeholder.id,
        stakeholder.name,
        stakeholder.job,
        stakeholder.description,
        stakeholder.introduction,
        stakeholder.selected,
        stakeholder.photo,
        createdCardStyles,
      ));
      return (
        <div style={{ minWidth: '100%' }}>
          <Grid container spacing={3} justify="center">
            {items.map((item) => (
              <Grid item key={item.stakeholder_id} style={{ minWidth: '100%' }}>
                {item}
              </Grid>
            ))}
          </Grid>
        </div>
      );
    }
    const stakeholdersSelected = stakeholders.filter((stakeholder) => stakeholder.selected);
    const items = stakeholdersSelected.map((stakeholder) => getStakeholderCards(
      stakeholder.id,
      stakeholder.name,
      stakeholder.job,
      stakeholder.description,
      stakeholder.introduction,
      stakeholder.selected,
      stakeholder.photo,
      createdCardStyles,
    ));
    return (
      <div style={{ minWidth: '100%' }}>
        <Grid container spacing={3} justify="center">
          {items.map((item) => (
            <Grid item style={{ minWidth: '100%' }}>{item}</Grid>
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
          onClick={() => getPrevPage(contextObj.activeIndex - 1)}
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
            numStakeholderTalkedTo >= conversationLimit || hasTalkedWithStakeholders
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
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  if (fetchConversationsHad.loading) {
    return (
      <div>
        <div style={{ marginTop: '100px' }}>
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <>
      {Buttons}
      <div className={classes.bannerContainer}>
        <ErrorBanner
          errorMessage={errorBannerMessage}
          fade={errorBannerFade}
        />
      </div>
      {showStakeholders && (
        <div>
          <Grid container direction="row" justify="center" alignItems="center">
            <Box mt={5}>
              <TextTypography variant="h4" align="center" gutterBottom>
                Stakeholders
              </TextTypography>
            </Box>
          </Grid>
          <Grid spacing={2}>
            <Grid item lg={12} md={12} sm={12}>
              <Box m="1rem" align="center">
                <TextTypography>
                  You have
                  {' '}
                  <b>
                    {stakeholders.length}
                  </b>
                  {' '}
                  stakeholders to choose from.
                </TextTypography>
              </Box>
              <Box m="1rem" align="center">
                <TextTypography>
                  You can choose up to a maximum of
                  {' '}
                  <b>
                    {conversationLimit}
                  </b>
                  {' '}
                  stakeholders.
                </TextTypography>
              </Box>
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
                  available stakeholders.
                </TextTypography>
              </Box>
              <TextTypography variant="body1" align="center">
                {introText}
              </TextTypography>
            </Grid>
            <Grid direction="column">
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
                  label="Stakeholders I've Spoken to"
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
                    {getStakeholdersGrid(false)}
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
                    {getStakeholdersGrid(true)}
                  </div>
                </Grid>
              </TabPanel>
            </Grid>
          </Grid>
        </div>
      )}
      {!showStakeholders && (
        <Conversation
          sessionID={contextObj.sessionID}
          stakeholder={currentStakeholder}
          showStakeholders={showStakeholders}
          scenarioID={scenarioID}
          setShowStakeholders={setShowStakeholders}
        />
      )}
    </>
  );
}
