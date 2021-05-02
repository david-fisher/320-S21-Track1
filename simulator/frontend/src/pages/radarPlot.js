import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js';
import { Button, Grid, Tab, Tabs, Box, Typography} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { BACK_URL, STUDENT_ID, SCENARIO_ID } from "../constants/config";
import PropTypes from 'prop-types';
import get from '../universalHTTPRequests/get';

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

function Radar() {
    const chartContainer = useRef(null);
    const [chartInstance, setChartInstance] = useState(null);
    const [coverage, setCoverage] = useState([]);


    const endpointGet = '/scenarios/radar?userId=' + STUDENT_ID + "&versionId=" + 1;

    const [fetchScenariosResponse, setFetchScenariosResponse] = useState({
        data: null,
        loading: false,
        error: null,
    });
    const [shouldFetch, setShouldFetch] = useState(0);


    let getData = () => {
        function onSuccess(response) {
            setCoverage(response.data.result);
            createChart(response.data.result);
        }

        function onFailure(err) {
            console.log('Error');
        }
        get(setFetchScenariosResponse, (endpointGet), onFailure, onSuccess);
    }

    useEffect(getData, [shouldFetch]);

    function colorLimit(value) {
        if (value < 1.5) {
            return "rgba(255, 0, 0, 0.2)"
        }
        else if (value < 2.5) {
            return "rgba(255, 255, 0, 0.2)"
        }
        else {
            return "rgba(0, 128, 0, 0.2)"
        }
    }

    function createChart(cov, num) {
        let lbls = cov.map(x => x.name);
        let vals = cov.map(x => x.percentage);
        let config = {
            type: 'radar',
            data: {
                labels: lbls,
                datasets: [{
                    label: "Your Coverage",
                    backgroundColor: colorLimit(num),
                    data: vals,
                }]
            },
            options: {
                elements: {
                    line: {
                        borderWidth: 3
                    }
                },
                scale: {
                    pointLabels: {
                        fontSize: 12
                    },
                    ticks: {
                        beginAtZero: true,
                        max: 100,
                        min: 0,
                        stepSize: 20,
                        callback: function (value, index, values) {
                            return value + '%';
                        },

                    }
                },
                legend: {
                    labels: {
                        fontSize: 20,
                    }
                }
            }
        };

        if (chartContainer && chartContainer.current) {
            const newChartInstance = new Chart(chartContainer.current, config);
            setChartInstance(newChartInstance);
        }
    }

    function a11yProps(index) {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        };
    }
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        console.log(newValue);
        setValue(newValue);
        createChart(coverage,5);
    };

    return (
        <div>

            <Grid container>
                <Grid container direction="row" justify="center">
                    <h3>Coverage Of Issues</h3>
                </Grid>
                <Grid container direction="row" justify="space-around">
                    <Button
                        variant="contained"
                        disableElevation
                    >
                        Back
          </Button>
                    <Button variant="contained" color="primary" disableElevation>
                        Next
          </Button>
                </Grid>
                <StyledTabs value={value} variant='fullWidth' centered onChange={handleChange} aria-label="simple tabs example">
                    <StyledTab label="Radar View" {...a11yProps(0)} />
                    <StyledTab label="List View" {...a11yProps(1)} />
                </StyledTabs>
                <Grid container direction="row" justify="center">
                <TabPanel value={value} index={0}>
                    <div>
                    <Grid container direction="row" justify="center">
                        <canvas ref={chartContainer} id="coverage-plot" />
                    </Grid>
                    </div>
                </TabPanel>
                </Grid>

                <Grid container direction="row" justify="center">
                <TabPanel value={value} index={1}>
                    <Grid container direction="row" justify="center">
                        Hey
                    </Grid>
                </TabPanel>
                </Grid>
            </Grid>
        </div >
    );
};

export default Radar;