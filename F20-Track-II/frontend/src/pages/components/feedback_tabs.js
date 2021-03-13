import React from 'react';
import PropTypes from 'prop-types';
import {
    withStyles,
    Typography,
    Box,
    Grid,
    Button,
    makeStyles,
  } from "@material-ui/core";
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';


const TextTypography = withStyles({
    root: {
      color: "#373a3c",
      whiteSpace: "pre-line",
    },
  })(Typography);

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
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

function a11yProps(index) {
  return {
    id: `scrollable-auto-tab-${index}`,
    'aria-controls': `scrollable-auto-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  textBox: {
    overflowY: "auto",
    maxHeight: window.innerHeight * 0.6,
    marginTop: theme.spacing(0.5),
    borderRadius: "5px",
    boxShadow: "0px 0px 2px",
  },
}));

const issuesText =
  ["These are unprecedented times, at least by information age standards. Much of the U.S. economy has ground to a halt, and social norms about our data and our privacy have been thrown out the window throughout much of the world. Moreover, things seem likely to keep changing until a vaccine or effective treatment for COVID-19 becomes available. All this change could wreak havoc on artificial intelligence (AI) systems. Garbage in, garbage out still holds in 2020. The most common types of AI systems are still only as good as their training data. If there’s no historical data that mirrors our current situation, we can expect our AI systems to falter, if not fail. \n\n To date, at least 1,200 reports of AI incidents have been recorded in various public and research databases. That means that now is the time to start planning for AI incident response, or how organizations react when things go wrong with their AI systems. While incident response is a field that’s well developed in the traditional cybersecurity world, it has no clear analogue in the world of AI.  What is an incident when it comes to an AI system? When does AI create liability that organizations need to respond to? This article answers these questions, based on our combined experience as both a lawyer and a data scientist responding to cybersecurity incidents, crafting legal frameworks to manage the risks of AI, and building sophisticated interpretable models to mitigate risk. Our aim is to help explain when and why AI creates liability for the organizations that employ it, and to outline how organizations should react when their AI causes major problems.",
  "Artificial intelligence and its applications are endless. Technology and AI applications can be applied in many different sectors and industries to generate the maximum output out of the operational front. In the current time period, AI is being tested and used in the healthcare industry for dosing drugs and different treatment in patients, and for surgical procedures in the operating rooms as well.",
  "Information technology is the study, design, development, implementation, support or management of computer-based information systems—particularly software applications and computer hardware. IT workers help ensure that computers work well for people.",
]

export default function ScrollableTabsButtonAuto() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
    <Box mt={5}>
      <AppBar position="static" color='default' >
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          aria-label="scrollable auto tabs example"
        >
          <Tab label="Incorrect ML-generated advice can cause harm at large." {...a11yProps(0)} />
          <Tab label="What people are saying in the real world." {...a11yProps(1)} />
          <Tab label="Another one." {...a11yProps(2)} />
          {/* <Tab label="Issue Four" {...a11yProps(3)} />
          <Tab label="Issue Five" {...a11yProps(4)} />
          <Tab label="Issue Six" {...a11yProps(5)} />
          <Tab label="Issue Seven" {...a11yProps(6)} /> */}
        </Tabs>
      </AppBar>
      </Box>
      <TabPanel value={value} index={0}>
        <Box p={2} className={classes.textBox}>
            <TextTypography variant="body1">{issuesText[0]}</TextTypography>
        </Box>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Box p={2} className={classes.textBox}>
            <TextTypography variant="body1">{issuesText[1]} <a href='https://en.wikipedia.org/wiki/Ethics_of_artificial_intelligence#:~:text=Machine%20ethics%20(or%20machine%20morality,morally%20or%20as%20though%20moral.&text=More%20recently%2C%20academics%20and%20many,can%20itself%20be%20held%20accountable.' target="_blank">Click here for more information.</a></TextTypography>
        </Box>
      </TabPanel>
      <TabPanel value={value} index={2}>
      <Box p={2} className={classes.textBox}>
            <TextTypography variant="body1">{issuesText[2]}</TextTypography>
          </Box>
      </TabPanel>
    </div>
  );
}