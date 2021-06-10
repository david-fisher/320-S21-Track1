import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import {
  Container, Typography, Button, Paper,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import Copyright from '../components/Copyright';
import HomepageNavBar from '../components/HomepageComponents/HomepageNavBar';
import Background from '../shared/umass.jpg';
import { DOMAIN } from '../Constants/Config';

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
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  textField: {
    marginTop: theme.spacing(1),
  },
  accessButton: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: '225px',
    textTransform: 'unset',
    borderStyle: 'solid',
    borderColor: 'black',
    border: 2,
  },
  guestButton: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(3),
    marginRight: theme.spacing(1),
    width: '225px',
    textTransform: 'unset',
    borderStyle: 'none',
    borderColor: 'black',
    border: 2,
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
    '@media (min-height:485px)': {
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
}));

function StudentAccess() {
  const classes = useStyles();

  return (
    <div className={classes.buttonsContainer}>
      <Container className={classes.studentButtonsContainer}>
        <Button
          component={Link}
          onClick={() => {
            window.location.href = `${DOMAIN}/Shibboleth.sso/Login?target=/loginSimulator`;
          }}
          className={classes.accessButton}
          variant="contained"
          color="primary"
        >
          <Typography variant="h5" display="block" align="center">
            Log in as Simulator Player
          </Typography>
        </Button>
        <Button
          component={Link}
          onClick={() => {
            window.location.href = `${DOMAIN}/Shibboleth.sso/Login?target=/loginEditor`;
          }}
          className={classes.accessButton}
          variant="contained"
          color="primary"
        >
          <Typography variant="h5" display="block" align="center">
            Log in as Scenario Editor
          </Typography>
        </Button>
      </Container>
      <Container className={classes.studentButtonsContainer}>
        <Button
          className={classes.guestButton}
          variant="contained"
          color="gray"
        >
          <Typography display="block" noWrap>
            Try Ethisim as a Guest
          </Typography>
        </Button>
      </Container>
    </div>
  );
}

const BlackTextTypography = withStyles({
  root: {
    color: '#000000',
  },
})(Typography);

function EthisimIntro() {
  const classes = useStyles();

  return (
    <div className={classes.ethisimIntroContainer}>
      <BlackTextTypography variant="h3" align="center" className={classes.margin}>
        Welcome to
        {' '}
        <b>Ethisim</b>
      </BlackTextTypography>
      <BlackTextTypography align="center" className={classes.margin}>
        Ethisim allows you to easily create and assign ethics
        simulations. Run them for a participation grade, or
        develop them further into longer discussions for class.
      </BlackTextTypography>
    </div>
  );
}

function TotalContainer() {
  const classes = useStyles();

  return (
    <div className={classes.contentContainer}>
      <Paper elevation={0}>
        <EthisimIntro />
        <StudentAccess />
      </Paper>
    </div>
  );
}

export default function Homepage() {
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
