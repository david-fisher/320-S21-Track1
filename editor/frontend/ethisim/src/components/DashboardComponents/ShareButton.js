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
  MenuItem,
  Select,
} from '@material-ui/core';
import { getCurrentTimeInt, checkTime } from '../CheckTime';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import CloseIcon from '@material-ui/icons/Close';
import PropTypes from 'prop-types';
import Autocomplete from '@material-ui/lab/Autocomplete';
import post from '../../universalHTTPRequests/post';

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
    {title: 'Hand Over'},
    { title: 'Admin' },
    { title: 'Edit Only' },
    { title: 'Read Only' },
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

  ShareDialog.propTypes = {
    accessLevel: PropTypes.number,
    userID: PropTypes.string,
    scenarioID: PropTypes.string,
    setSuccessBannerFade: PropTypes.any,
    setSuccessBannerMessage: PropTypes.any,
    setErrorBannerFade: PropTypes.any,
    setErrorBannerMessage: PropTypes.any,
  };

  export default function ShareDialog({ 
    accessLevel,
    setSuccessBannerFade,
    setSuccessBannerMessage,
    setErrorBannerFade,
    setErrorBannerMessage,
    userID,
    scenarioID 
    }) {
      const [error, setError] = useState(false);

      const [currentTime, setCurrentTime] = useState(getCurrentTimeInt());
      

      const [Sharepost, setPost] = useState({
        data: null,
        loading: false,
        error: null,
      });
    
      const ShareFeature = (e) => {
        if (!checkTime(currentTime, setCurrentTime)) {
          return;
        }
        const endpointPOST = '/share_functionality';
        const AccessNumber = 3;
        if(Access === 'Read Only'){
          AccessNumber = 3;
        }
        else if(Access === 'Edit Only'){
          AccessNumber = 2;
        }
        else if(Access === 'Admin'){
          AccessNumber = 1;
        }
        else if(Access === 'Hand Over'){
          AccessNumber = 0;
        }
        const data = {
          EMAIL: email,
          ACCESS: AccessNumber,
          SCENARIO: scenarioID,
          USER_ID: userID
        };
        function onSuccess(resp) {
          const newShare = [resp.data];
          setShare(newShare);
          setSuccessBannerMessage('Successfully shared!');
          setSuccessBannerFade(true);
        };
        function onFailure(e) {
          console.log(e);
          setErrorBannerMessage('Failed to share! Please try again.');
          setErrorBannerFade(true);
        };
        post(setPost, endpointPOST, onFailure, onSuccess, data);
      };

    const classes = useStyles();
    const [open, setOpen] = useState(false);

    const [email, setEmail] = useState('');
    const [Access, setShare] = useState('');
    const [selectedState, setSelectedState] = useState([""])

    const onChangeEmail = (event) => {
      setEmail(event.target.value);
    };

    const onChangeAccess = (event) => {
      setShare(event.target.value);
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
          disabled={accessLevel !== 1}
        >
          <ShareIcon />
          <Typography variant="subtitle1">Share</Typography>
        </Button>
        <Dialog
          fullWidth
          maxWidth="sm"
          onClose={handleClose}
          aria-labelledby="customized-dialog-title"
          open={open}
          disableBackdropClick
          disableEscapeKeyDown
        >
          <DialogTitle onClose={handleClose} />
          <DialogContent dividers>
            <Typography align="left" variant="h6">
              Select User Role
            </Typography>
            <Autocomplete
              id="User_Role"
              options={UserRole}
              getOptionLabel={(option) => option.title}
              value={Access}
              clearOnEscape = {false}
              disableClearable = {true}
              onChange={onChangeAccess}
              
              style={{ width: 300 }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="User Role Options"
                  variant="outlined"
                  value={Access}
                  onChange={onChangeAccess}
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
              onClick={ShareFeature}
            >
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }

