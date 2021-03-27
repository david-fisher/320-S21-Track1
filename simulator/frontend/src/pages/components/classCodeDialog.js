import React, { useState } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import {
    Typography,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    TextField,
    IconButton,
} from '@material-ui/core';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import CloseIcon from '@material-ui/icons/Close';
import AddIcon from '@material-ui/icons/Add'
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(1),
        textAlign: 'center',
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
    shareInfo: {
        borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
        paddingBottom: '6px',
        marginBottom: '6px',
    },
    saveButton: {
        margin: theme.spacing(2),
        float: 'right',
        textTransform: 'unset',
    },
    buttonText: {
        width: '100%',
        textTransform: 'unset',
    },
}));

DialogTitle.propTypes = {
    onClose: PropTypes.any.isRequired,
};

const ValidationTextField = withStyles({
    root: {
        width: '300px',
        color: 'black',
        alignItems: 'left',
        '& .MuiOutlinedInput-root': {
            '&:hover fieldset': {
                borderColor: 'black',
                borderWidth: '2',
            },
        },
        '& .MuiFormLabel-root': {
            color: 'black',
        },
        '& .MuiInputBase-root': {
            color: 'black',
        },
        '& input:valid + fieldset': {
            borderColor: 'black',
            borderWidth: 2,
        },
        '& input:invalid + fieldset': {
            borderColor: 'black',
            borderWidth: 2,
        },
        '& input:valid:focus + fieldset': {
            color: 'black',
            borderColor: 'black',
            borderLeftWidth: 6,
            padding: '4px !important', // override inline-style
        },
    },
})(TextField);

function DialogTitle(props) {
    const classes = useStyles();
    const { onClose } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root}>
            <Typography variant="h6">Add Scenario using Course Code</Typography>
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
}

export default function CodeDialog(props) {
    const classes = useStyles();
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Button
                variant="contained"
                color="primary"
                onClick={handleClickOpen}
                className={classes.buttonText}
            >
                <AddIcon />
                <Typography variant="subtitle1">Add Scenario using Course Code</Typography>
            </Button>
            <Dialog
                fullWidth={true}
                maxWidth="sm"
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
            >
                <DialogTitle onClose={handleClose}></DialogTitle>
                <DialogContent dividers>
                    <form
                        className={classes.textField}
                        noValidate
                        autoComplete="off"
                    >
                        <ValidationTextField
                            label="Enter Course Code"
                            id="Enter Course Code"
                            variant="outlined"
                            onInput={(e) => e.target.value = ("" + e.target.value).toUpperCase()}
                        />
                    </form>
                </DialogContent>

                <DialogActions>
                    <Button
                        className={classes.saveButton}
                        autoFocus
                        color="primary"
                        onClick={handleClose}
                    >
                        <AddIcon/>Add Scenario
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
