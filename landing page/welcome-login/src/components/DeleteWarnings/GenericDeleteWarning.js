import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import PropTypes from 'prop-types';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

GenericDeleteWarning.propTypes = {
    remove: PropTypes.func.isRequired,
    open: PropTypes.any.isRequired,
    setOpen: PropTypes.any.isRequired,
};

export default function GenericDeleteWarning(props) {
    GenericDeleteWarning.propTypes = props.data;
    const data = props;
    //Remove must be a function that deletes the component
    const { remove, open, setOpen } = data;

    //Func that closes the popup window
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
                {'Are you sure you want to delete this?'}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                    Once this action is performed, it cannot be undone!
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
