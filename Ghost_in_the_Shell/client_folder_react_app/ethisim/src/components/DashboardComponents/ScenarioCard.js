import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import { Typography, Grid, Card, CardContent, Button } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
//import ShareIcon from '@material-ui/icons/Share';
import AssessmentIcon from '@material-ui/icons/Assessment';
import PropTypes from 'prop-types';

import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import DeleteEntireScenarioWarning from '../DeleteWarnings/DeleteEntireScenarioWarning';

import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import ClassIcon from '@material-ui/icons/Class';
import { withStyles } from '@material-ui/core/styles';

import ShareButton from './ShareButton';

const useStyles = makeStyles((theme) => ({
    scenarioContainer: {
        minHeight: '100px',
        minWidth: '200px',
        backgroundColor: theme.palette.primary.light,
        borderStyle: 'solid',
        borderColor: theme.palette.primary.light,
        border: 2,
    },
    buttonContainer: {
        borderStyle: 'solid',
        borderColor: theme.palette.primary.light,
        border: 3,
    },
    button: {
        borderStyle: 'solid',
        borderColor: theme.palette.primary.light,
        border: 3,
    },
    buttonText: {
        width: '100%',
        textTransform: 'unset',
    },
}));

const styles = (theme) => ({
    root: {
        margin: 1,
        padding: theme.spacing(2),
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
});

const DialogTitle = withStyles(styles)((props) => {
    const { children, classes, onClose, ...other } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root} {...other}>
            <Typography variant="h6" noWrap={true}>
                Classes for
            </Typography>
            <Typography variant="h6" noWrap={true} color="primary">
                {children}
            </Typography>
            {onClose ? (
                <IconButton
                    aria-label="close"
                    className={classes.closeButton}
                    onClick={onClose}
                >
                    <CloseIcon />
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
});

const DialogContent = withStyles((theme) => ({
    root: {
        padding: theme.spacing(2),
    },
}))(MuiDialogContent);

ScenarioCard.propTypes = {
    data: PropTypes.any,
    scenarioID: PropTypes.number,
    scenarioName: PropTypes.string,
    isFinished: PropTypes.bool,
    dateCreated: PropTypes.string,
    courses: PropTypes.any,
    onDelete: PropTypes.any,
};

export default function ScenarioCard({
    data,
    scenarioID,
    scenarioName,
    isFinished,
    dateCreated,
    courses,
    onDelete,
}) {
    const [open, setOpen] = React.useState(false);
    const [openDeletePopup, setOpenDeletePopup] = React.useState(false);
    const classes = useStyles();

    const handleClickOpenDeletePopup = () => {
        setOpenDeletePopup(true);
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    //If scenario is unfinished, we show the buttons "Edit," "Delete," "View Classes," "Share"
    //If scenario is finished, we show the button "Edit," "Delete," "View Classes," "Share," "View Student Data"

    const dataButton = isFinished ? (
        <Grid
            component={Link}
            to={{
                pathname: '/data/' + scenarioID,
                data: data,
            }}
            className={classes.button}
            item
            xs={12}
        >
            <Button
                className={classes.buttonText}
                variant="contained"
                color="primary"
            >
                <AssessmentIcon />
                <Typography variant="subtitle1" noWrap>
                    Data
                </Typography>
            </Button>
        </Grid>
    ) : null;

    const buttons = (
        <Grid className={classes.buttonContainer} container>
            <Grid className={classes.button} item xs={6}>
                <Button
                    component={Link}
                    to={{
                        pathname: '/editor/' + scenarioID,
                        data: data,
                    }}
                    className={classes.buttonText}
                    variant="contained"
                    color="primary"
                >
                    <EditIcon />
                    <Typography variant="subtitle1">Edit</Typography>
                </Button>
            </Grid>
            <Grid className={classes.button} item xs={6}>
                <Button
                    className={classes.buttonText}
                    variant="contained"
                    color="primary"
                    onClick={handleClickOpenDeletePopup}
                >
                    <DeleteForeverIcon />
                    <Typography variant="subtitle1" noWrap>
                        Delete
                    </Typography>
                </Button>
                <DeleteEntireScenarioWarning
                    open={openDeletePopup}
                    setOpen={setOpenDeletePopup}
                    remove={function () {
                        onDelete(scenarioID, isFinished);
                    }}
                />
            </Grid>
            <Grid className={classes.button} item xs={6}>
                <Button
                    className={classes.buttonText}
                    variant="contained"
                    color="primary"
                    onClick={handleClickOpen}
                >
                    <ClassIcon />
                    <Typography variant="subtitle1" noWrap>
                        View Classes
                    </Typography>
                </Button>
            </Grid>
            <Grid className={classes.button} item xs={6}>
                <ShareButton />
            </Grid>

            {dataButton}
        </Grid>
    );

    return (
        <Grid key={scenarioID} item xs>
            <Card>
                <CardContent className={classes.scenarioContainer}>
                    <Typography variant="h6" display="block" noWrap>
                        {scenarioName}
                    </Typography>
                    <Typography
                        variant="subtitle1"
                        color="textSecondary"
                        display="block"
                        noWrap
                    >
                        Date created: {dateCreated}
                    </Typography>
                </CardContent>
            </Card>
            <Grid className={classes.buttonContainer} container>
                {buttons}
            </Grid>
            <div>
                <Dialog
                    onClose={handleClose}
                    aria-labelledby="customized-dialog-title"
                    open={open}
                    maxWidth="sm"
                    fullWidth={true}
                >
                    <div>
                        <DialogTitle
                            id="customized-dialog-title"
                            onClose={handleClose}
                        >
                            {scenarioName}
                        </DialogTitle>
                        <DialogContent dividers>
                            {courses.map((data) => (
                                <form
                                    style={{ marginBottom: 20 }}
                                    key={data.COURSE}
                                >
                                    <Button
                                        className={classes.buttonText}
                                        variant="contained"
                                        color="primary"
                                    >
                                        <Typography
                                            display="block"
                                            variant="subtitle1"
                                            noWrap={true}
                                        >
                                            {data.NAME}
                                        </Typography>
                                    </Button>
                                </form>
                            ))}
                        </DialogContent>
                    </div>
                </Dialog>
            </div>
        </Grid>
    );
}
