import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
} from '@material-ui/core';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import CloseIcon from '@material-ui/icons/Close';
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
