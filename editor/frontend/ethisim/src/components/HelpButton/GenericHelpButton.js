import React, { useState } from 'react';
import {
    Typography,
    Button,
    IconButton,
    Dialog,
    DialogActions,
    DialogContent,
} from '@material-ui/core';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles } from '@material-ui/core/styles';
import HelpIcon from '@material-ui/icons/Help';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(0.5),
        color: 'white',
    },
    root: {
        margin: 0,
        padding: theme.spacing(1),
        textAlign: 'center',
    },
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    icon: {
        width: '75px',
        height: '75px',
    },
}));
DialogTitle.propTypes = {
    onClose: PropTypes.any,
    title: PropTypes.string,
};
function DialogTitle(props) {
    const classes = useStyles();
    const { onClose, title } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root}>
            <Typography variant="h5">{title ? title : 'Help'}</Typography>
            <Button
                className={classes.closeButton}
                variant="contained"
                color="primary"
                onClick={onClose}
            >
                <HighlightOffIcon />
            </Button>
        </MuiDialogTitle>
    );
}
HelpButtonSinglePlayer.propTypes = {
    description: PropTypes.any,
    title: PropTypes.string,
};
export default function HelpButtonSinglePlayer({ description, title }) {
    const classes = useStyles();
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div className={classes.container}>
            <Dialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
                fullWidth={true}
                maxWidth={'sm'}
                scroll="body"
            >
                <DialogTitle onClose={handleClose} title={title} />
                {description.map((data, i) => (
                    <DialogContent dividers key={i}>
                        <Typography variant="h6">{data.title}</Typography>
                        <Typography variant="body1">
                            {data.description}
                        </Typography>
                    </DialogContent>
                ))}
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Exit
                    </Button>
                </DialogActions>
            </Dialog>
            <IconButton size="medium" color="primary" onClick={handleOpen}>
                <HelpIcon className={classes.icon} />
            </IconButton>
        </div>
    );
}
