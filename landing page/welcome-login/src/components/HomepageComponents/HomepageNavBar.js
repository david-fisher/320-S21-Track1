import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  AppBar, Toolbar, Typography,
} from '@material-ui/core/';
import WhiteLogo from '../../shared/WhiteLogo.png';
import UMassLogo from '../../shared/longform.svg';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    margin: theme.spacing(0),
    padding: theme.spacing(0),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  umasslogo: {
    height: '30px',
    margin: theme.spacing(1),
    marginRight: '15px',
    '@media (max-width:500px)': {
      marginRight: '5px',
      height: '20px',
    },
  },
  logo: {
    height: '50px',
    margin: theme.spacing(1),
    '@media (max-width:530px)': {
      display: 'none',
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
      <AppBar position="static" className={classes.root}>
        <Toolbar>
          <img src={UMassLogo} alt="UMassLogo" className={classes.umasslogo} />
          <img src={WhiteLogo} alt="EthismLogo" className={classes.logo} />
          <Typography className={classes.title} variant="h5" />
        </Toolbar>
      </AppBar>
    </div>
  );
}
