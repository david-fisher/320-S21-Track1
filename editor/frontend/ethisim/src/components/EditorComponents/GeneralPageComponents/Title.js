import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, TextField } from '@material-ui/core';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
    root: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
}));

Title.propTypes = {
    title: PropTypes.string,
};

export default function Title(props) {
    const classes = useStyles();
    Title.propTypes = props.data;
    const title = props.title;
    const setTitle = props.setTitle;
    const error = props.error;
    const errorMessage = props.errorMessage;

    let handleChange = (content) => {
        setTitle(content.target.value);
    };

    return (
        <div className={classes.root}>
            <Typography variant="h4">Scenario Page Name</Typography>
            {error ? (
                <TextField
                    error
                    helperText={errorMessage}
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="title"
                    label="Title of component"
                    value={title}
                    onChange={handleChange}
                    name="title"
                />
            ) : (
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="title"
                    label="Title of component"
                    value={title}
                    onChange={handleChange}
                    name="title"
                />
            )}
        </div>
    );
}
