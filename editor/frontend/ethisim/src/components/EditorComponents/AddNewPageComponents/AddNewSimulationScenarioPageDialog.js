import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Typography,
  makeStyles,
} from '@material-ui/core';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import PropTypes from 'prop-types';
import AddNewScenarioPageDialogBody from './AddNewScenarioPageDialogBody';
import { AddNewPageHelpInfo } from './AddNewPageHelpInfo';
import GenericHelpButton from '../../HelpButton/GenericHelpButton';

const useStyles = makeStyles((theme) => ({
  dialogWrapper: {
    padding: theme.spacing(2),
    position: 'absolute',
    top: theme.spacing(5),
  },
  exitOutButton: {
    marginLeft: 'auto',
    float: 'right',
  },
}));

AddNewSimulationScenarioPageDialog.propTypes = {
  title: PropTypes.any.isRequired,
  setOpenPopup: PropTypes.any.isRequired,
  addPage: PropTypes.any.isRequired,
  openPopup: PropTypes.any.isRequired,
};

export default function AddNewSimulationScenarioPageDialog(props) {
  const classes = useStyles();
  AddNewSimulationScenarioPageDialog.propTypes = props.data;
  const data = props;
  const {
    title, setOpenPopup, addPage, openPopup,
  } = data;

  return (
    <Dialog
      open={openPopup}
      fullWidth
      maxWidth="md"
      classes={{ paper: classes.dialogWrapper }}
    >
      <DialogTitle disableTypography style={{ display: 'flex' }}>
        <Typography
          variant="h5"
          align="center"
          component="div"
          style={{ display: 'flex' }}
        >
          {title || 'Add New Page'}
        </Typography>
        <Button
          className={classes.exitOutButton}
          variant="contained"
          color="primary"
          onClick={() => {
            setOpenPopup(false);
          }}
        >
          <HighlightOffIcon />
        </Button>
      </DialogTitle>

      <DialogContent dividers>
        <GenericHelpButton
          description={AddNewPageHelpInfo}
          title="Add New Page Help"
        />
        <AddNewScenarioPageDialogBody
          addPage={addPage}
          setOpenPopup={setOpenPopup}
        />
      </DialogContent>
    </Dialog>
  );
}
