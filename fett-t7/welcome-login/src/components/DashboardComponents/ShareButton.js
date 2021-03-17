import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ShareIcon from '@material-ui/icons/Share';
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
import PropTypes from 'prop-types';
import Autocomplete from '@material-ui/lab/Autocomplete';

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

const UserRole = [
    { title: 'Read Only' },
    { title: 'Edit Only' },
    { title: 'Admin' },
];

function DialogTitle(props) {
    const classes = useStyles();
    const { onClose } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root}>
            <Typography variant="h6">Share with Professor</Typography>
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

export default function ShareDialog(props) {
    const classes = useStyles();
    const [open, setOpen] = useState(false);

    const [email, setEmail] = useState('');

    const onChangeEmail = (event) => {
        setEmail(event.target.value);
    };

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
                <ShareIcon />
                <Typography variant="subtitle1">Share</Typography>
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
                    <Typography align="left" variant="h6">
                        Select User Role
                    </Typography>
                    <Autocomplete
                        id="User_Role"
                        options={UserRole}
                        getOptionLabel={(option) => option.title}
                        style={{ width: 300 }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="User Role Options"
                                variant="outlined"
                            />
                        )}
                    />
                </DialogContent>

                <DialogActions>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="Enter Email"
                        label="Enter Email"
                        name="Enter Email"
                        value={email}
                        onChange={onChangeEmail}
                    />
                    <Button
                        className={classes.saveButton}
                        autoFocus
                        color="primary"
                        onClick={handleClose}
                    >
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
