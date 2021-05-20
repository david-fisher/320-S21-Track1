import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import PropTypes from 'prop-types';

const Transition = React.forwardRef((props, ref) => (
  <Slide direction="up" ref={ref} {...props} />
));

GenericUnsavedWarning.propTypes = {
  func: PropTypes.func.isRequired,
  open: PropTypes.any.isRequired,
  setOpen: PropTypes.any.isRequired,
};

export default function GenericUnsavedWarning(props) {
  GenericUnsavedWarning.propTypes = props.data;
  const data = props;
  // func is the function that occurs when user wants to leave without saving changes
  const {
    func, open, setOpen, description, title,
  } = data;

  // Func that closes the popup window
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle id="alert-dialog-slide-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          {description}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={func} color="primary">
          Yes
        </Button>
        <Button onClick={handleClose} color="primary">
          No
        </Button>
      </DialogActions>
    </Dialog>
  );
}
