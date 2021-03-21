import React from 'react';
import { Typography, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    container: {
        marginTop: theme.spacing(2),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    circularProgress: {
        marginTop: theme.spacing(2),
    },
}));

export default function LoadingSpinner() {
    const classes = useStyles();
    return (
        <div className={classes.container}>
            <Typography align="center" variant="h3">
                Loading ...
            </Typography>
            <CircularProgress className={classes.circularProgress} size={100} />
        </div>
    );
}
