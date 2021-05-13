import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Grid, Button } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
    addNewScenarioContainer: {
        marginTop: '10px',
        marginRight: '10px',
        minHeight: '100%',
        minWidth: '100%',
        borderStyle: 'dashed',
        borderColor: theme.palette.primary.main,
        border: 3,
        borderRadius: '2%',
        padding: 0,
    },
    addNewScenarioButton: {
        width: '100%',
        height: '100%',
        minHeight: '200px',
        textTransform: 'unset',
    },
    addIcon: {
        color: theme.palette.primary.main,
        fontSize: 70,
    },
    addNewScenarioText: {
        color: theme.palette.primary.main,
    },
}));

AddNewScenarioCard.propTypes = {
    onClick: PropTypes.any,
};

export default function AddNewScenarioCard({ onClick }) {
    const classes = useStyles();

    return (
        <Grid
            className={classes.addNewScenarioContainer}
            key="createNewScenarioButton"
        >
            <Button className={classes.addNewScenarioButton} onClick={onClick}>
                <Grid
                    container
                    direction="column"
                    justify="center"
                    alignItems="center"
                >
                    <Grid item>
                        <AddIcon className={classes.addIcon} />
                    </Grid>
                    <Grid item>
                        <Typography
                            className={classes.addNewScenarioText}
                            variant="h6"
                            noWrap
                        >
                            Create New Scenario
                        </Typography>
                    </Grid>
                </Grid>
            </Button>
        </Grid>
    );
}
