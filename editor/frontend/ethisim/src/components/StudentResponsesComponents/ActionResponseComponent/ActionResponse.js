import React from 'react';
import {
    Typography,
    Container,
    FormControlLabel,
    Checkbox,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
    container: {
        marginTop: theme.spacing(2),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    form: {
        marginTop: theme.spacing(1),
        width: '100%',
    },
    submit: {
        marginTop: theme.spacing(2),
        backgroundColor: theme.palette.primary.main,
        color: 'white',
        textTransform: 'unset',
    },
    saveButton: {
        margin: theme.spacing(2),
        float: 'right',
        textTransform: 'unset',
    },
}));

ActionStudentResponse.propTypes = {
    option1: PropTypes.string,
    option2: PropTypes.string,
    choice: PropTypes.number,
    title: PropTypes.string,
};

export default function ActionStudentResponse({
    option1,
    option2,
    choice,
    title,
}) {
    const classes = useStyles();

    return (
        <Container component="main">
            <Typography align="center" variant="h3">
                {title}
            </Typography>
            <div className={classes.container}>
                <FormControlLabel
                    value="start"
                    control={
                        <Checkbox color="primary" checked={choice === 1} />
                    }
                    label={option1}
                    labelPlacement="start"
                />
                <FormControlLabel
                    value="start"
                    control={
                        <Checkbox color="primary" checked={choice === 2} />
                    }
                    label={option2}
                    labelPlacement="start"
                />
            </div>
        </Container>
    );
}
