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

GenericEditorWarning.propTypes = {
  setOption: PropTypes.func.isRequired,
  open: PropTypes.any.isRequired,
  setOpen: PropTypes.any.isRequired,
};

// Changing between Text Editor and Code Editor
export default function GenericEditorWarning(props) {
  GenericEditorWarning.propTypes = props.data;
  const data = props;
  // setOption sets the toggle option
  const { setOption, open, setOpen } = data;

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
      <DialogTitle id="alert-dialog-slide-title">
        Are you sure you want to change your text editor?
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          If you change your text editor, your current text will be erased!
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={setOption} color="primary">
          Yes
        </Button>
        <Button onClick={handleClose} color="primary">
          No
        </Button>
      </DialogActions>
    </Dialog>
  );
}
