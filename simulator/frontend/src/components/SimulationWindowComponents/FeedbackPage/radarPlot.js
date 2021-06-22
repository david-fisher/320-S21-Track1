import React, {
  useState, useEffect, useRef, useContext,
} from 'react';
import Chart from 'chart.js';
import {
  Grid,
  Tab,
  Tabs,
  Box,
  Typography,
  Table,
  TableCell,
  TableRow,
  TableHead,
  TableContainer,
  TableBody,
  Paper,
  makeStyles,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import get from '../../../universalHTTPRequestsSimulator/get';
import ErrorBanner from '../../Banners/ErrorBanner';
import GlobalContext from '../../../Context/GlobalContext';
import LoadingSpinner from '../../LoadingSpinner';
import GenericHelpButton from '../../HelpButton/GenericHelpButton';
import { RadarPlotHelpInfo } from './radarPlotHelpInfo';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    color: '#5b7f95',
  },
  errorContainer: {
    marginTop: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  backButton: {
    marginLeft: '0rem',
    marginRight: '0rem',
    marginTop: '1rem',
  },
  nextButton: {
    marginRight: '0rem',
    marginTop: '1rem',
  },
  button: {
    width: '100%',
    textTransform: 'unset',
  },
  bannerContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
}));

// eslint-disable-next-line
const TextTypography = withStyles({
  root: {
    color: '#373a3c',
  },
})(Typography);

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

Radar.propTypes = {
  scenarioID: PropTypes.number.isRequired,
};
export default function Radar({ scenarioID }) {
  const classes = useStyles();
  const chartContainer = useRef(null);
  // eslint-disable-next-line
  const [contextObj, setContextObj] = useContext(GlobalContext);
  // eslint-disable-next-line
  const [chartInstance, setChartInstance] = useState(null);
  const [coverage, setCoverage] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [totalScore, setTotalScore] = useState(-1);
  const endpointGet = `/scenarios/radar?userId=${contextObj.userID}&scenarioId=${scenarioID}`;
  // eslint-disable-next-line
  const [fetchRadarData, setFetchRadarData] = useState({
    data: null,
    loading: false,
    error: null,
  });
  // eslint-disable-next-line
  const [shouldFetch, setShouldFetch] = useState(0);

  const getData = () => {
    function onSuccess(response) {
      setCoverage(response.data.result);
      createChart(response.data.result);
    }

    function onFailure(e) {
      setErrorBannerMessage('Failed to get Radar Plot data. Please refresh the page.');
      setErrorBannerFade(true);
    }
    get(setFetchRadarData, endpointGet, onFailure, onSuccess);
  };

  useEffect(getData, [shouldFetch]);

  // Max total_coverage score is 3, minimum is 0
  // Sum of importance_coverage scores divided by max number of stakeholders that a user can talk to
  function colorLimit(average) {
    if (average >= 0.4) {
      return 'rgba(0, 128, 0, 0.2)'; // Green if average percentage above 2
    }
    if (average >= 0.2) {
      return 'rgba(255, 255, 0, 0.2)'; // Yellow if average percentage above 1
    }

    return 'rgba(255, 0, 0, 0.2)'; // Red if average percentage below 0
  }

  function createChart(cov) {
    if (cov.length > 0) {
      const lbls = cov.map((x) => x.name);
      const vals = cov.map((x) => x.student_percentage);
      const importanceCoverage = cov.map((x) => x.importance_coverage);
      const totalWeight = importanceCoverage.reduce((a, b) => a + b) / contextObj.numConversations;
      setTotalScore(totalWeight);
      const config = {
        type: 'radar',
        data: {
          labels: lbls,
          datasets: [
            {
              label: 'Your Issue Coverage',
              backgroundColor: colorLimit(totalWeight),
              data: vals,
            },
          ],
        },
        options: {
          elements: {
            line: {
              borderWidth: 3,
            },
          },
          scale: {
            pointLabels: {
              fontSize: 12,
            },
            ticks: {
              beginAtZero: true,
              max: 100,
              min: 0,
              stepSize: 20,
              callback(value, index, values) {
                return `${value}%`;
              },
            },
          },
          legend: {
            labels: {
              fontSize: 20,
            },
          },
        },
      };

      if (chartContainer && chartContainer.current) {
        const newChartInstance = new Chart(chartContainer.current, config);
        setChartInstance(newChartInstance);
      }
    }
  }

  useEffect(() => {
    createChart(coverage);
  // eslint-disable-next-line
  }, [tabValue]);

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const [errorBannerMessage, setErrorBannerMessage] = useState('');
  const [errorBannerFade, setErrorBannerFade] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setErrorBannerFade(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [errorBannerFade]);

  return (
    <div>
      <div className={classes.bannerContainer}>
        <ErrorBanner
          errorMessage={errorBannerMessage}
          fade={errorBannerFade}
        />
      </div>
      <GenericHelpButton
        description={RadarPlotHelpInfo}
        title="Radar Plot"
      />
      <Typography>
        The summary value is a score that combines the degree of coverage with the importance of the issues covered.
      </Typography>
      <Typography>
        {'score >= 0.4: Good coverage behavior'}
      </Typography>
      <Typography>
        {'0.4 >= score >= 0.2: Ok coverage behavior'}
      </Typography>
      <Typography>
        {'0.2 >= score >= 0: Poor coverage behavior'}
      </Typography>
      {totalScore !== -1
        ? (
          <Typography variant="h6">
            {`Total Summary Value Score: ${totalScore}`}
          </Typography>
        ) : null}
      <StyledTabs
        value={tabValue}
        variant="fullWidth"
        centered
        onChange={handleChange}
        aria-label="simple tabs example"
      >
        <StyledTab label="Radar View" {...a11yProps(0)} />
        <StyledTab label="List View" {...a11yProps(1)} />
      </StyledTabs>
      <Grid container direction="column" justify="center">
        <TabPanel value={tabValue} index={0}>
          <div>
            <Grid container direction="row" justify="center">
              { fetchRadarData.loading
                ? <LoadingSpinner />
                : <canvas ref={chartContainer} id="coverage-plot" /> }
            </Grid>
          </div>
        </TabPanel>
      </Grid>

      <Grid container direction="column" justify="center">
        <TabPanel value={tabValue} index={1}>
          <Grid container direction="row" justify="center">
            { fetchRadarData.loading
              ? <LoadingSpinner />
              : (
                <TableContainer component={Paper}>
                  <Table aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Issue</TableCell>
                        <TableCell align="right">Issue Importance Score (0-5)</TableCell>
                        <TableCell align="right">Issue Coverage&nbsp;(%)</TableCell>
                        <TableCell align="right">Total Coverage Score (0-1)</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {coverage.map((row) => (
                        <TableRow key={row.name}>
                          <TableCell component="th" scope="row">
                            {row.name}
                          </TableCell>
                          <TableCell align="right">{row.importance_score}</TableCell>
                          <TableCell align="right">
                            {row.student_percentage.toFixed(2)}
                            %
                          </TableCell>
                          <TableCell align="right">{row.importance_coverage.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
          </Grid>
        </TabPanel>
      </Grid>
    </div>
  );
}
