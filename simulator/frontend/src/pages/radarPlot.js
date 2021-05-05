import React, { useState, useEffect, useRef, Component } from 'react';
import Chart from 'chart.js';
import { Button, Grid, Tab, Tabs, Box, Typography, Table, TableCell, TableRow, TableHead, TableContainer, TableBody, Paper } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { BACK_URL, STUDENT_ID, SCENARIO_ID } from "../constants/config";
import PropTypes from 'prop-types';
import get from '../universalHTTPRequests/get';

const TextTypography = withStyles({
    root: {
        color: "#373a3c"
    }
})(Typography);

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
    const [version_id, set_version_id] = useState(0);
    const [coverage, setCoverage] = useState([]);
    const [value, setValue] = React.useState(0); 
   

    const endpointGet = '/scenarios/radar?userId=' + STUDENT_ID + "&versionId=" + version_id;

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

    function colorLimit(average) {
        if (average >= 60) {
            return "rgba(0, 128, 0, 0.2)"  // Green if average percentage above 60%
        }
        else if (average >= 30) {
            return "rgba(255, 255, 0, 0.2)" // Yellow if average percentage above 30%
        }
        else {
            return "rgba(255, 0, 0, 0.2)"   // Red if average percentage below 30%
        }
    }
    useEffect(() => {
        createChart(coverage);
    }, [value]);

    function createChart(cov) {
        if(cov.length > 0){
            let lbls = cov.map(x => x.name);
            let vals = cov.map(x => x.percentage);
            let average = vals.reduce((a, b) => a + b) / vals.length;
            console.log(average)
            let config = {
                type: 'radar',
                data: {
                    labels: lbls,
                    datasets: [{
                        label: "Your Coverage",
                        backgroundColor: colorLimit(average),
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
    }

    function a11yProps(index) {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        };
    }

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    
    return (
        <div>
            <Grid container direction="row" justify="center" alignItems="center">
                <Box mt={5}>
                    <TextTypography variant="h4" align="center" gutterBottom>
                        Coverage of Issues
                    </TextTypography>
                </Box>
            </Grid>
            <Grid container direction="row" justify="space-between">
                <Grid item style={{ marginRight: "0rem", marginTop: "-3rem" }}>
                    <Button variant="contained" disableElevation >Back</Button>
                </Grid>
                <Grid item style={{ marginRight: "0rem", marginTop: "-3rem" }}>
                    <Button variant="contained" disableElevation color="primary">Next</Button>
                </Grid>
            </Grid>
            <StyledTabs value={value} variant='fullWidth' centered onChange={handleChange} aria-label="simple tabs example">
                <StyledTab label="Radar View" {...a11yProps(0)} />
                <StyledTab label="List View" {...a11yProps(1)} />
            </StyledTabs>
            <Grid container direction="column" justify="center">
                <TabPanel value={value} index={0}>
                    <div>
                        <Grid container direction="row" justify="center">
                            <canvas ref={chartContainer} id="coverage-plot" />
                        </Grid>
                    </div>
                </TabPanel>
            </Grid>

            <Grid container direction="column" justify="center">
                <TabPanel value={value} index={1}>
                    <Grid container direction="row" justify="center">
                        <TableContainer component={Paper}>
                            <Table aria-label="simple table">
                                <TableHead>
                                <TableRow>
                                    <TableCell>Issue</TableCell>
                                    <TableCell align="right">Your Score</TableCell>
                                    <TableCell align="right">Max Score</TableCell>
                                    <TableCell align="right">Percentage&nbsp;(%)</TableCell>
                                </TableRow>
                                </TableHead>
                                <TableBody>
                                {coverage.map((row) => (
                                    <TableRow key={row.name}>
                                    <TableCell component="th" scope="row">
                                        {row.name}
                                    </TableCell>
                                    <TableCell align="right">{row.coverage}</TableCell>
                                    <TableCell align="right">{row.total}</TableCell>
                                    <TableCell align="right">{row.percentage.toFixed(2)}%</TableCell>
                                    </TableRow>
                                ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                </TabPanel>
            </Grid>
        </div >
    );
};

export default Radar;