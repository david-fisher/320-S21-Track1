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
  ["An ethical dilemma or ethical paradox is a decision-making problem between two possible moral imperatives, neither of which is unambiguously acceptable or preferable. The complexity arises out of the situational conflict in which obeying would result in transgressing another. Sometimes called ethical paradoxes in moral philosophy, ethical dilemmas may be invoked to refute an ethical system or moral code, or to improve it so as to resolve the paradox.",
  "Information technology is the study, design, development, implementation, support or management of computer-based information systems—particularly software applications and computer hardware. IT workers help ensure that computers work well for people.",
  "The technological singularity—also, simply, the singularity[1]—is a hypothetical point in time at which technological growth becomes uncontrollable and irreversible, resulting in unforeseeable changes to human civilization. According to the most popular version of the singularity hypothesis, called intelligence explosion, an upgradable intelligent agent will eventually enter 'runaway reaction' of self-improvement cycles, each new and more intelligent generation appearing more and more rapidly, causing an 'explosion' in intelligence and resulting in a powerful superintelligence that qualitatively far surpasses all human intelligence. The first use of the concept of a 'singularity' in the technological context was John von Neumann. Stanislaw Ulam reports a discussion with von Neumann 'centered on the accelerating progress of technology and changes in the mode of human life, which gives the appearance of approaching some essential singularity in the history of the race beyond which human affairs, as we know them, could not continue'.[5] Subsequent authors have echoed this viewpoint.[3][6] I. J. Good's 'intelligence explosion' model predicts that a future superintelligence will trigger a singularity. The concept and the term 'singularity' were popularized by Vernor Vinge in his 1993 essay The Coming Technological Singularity, in which he wrote that it would signal the end of the human era, as the new superintelligence would continue to upgrade itself and would advance technologically at an incomprehensible rate. He wrote that he would be surprised if it occurred before 2005 or after 2030. Public figures such as Stephen Hawking and Elon Musk have expressed concern that full artificial intelligence (AI) could result in human extinction. The consequences of the singularity and its potential benefit or harm to the human race have been intensely debated.",
  "Other Issues"
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
          <Tab label="The quandary..." {...a11yProps(0)} />
          <Tab label="Your information gathering and action taken..." {...a11yProps(1)} />
          <Tab label="Some hypothetical outcome of the proposed project" {...a11yProps(2)} />
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
            <TextTypography variant="body1">{issuesText[1]}</TextTypography>
        </Box>
      </TabPanel>
      <TabPanel value={value} index={2}>
      <Box p={2} className={classes.textBox}>
            <TextTypography variant="body1">{issuesText[2]}</TextTypography>
          </Box>
      </TabPanel>
      <TabPanel value={value} index={3}>
      <Box p={2} className={classes.textBox}>
            <TextTypography variant="body1">{issuesText[3]}</TextTypography>
          </Box>
      </TabPanel>
      <TabPanel value={value} index={4}>
      <Box p={2} className={classes.textBox}>
            <TextTypography variant="body1">{issuesText[3]}</TextTypography>
          </Box>
      </TabPanel>
      <TabPanel value={value} index={5}>
      <Box p={2} className={classes.textBox}>
            <TextTypography variant="body1">{issuesText[3]}</TextTypography>
          </Box>
      </TabPanel>
      <TabPanel value={value} index={6}>
      <Box p={2} className={classes.textBox}>
            <TextTypography variant="body1">{issuesText[3]}</TextTypography>
          </Box>
      </TabPanel>
    </div>
  );
}