import React from 'react';
import Body from '../GeneralPageComponents/Body';
import Title from '../GeneralPageComponents/Title';
import InformationItemList from './InformationItemList';

import { Typography, Container, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    saveButton: {
        margin: theme.spacing(2),
        float: 'right',
        textTransform: 'unset',
    },
}));

export default function Event() {
    const classes = useStyles();
    return (
        <Container component="main">
            <Typography align="center" variant="h2">
                Event Component
            </Typography>
            <Title />
            <Body />
            <InformationItemList />
            <Button
                className={classes.saveButton}
                variant="contained"
                color="primary"
            >
                Save
            </Button>
        </Container>
    );
}
