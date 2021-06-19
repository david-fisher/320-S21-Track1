import React, { useState, useEffect } from 'react';
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
import AddIcon from '@material-ui/icons/Add';
import PropTypes from 'prop-types';
import post from '../universalHTTPRequestsSimulator/post';
import ErrorBanner from './Banners/ErrorBanner';

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
  bannerContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
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
      <Typography variant="h6">Add Courses</Typography>
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

CodeDialog.propTypes = {
  userID: PropTypes.string,
  getData: PropTypes.func,
};
export default function CodeDialog({ userID, getData }) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [course, setCourse] = useState('');

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // eslint-disable-next-line
  const [postCourseResponse, setPostCourseResponse] = useState({
    data: null,
    loading: false,
    error: false,
  });

  const [errorBannerFade, setErrorBannerFade] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setErrorBannerFade(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [errorBannerFade]);

  const handleSubmit = () => {
    function onSuccess(resp) {
      setOpen(false);
      getData(true);
    }

    function onFailure(resp) {
      setErrorBannerFade(true);
    }

    post(setPostCourseResponse, '/api/takes/', onFailure, onSuccess, {
      USER_ID: userID,
      COURSE_ID: course.toUpperCase(),
    });
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
        <Typography variant="subtitle1">
          Add Course
        </Typography>
      </Button>
      <Dialog
        fullWidth
        maxWidth="sm"
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        disableBackdropClick
        disableEscapeKeyDown
        open={open}
      >
        <div className={classes.bannerContainer}>
          <ErrorBanner
            errorMessage="Course does not exist or course has already been added!"
            fade={errorBannerFade}
          />
        </div>
        <DialogTitle onClose={handleClose} />
        <DialogContent dividers>
          <form className={classes.textField} noValidate autoComplete="off">
            <ValidationTextField
              label="Enter Course Code"
              id="Enter Course Code"
              variant="outlined"
              value={course}
              onInput={(e) => setCourse(e.target.value)}
            />
          </form>
        </DialogContent>

        <DialogActions>
          <Button
            className={classes.saveButton}
            autoFocus
            color="primary"
            onClick={handleSubmit}
          >
            <AddIcon />
            Add Course
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
