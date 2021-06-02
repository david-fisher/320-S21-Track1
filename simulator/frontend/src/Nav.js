import React from 'react';
import {
  ThemeProvider,
  createMuiTheme,
  makeStyles,
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import {
  HashRouter as Router, Switch, Route, Link, Redirect,
} from 'react-router-dom';
import Home from './pages/home';
import SimulationWindow from './pages/simulationWindow';
import LoginSimulator from './pages/loginSimulator';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    overflowX: 'hidden',
    overflowY: 'hidden',
  },
  menuButton: {
    marginRight: theme.spacing(2),
    backgroundColor: '#ced4da',
  },
  title: {
    flexGrow: 1,
    color: '#FFF',
  },
  link: {
    '&:hover': {
      color: '#000000',
      textDecoration: 'none',
    },
  },
}));

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#881c1c',
    },
  },
  background: {
    color: '#444e58',
  },
});

export const ScenariosContext = React.createContext();

export default function Nav() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Router>
        <div>
          <ThemeProvider theme={theme}>
            <AppBar position="static" color="primary">
              <Toolbar>
                <IconButton
                  edge="start"
                  className={classes.menuButton}
                  color="inherit"
                  aria-label="menu"
                >
                  <MenuIcon />
                </IconButton>
                <Typography variant="h6" className={classes.title}>
                  <Link className={classes.link} to="/">
                    <Button className={classes.title} color="inherit">
                      Home
                    </Button>
                  </Link>
                </Typography>
                <Button
                  onClick={() => (window.location.href = '/Shibboleth.sso/Logout?return=/')}
                  color="inherit"
                >
                  LogOut
                </Button>
              </Toolbar>
            </AppBar>

            {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
            <Switch>
              <Route exact path="/">
                <Redirect to="/dashboard" />
              </Route>
              <Route path="/loginSimulator" component={LoginSimulator} />
              <Route path="/dashboard" render={(props) => <Home {...props} />} />
              <Route
                path="/simulation/:id"
                render={(props) => <SimulationWindow {...props} />}
              />
              <Redirect from="*" to="" />
            </Switch>
          </ThemeProvider>
        </div>
      </Router>
    </div>
  );
}
