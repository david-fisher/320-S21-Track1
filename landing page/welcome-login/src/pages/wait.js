import React, { useState, useEffect } from 'react';
import  { Redirect, Route } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import { makeStyles } from '@material-ui/core/styles';
import RefreshIcon from '@material-ui/icons/Refresh';
import ErrorIcon from '@material-ui/icons/Error';
import {
    Button,
    TextField,
    FormControlLabel,
    Checkbox,
    Box,
    Typography,
    Container,
    Link,
    Grid,
} from '@material-ui/core';
import { DOMAIN } from '../Constants/Config';
import { Link as RouterLink } from 'react-router-dom';
import Copyright from '../components/Copyright';
import RedLogo from '../shared/RedLogo.png';

let receivedData = 'Nothing'

let test = async () => {
    fetch('/backend/shib/attributes', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => response.json())
        .then(data => {return data})
    return {'affliation': 'Student'};
}

const useStyles = makeStyles((theme) => ({
    container: {
        marginTop: theme.spacing(2),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    logo: {
        width: '100px',
    },
    form: {
        marginTop: theme.spacing(1),
        width: '100%',
    },
    submit: {
        marginTop: theme.spacing(2),
        backgroundColor: theme.palette.primary.main,
        color: 'white',
    },
    copyright: {
        margin: theme.spacing(2),
        opacity: 0.5,
    },
}));

export default function Wait() {
    const [fetchResponse, setFetchResponse] = useState({
        editor: null,
        loading: true,
        error: null,
    });
    const [shouldFetch, setShouldFetch] = useState(0);
    const classes = useStyles();

    //IMPLEMENT SHIBBOLETH
    let getData = () => {
        setFetchResponse({
            editor: false,
            loading: true,
            error: null,
        });
        setTimeout(() => {  console.log("World!"); }, 100000);
        function onSuccess(response) {
            let finishedScenarios = response.data.filter(
                (data) => data.IS_FINISHED
            );
            let unfinishedScenarios = response.data.filter(
                (data) => !data.IS_FINISHED
            );
            //setFinishedScenarios(finishedScenarios);
            //setUnfinishedScenarios(unfinishedScenarios);
        }
        function onFailure() {}
        //get(setFetchResponse, endpointGet, onFailure, onSuccess);
        setFetchResponse({
            editor: true,
            loading: false,
            error: null,
        });
    };

    //reload page to right place
    test()
        .then((receivedData) => {
            console.log('abc ');
            console.log(receivedData);
            window.location.href = receivedData.affliation === 'Student' ?  "/simulator" : receivedData.affliation === 'Employee'? '/editor' : null;
        });



    if (fetchResponse.loading) {
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

    if (fetchResponse.error) {
        return (
            <Container component="main" maxWidth="xs">
                <div>
                    <div className={classes.issue}>
                        <div className={classes.errorContainer}>
                            <ErrorIcon className={classes.iconError} />
                            <Typography align="center" variant="h3">
                                Error in fetching Shibboleth status.
                            </Typography>
                        </div>
                        <div className={classes.errorContainer}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={getData}
                            >
                                <RefreshIcon className={classes.iconRefreshLarge} />
                            </Button>
                        </div>
                    </div>
                </div>
            </Container>
        );
    }

    if (!fetchResponse.loading) {
        if (fetchResponse.editor) {
            return (
                <Container component="main" maxWidth="xs">
                    <Redirect to='/dashboard'  />
                </Container>
            );
        }
        else{
            return (
                <Container component="main" maxWidth="xs">
                    <Redirect to='/simulator'  />
                </Container>
            );
        }
    }
}