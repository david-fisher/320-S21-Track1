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
      <Typography variant="h6">Enrolled Courses</Typography>
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
  courses: PropTypes.array,
};
export default function CodeDialog({ courses }) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [course, setCourse] = useState('');

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
        <Typography variant="subtitle1">
          Enrolled Courses
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
        <DialogTitle onClose={handleClose} />
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
                  noWrap
                >
                  {data.NAME}
                </Typography>
              </Button>
            </form>
          ))}
        </DialogContent>

        <DialogActions>
          <Button
            className={classes.saveButton}
            autoFocus
            color="primary"
            onClick={handleClose}
          >
            Exit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
