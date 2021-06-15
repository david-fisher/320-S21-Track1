import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import {
  Typography, Paper, Button,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import WarningIcon from '@material-ui/icons/Warning';
import Copyright from '../components/Copyright';
import HomepageNavBar from '../components/HomepageComponents/HomepageNavBar';
import Background from '../shared/umass.jpg';

const useStyles = makeStyles((theme) => ({
  container: {
    height: '100%',
    width: '100%',
    minHeight: '100vh',
    backgroundImage: `url(${Background})`,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
  },
  studentAccessContainer: {
    marginTop: '0',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  studentButtonsContainer: {
    marginTop: '0',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    '@media (max-width:500px)': {
      flexDirection: 'column',
    },
  },
  ethisimIntroContainer: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  textField: {
    marginTop: theme.spacing(1),
  },
  margin: {
    margin: theme.spacing(2),
  },
  copyright: {
    backgroundColor: theme.palette.primary.main,
    color: 'white',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    width: '100%',
    marginTop: theme.spacing(1),
    '@media (min-height:575px)': {
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'column',
      justifyContent: 'center',
      bottom: '0px',
      width: '100%',
      position: 'absolute',
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
    },
  },
  contentContainer: {
    marginTop: '50px',
    width: '95%',
    maxWidth: '750px',
    maxHeight: '550px',
    padding: '15px',
  },
  icon: {
    width: '75px',
    height: '75px',
  },
}));

const BlackTextTypography = withStyles({
  root: {
    color: '#000000',
  },
})(Typography);

function EthisimIntro() {
  const classes = useStyles();

  return (
    <div className={classes.ethisimIntroContainer}>
      <WarningIcon className={classes.icon} />
      <BlackTextTypography variant="h3" align="center" className={classes.margin}>
        Access Denied
      </BlackTextTypography>
      <BlackTextTypography align="center" className={classes.margin} variant="h6">
        You do not have permission to access this page. Please contact us if you would like to gain access.
      </BlackTextTypography>
      <Button
        component={Link}
        to={{
          pathname: '/home',
        }}
        variant="contained"
        color="primary"
        style={{ textTransform: 'unset' }}
      >
        <Typography variant="h5" align="center">
          Go back to Homepage
        </Typography>
      </Button>
    </div>
  );
}

function TotalContainer() {
  const classes = useStyles();

  return (
    <div className={classes.contentContainer}>
      <Paper elevation={1}>
        <EthisimIntro />
      </Paper>
    </div>
  );
}

export default function ErrorPage() {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <HomepageNavBar />
      <TotalContainer />
      <Paper square className={classes.copyright}>
        <Copyright />
      </Paper>
    </div>
  );
}
