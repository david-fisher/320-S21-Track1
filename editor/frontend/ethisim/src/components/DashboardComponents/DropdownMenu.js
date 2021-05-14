import React, { useState } from 'react';
import {
    Menu,
    MenuItem,
    IconButton,
    Dialog,
    DialogContent,
    DialogActions,
    Typography,
    Button,
} from '@material-ui/core';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import { DOMAIN } from '../../Constants/Config';
import shemptylogo from '../EditorComponents/ConversationEditorComponents/StakeholdersComponent/shemptylogo.png';
import { DashboardHelpInfo } from './DashboardHelpInfo';
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

export default function SimpleMenu() {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const [open, setOpen] = useState(false);

    const handleOpenHelpDialog = () => {
        setOpen(true);
    };
    const handleCloseHelpDialog = () => {
        setOpen(false);
    };

    return (
        <div>
            <IconButton
                aria-controls="simple-menu"
                aria-haspopup="true"
                onClick={handleClick}
            >
                <img src={shemptylogo} height={50} width={50} alt=""></img>
            </IconButton>
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem
                    onClick={() =>
                        (window.location.href =
                            DOMAIN +
                            (process.env.NODE_ENV === 'production'
                                ? '/Shibboleth.sso/Logout?return=/'
                                : ':3006'))
                    }
                    component={Link}
                    to={{
                        pathname: '/home',
                    }}
                >
                    Logout
                </MenuItem>
                <MenuItem onClick={handleClose}>Settings</MenuItem>
                <MenuItem onClick={handleOpenHelpDialog}>Help</MenuItem>
                {/*Help Dialog*/}
                <Dialog
                    onClose={handleCloseHelpDialog}
                    aria-labelledby="customized-dialog-title"
                    open={open}
                    fullWidth={true}
                    maxWidth={'sm'}
                    scroll="body"
                >
                    <DialogTitle
                        onClose={handleCloseHelpDialog}
                        title={'Dashboard Help'}
                    />
                    {DashboardHelpInfo.map((data, i) => (
                        <DialogContent dividers key={i}>
                            <Typography variant="h6">{data.title}</Typography>
                            <Typography variant="body1">
                                {data.description}
                            </Typography>
                        </DialogContent>
                    ))}
                    <DialogActions>
                        <Button onClick={handleCloseHelpDialog} color="primary">
                            Exit
                        </Button>
                    </DialogActions>
                </Dialog>
            </Menu>
        </div>
    );
}
