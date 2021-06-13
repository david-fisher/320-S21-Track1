import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import RefreshIcon from '@material-ui/icons/Refresh';
import ErrorIcon from '@material-ui/icons/Error';
import {
  Button,
  Typography,
  Container,
} from '@material-ui/core';
import LoadingSpinner from '../components/LoadingSpinner';
import get from '../universalHTTPRequestsSimulator/get';
import post from '../universalHTTPRequestsEditor/post';
import { DEV } from '../constants/config';

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  issue: {
    marginTop: '-15px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  iconError: {
    paddingRight: theme.spacing(2),
    fontSize: '75px',
  },
  iconRefreshLarge: {
    fontSize: '75px',
  },
}));

export default function LoginSimulator() {
  // eslint-disable-next-line
  const classes = useStyles();
  const [shibAttributes, setShibAttributes] = useState({
    data: null,
    loading: true,
    error: false,
  });
  const [postShibAttributes, setPostShibAttributes] = useState({
    data: null,
    loading: true,
    error: false,
  });
  const [redirect, setRedirect] = useState(false);
  // reload page to right place
  function getLoginData() {
    function onSuccessPost(resp) {
      setRedirect(true);
    }
    function onSuccess(resp) {
      post(setPostShibAttributes, '/registerUser', null, onSuccessPost, {
        netId: resp.data.result.userId,
        email: resp.data.result.email,
        name: resp.data.result.name,
        affiliation: resp.data.result.affiliation,
      });
    }
    if (DEV) {
      setShibAttributes({
        data: {
          result: {
            userId: 'phaas',
            name: 'phaas',
            affliation: 'employee',
            email: 'phaas@cs.umass.edu',
          },
        },
        loading: false,
        error: false,
      });
      setPostShibAttributes({
        ...postShibAttributes,
        loading: false,
      });
      setRedirect(true);
      return;
    }
    get(setShibAttributes, '/shib/attributes', null, onSuccess);
  }
  useEffect(getLoginData, []);

  if (!redirect) {
    return (
      <Container component="main" maxWidth="xs">
        <div>
          <div style={{ marginTop: '100px' }}>
            <LoadingSpinner />
          </div>
        </div>
      </Container>
    );
  }

  if (shibAttributes.error || postShibAttributes.error) {
    return (
      <Container component="main" maxWidth="xs">
        <div>
          <div className={classes.issue}>
            <div className={classes.container}>
              <ErrorIcon className={classes.iconError} />
              <Typography align="center" variant="h3">
                Error in fetching Shibboleth status.
              </Typography>
            </div>
            <div className={classes.container}>
              <Button variant="contained" color="primary" onClick={getLoginData}>
                <RefreshIcon className={classes.iconRefreshLarge} />
              </Button>
            </div>
          </div>
        </div>
      </Container>
    );
  }

  if (redirect) {
    return (
      <Redirect
        to={{
          pathname: '/dashboard',
          data: { userData: shibAttributes.data.result },
        }}
      />
    );
  }
}
