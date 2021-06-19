import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import '../App.css';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import {
  Grid,
  Paper,
  Button,
  Tabs,
  Tab,
  Box,
  Typography,
} from '@material-ui/core';
import ErrorIcon from '@material-ui/icons/Error';
import RefreshIcon from '@material-ui/icons/Refresh';
import ScenarioCard from '../components/scenarioCard';
import LoadingSpinner from '../components/LoadingSpinner';
import getSimulator from '../universalHTTPRequestsSimulator/get';
import CodeButton from '../components/classCodeDialog';
import ErrorBanner from '../components/Banners/ErrorBanner';
import SuccessBanner from '../components/Banners/SuccessBanner';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  errorContainer: {
    marginTop: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  bannerContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'left',
    color: theme.palette.text.secondary,
    background: theme.palette.primary,
    '&:hover': {
      transform: 'scale3d(1.05, 1.05, 1)',
      backgroundColor: '#f3e4e3',
    },
  },
  grid: {
    justifyContent: 'center',
    textAlign: 'center',
    width: '100%',
    margin: '0px',
  },
  button: {
    variant: 'contained',
    color: 'white',
    background: 'black',
  },
  issue: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  iconError: {
    paddingRight: theme.spacing(2),
    fontSize: '75px',
  },
  iconRefreshLarge: {
    fontSize: '75px',
  },
  iconRefreshSmall: {
    fontSize: '30px',
  },
}));

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

