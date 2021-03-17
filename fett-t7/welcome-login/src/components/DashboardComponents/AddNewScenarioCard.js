import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Container, Typography, Grid, Button } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
    addNewScenarioContainer: {
        height: '100%',
        borderStyle: 'dashed',
        borderColor: theme.palette.primary.main,
        border: 3,
        borderRadius: 3,
        padding: 0,
    },
    addNewScenarioButton: {
        width: '100%',
        height: '100%',
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
        <Grid key="createNewScenarioButton" item xs>
            <Container className={classes.addNewScenarioContainer} fixed={true}>
                <Button
                    className={classes.addNewScenarioButton}
                    onClick={onClick}
                >
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
            </Container>
        </Grid>
    );
}
