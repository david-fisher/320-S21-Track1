import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  AppBar, Toolbar, Typography, Button,
} from '@material-ui/core/';
import { Link } from 'react-router-dom';
import WhiteLogo from '../../shared/WhiteLogo.png';
import UMassLogo from '../../shared/longform.svg';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: '100%',
    margin: theme.spacing(0),
    padding: theme.spacing(0),
  },
  umasslogo: {
    height: '30px',
    margin: theme.spacing(1),
    marginRight: '15px',
    '@media (max-width:500px)': {
      marginRight: '5px',
    },
  },
  logo: {
    height: '50px',
    position: 'absolute',
    left: '50%',
    top: '40%',
    transform: 'translate(-50%, -50%)',
    margin: theme.spacing(1),
    marginRight: '15px',
    '@media (max-width:500px)': {
      marginRight: '5px',
    },
  },
  title: {
    flexGrow: 1,
    '@media (max-width:500px)': {
      fontSize: '15px',
    },
  },
  signupButton: {
    backgroundColor: 'white',
    marginRight: theme.spacing(3),
    padding: theme.spacing(1.5),
    paddingBottom: 0,
    paddingTop: 0,
    textTransform: 'unset',
    borderStyle: 'solid',
    borderColor: 'white',
    border: 2,
    '@media (max-width:500px)': {
      marginRight: theme.spacing(0.5),
      padding: theme.spacing(1),
    },
  },
  loginButton: {
    backgroundColor: theme.palette.primary.main,
    marginRight: theme.spacing(3),
    padding: theme.spacing(1.5),
    paddingBottom: 0,
    paddingTop: 0,
    textTransform: 'unset',
    borderStyle: 'solid',
    borderColor: 'white',
    border: 2,
    '@media (max-width:500px)': {
      marginRight: theme.spacing(0.5),
      padding: theme.spacing(1),
    },
  },
  signupButtonText: {
    color: theme.palette.primary.main,
    '@media (max-width:500px)': {
      fontSize: '13px',
    },
  },
  loginButtonText: {
    color: 'white',
    '@media (max-width:500px)': {
      fontSize: '13px',
    },
  },
}));

export default function HomepageNavBar() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <img src={UMassLogo} alt="UMassLogo" className={classes.umasslogo} />
          <img src={WhiteLogo} alt="EthismLogo" className={classes.logo} />
          <Typography className={classes.title} variant="h5" />

          <Button
            component={Link}
            // to={'/login'}
            // onClick={() => window.location.href = 'https://ethisim1.cs.umass.edu/Shibboleth.sso/Login'}
            onClick={() => (window.location.href = '/Shibboleth.sso/Login?target=/wait')}
            className={classes.signupButton}
            variant="contained"
          >
            <Typography variant="h6" className={classes.signupButtonText}>
              Log In
            </Typography>
          </Button>
        </Toolbar>
      </AppBar>
    </div>
  );
}