Home.propTypes = {
  location: PropTypes.any,
};
export default function Home(props) {
  const classes = useStyles();
  // post on success, concatenating a scenario card to array
  // delete on success, concatenating a scenario card to array
  // when posting a new scenario setting fake id, now deleting that scenario, have to replace id with id in database
  // post returns new id of scenario, when you concatenating to array set the id to that
  const [scenarioList, setScenarioList] = useState({
    // temporary array of scenarios
    incompleteScenarios: null,
    completeScenarios: null,
  });
  const [fetchScenariosResponse, setFetchScenariosResponse] = useState({
    data: null,
    loading: false,
    error: false,
  });
  const [successBannerMessage, setSuccessBannerMessage] = useState('');
  const [successBannerFade, setSuccessBannerFade] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSuccessBannerFade(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [successBannerFade]);
  const history = useHistory();
  const userID = props.location.data ? props.location.data.userData.userId : history.push('/loginSimulator');
  // Get Scenario
  // addCourse - to trigger success banner for successfully adding a course
  const getData = (addCourse) => {
    function onSuccess(response) {
      let scenarios = response.data[0].COURSES.filter((data) => data.SCENARIOS.length > 0).map((data) => ({
        title: data.SCENARIOS[0].NAME,
        numConversations: data.SCENARIOS[0].NUM_CONVERSATION,
        isFinished: false,
        date: data.SCENARIOS[0].DATE_CREATED,
        scenarioID: data.SCENARIOS[0].SCENARIO,
        firstPage: data.SCENARIOS[0].FIRST_PAGE,
        courses: [data.NAME],
        userID,
      }));
      const scenarioMap = new Map();
      // For duplicated scenarios with multiple courses
      scenarios.forEach((data) => {
        console.log(data);
        if (scenarioMap.has(data.scenarioID)) {
          const newScenarioData = scenarioMap.get(data.scenarioID);
          newScenarioData.courses.push(data.courses[0]);
          scenarioMap.set(data.scenarioID, newScenarioData);
        } else {
          scenarioMap.set(data.scenarioID, data);
        }
      });
      scenarios = Array.from(scenarioMap, ([name, value]) => (value));
      function onSuccessSessions(resp) {
        scenarios.forEach((obj) => {
          if (resp.data.filter((o) => o.SCENARIO_ID === obj.scenarioID).length) {
            obj.isFinished = resp.data.filter((o) => o.SCENARIO_ID === obj.scenarioID)[0].IS_FINISHED;
          }
        });
        const scen = {
          incompleteScenarios: scenarios.filter((s) => !s.isFinished),
          completeScenarios: scenarios.filter((s) => s.isFinished),
        };
        setScenarioList(scen);
        if (addCourse) {
          setSuccessBannerMessage(
            'Successfully added course!',
          );
          setSuccessBannerFade(true);
        }
      }

      getSimulator(
        setFetchScenariosResponse,
        '/api/sessions/',
        onFailure,
        onSuccessSessions,
      );
    }

    function onFailure(e) {
      setErrorBannerMessage('Failed to get scenarios! Please refresh the page.');
      setErrorBannerFade(true);
    }

    const endpointGet = '/dashboard?user_id=';
    getSimulator(
      setFetchScenariosResponse,
      `${endpointGet}${userID}`,
      onFailure,
      onSuccess,
    );
  };

  const [errorBannerMessage, setErrorBannerMessage] = useState('');
  const [errorBannerFade, setErrorBannerFade] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setErrorBannerFade(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [errorBannerFade]);

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

  useEffect(getData, []);

  if (fetchScenariosResponse.loading) {
    return (
      <div>
        <div style={{ marginTop: '100px' }}>
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (fetchScenariosResponse.error) {
    return (
      <div>
        <div className={classes.issue}>
          <div className={classes.errorContainer}>
            <ErrorIcon className={classes.iconError} />
            <Typography align="center" variant="h3">
              Error in fetching Scenarios.
            </Typography>
            <Button variant="contained" color="primary" onClick={getData}>
              <RefreshIcon className={classes.iconRefreshLarge} />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={classes.root}>
      <div className={classes.bannerContainer}>
        <SuccessBanner
          successMessage={successBannerMessage}
          fade={successBannerFade}
        />
        <ErrorBanner
          errorMessage={errorBannerMessage}
          fade={errorBannerFade}
        />
      </div>
      <StyledTabs
        value={value}
        variant="fullWidth"
        centered
        onChange={handleChange}
        aria-label="simple tabs example"
      >
        <StyledTab label="In Progress Scenarios" {...a11yProps(0)} />
        <StyledTab label="Completed Scenarios" {...a11yProps(1)} />
      </StyledTabs>
      <TabPanel value={value} index={0}>
        <Grid container spacing={2} className={classes.grid}>
          {' '}
          {/* incomplete scenarios section */}
          <CodeButton userID={userID} getData={getData} />
          <Grid
            container
            direction="row"
            item
            xs={12}
            justify="space-evenly"
            alignItems="baseline"
          >
            <Typography variant="h2">To-Do</Typography>
          </Grid>
          {scenarioList.incompleteScenarios ? scenarioList.incompleteScenarios.map((scenario) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={scenario.scenarioID}>
              <Paper elevation={5} className={classes.paper}>
                <ScenarioCard
                  finished={false}
                  title={scenario.title}
                  courses={scenario.courses}
                  date={scenario.date}
                />
                <Button
                  component={Link}
                  to={{
                    pathname: `/simulation/${scenario.scenarioID}/${scenario.firstPage}`,
                    data: scenario,
                  }}
                  className={classes.button}
                  variant="contained"
                  color="primary"
                >
                  Select Scenario
                  {' '}
                </Button>
              </Paper>
            </Grid>
          )) : null}
        </Grid>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Grid container spacing={2} className={classes.grid}>
          {' '}
          {/* completed scenarioList section */}
          <CodeButton userID={userID} />
          <Grid item xs={12}>
            <Typography variant="h2">Completed</Typography>
          </Grid>
          {scenarioList.completeScenarios ? scenarioList.completeScenarios.map((scenario) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={scenario.scenarioID}>
              <Paper elevation={5} className={classes.paper}>
                <ScenarioCard
                  finished
                  title={scenario.title}
                  courses={scenario.courses}
                  date={scenario.date}
                />
                <Button
                  component={Link}
                  to={{
                    pathname: `/simulation/${scenario.scenarioID}/${scenario.firstPage}`,
                    data: scenario,
                  }}
                  className={classes.button}
                  variant="contained"
                  color="primary"
                >
                  Review Scenario
                </Button>
              </Paper>
            </Grid>
          )) : null}
        </Grid>
      </TabPanel>
    </div>
  );
}
