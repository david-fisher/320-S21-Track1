import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
import get from '../universalHTTPRequestsEditor/get';
// eslint-disable-next-line
import CodeButton from '../components/classCodeDialog';
// eslint-disable-next-line
import ProgressBar from '../components/progressBar';
import { STUDENT_ID } from '../constants/config';
import ErrorBanner from '../components/Banners/ErrorBanner';

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
}));

// TODO change when backend gets implemented
const endpointGet = '/dashboard?professor_id=';
// eslint-disable-next-line
const endpointPost = "/dashboard";

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

export default function Home() {
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
  // eslint-disable-next-line
  const [shouldFetch, setShouldFetch] = useState(0);

  // Get Scenario
  const getData = () => {
    function onSuccess(response) {
      console.log(response);
      let incomplete = [];
      // response.data.result.filter((data) => !data.is_finished);
      const complete = [];
      // response.data.result.filter((data) => data.is_finished);
      incomplete = response.data.map((data) => ({
        title: data.NAME,
        numConversations: data.NUM_CONVERSATION,
        isFinished: false,
        date: data.DATE_CREATED,
        scenarioID: data.SCENARIO,
        firstPage: null,
        courses: data.COURSES,
      }));
      // TODO temporary requests to get first Page field
      incomplete.forEach((obj) => {
        function onSuccess(resp) {
          obj.firstPage = resp.data.PAGES.filter(({ PAGE_TYPE }) => PAGE_TYPE === 'I')[0].PAGE;
          const scen = {
            incompleteScenarios: incomplete,
            completeScenarios: complete,
          };
          setScenarioList(scen);
        }
        get(
          setFetchScenariosResponse,
          `/logistics?scenario_id=${obj.scenarioID}`,
          null,
          onSuccess,
        );
      });

      /*
      complete = complete.map((data) => ({
        title: data.name,
        num_conversations: data.num_conversation,
        is_finished: data.is_finished,
        date: data.last_date_modified,
        scenarioID: data.scenarioID,
        firstPage: data.firstPage,
        course: data.course_name,
      }));
      */
    }

    function onFailure() {
      setErrorBannerMessage('Failed to get scenarios! Please try again.');
      setErrorBannerFade(true);
    }
    get(
      setFetchScenariosResponse,
      endpointGet + STUDENT_ID,
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

  useEffect(getData, [shouldFetch]);

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
        <ErrorBanner errorMessage={errorBannerMessage} fade={errorBannerFade} />
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
                  {scenario.firstPage}
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
                {/* <ProgressBar completed={scenario.completed} max={scenario.max} size={10} /> */}
              </Paper>
            </Grid>
          )) : null}
        </Grid>
      </TabPanel>
    </div>
  );
}
