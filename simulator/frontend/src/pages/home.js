import React from 'react';
import PropTypes from 'prop-types'
import '../App.css';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import {Grid, Paper, Button, Tabs, Tab, Box, Typography} from '@material-ui/core';
import {useEffect, useState} from "react";
import ScenarioCard from './components/scenarioCard';
import CodeButton from './components/classCodeDialog';

const useStyles = makeStyles((theme) => ({
 root: {
   flexGrow: 1,
 },
 paper: {
   padding: theme.spacing(2),
   textAlign: 'left',
   color: theme.palette.text.secondary,
   background: theme.palette.primary,
   '&:hover': {
     transform: "scale3d(1.05, 1.05, 1)",
     backgroundColor: '#f3e4e3'
    
   }
 },

 button: {
   variant: 'contained',
   color: 'primary',
 },
 grid: {
   justifyContent: "center",
   textAlign: "center",
   width: '100%',
   margin: '0px',
 },
 button: {
   variant: 'contained',
   color: 'white',
   background: 'black',
 },
 
}));
 
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
  root:{
    
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
 
 const [scenarios, setScenarios] =useState({         //temporary array of scenarios
   incompleteScenarios : [
     {
       title : "Google Advertising",
       course : " CS 220",
       date : "Modified 2/10/20"
     },
     {
       title : "Test Scenario",
       course : " CS 230",
       date : "Modified 2/11/20"
     },
     {
       title : "UMass Test Ethics",
       course : " CS 250",
       date : "Modified 3/10/20"
     }
   ],
   completeScenarios : [
     {
     title : "Google Advertising B",
     course : " CS 220",
     date : "Modified 2/10/20"
   },
   {
     title : "Test Scenario B",
     course : " CS 230",
     date : "Modified 2/11/20"
   },
   {
     title : "UMass Test Ethics B",
     course : " CS 250",
     date : "Modified 3/10/20"
   }
   ]
 });
 
 

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

 const classes = useStyles();
 return (
   <div className={classes.root}>
     <StyledTabs value={value} variant='fullWidth' centered onChange={handleChange} aria-label="simple tabs example">
          <StyledTab label="In Progress Scenarios" {...a11yProps(0)} />
          <StyledTab className={classes.tab} label="Completed Scenarios" {...a11yProps(1)} />
      </StyledTabs>
      <TabPanel value={value} index={0}>
      <Grid container spacing={2} className={classes.grid}>   {/*incomplete scenarios section*/}
       <Grid container direction="row" item xs={12} justify="space-evenly" alignItems="baseline">
         <h1>To Do</h1>
       </Grid>
       {scenarios.incompleteScenarios.map(scenario => (
       <Grid item xs={12} sm={6} md={4} lg={3}>
           <Paper elevation={5} className={classes.paper}>
             <ScenarioCard
               title = {scenario.title}
               course = {scenario.course}
               date = {scenario.date}
             />
             <Button className={classes.button}>Select Scenario</Button>
           </Paper>
       </Grid>
       ))}
       <Grid container direction="row" item xs={12} justify="space-evenly" alignItems="center">
        <Box m={2} pt={3}>
          <CodeButton />
        </Box>
       </Grid>
     </Grid>
      </TabPanel>
      <TabPanel value={value} index={1}>
      <Grid container spacing={2} className={classes.grid}>     {/*completed scenarios section*/}
       <Grid item xs={12}>
         <h1>Completed</h1>
       </Grid>
       {scenarios.completeScenarios.map(scenario => (
       <Grid item xs={12} sm={6} md={4} lg={3}>
         <Paper elevation={5} className={classes.paper}>
         <ScenarioCard
             title = {scenario.title}
             course = {scenario.course}
             date = {scenario.date}
           />
           <Button className={classes.button}>Select Scenario</Button>
         </Paper>
       </Grid>
       ))}
     </Grid>
      </TabPanel>
     
 
     
   </div>
 );
}
