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

DeleteEntireScenarioWarning.propTypes = {
  remove: PropTypes.any.isRequired,
  open: PropTypes.any.isRequired,
  setOpen: PropTypes.any.isRequired,
};

export default function DeleteEntireScenarioWarning(props) {
  DeleteEntireScenarioWarning.propTypes = props.data;
  const data = props;
  const { remove, open, setOpen } = data;

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
        Are you sure you want to delete the scenario?
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          This action will delete the entire scenario and all the work
          associated with this scenario. Once this action is
          performed, it cannot be undone!
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={remove} color="primary">
          Yes
        </Button>
        <Button onClick={handleClose} color="primary">
          No
        </Button>
      </DialogActions>
    </Dialog>
  );
}
