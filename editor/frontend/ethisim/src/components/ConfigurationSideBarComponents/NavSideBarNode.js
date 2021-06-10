import React, { useContext, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Grid } from '@material-ui/core';
import PropTypes from 'prop-types';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import GenericUnsavedWarning from '../WarningDialogs/GenericUnsavedWarning';
import GenericDeleteWarning from '../WarningDialogs/GenericDeleteWarning';
import GlobalUnsavedContext from '../../Context/GlobalUnsavedContext';

const useStyles = makeStyles((theme) => ({
  pageButton: {
    width: '100%',
    minHeight: '50px',
    border: '3px solid',
    borderColor: theme.palette.primary.light,
    textTransform: 'unset',
    overflowWrap: 'anywhere',
  },
  pageButtonSelected: {
    width: '100%',
    minHeight: '50px',
    border: '3px solid',
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.primary.light,
    textTransform: 'unset',
    overflowWrap: 'anywhere',
  },
  deleteButton: {
    minWidth: '40px',
    border: '3px solid',
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.primary.light,
  },
  deleteButtonContainer: {
    display: 'flex',
    alignItems: 'center',
  },
}));

NavSideBarNode.propTypes = {
  onClick: PropTypes.any.isRequired,
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  deleteByID: PropTypes.any.isRequired,
  component: PropTypes.any,
  scenarioPages: PropTypes.any,
  isIntroPage: PropTypes.bool,
  curPage: PropTypes.any,
  currentTime: PropTypes.string,
  setCurrentTime: PropTypes.func,
};

export default function NavSideBarNode(props) {
  const classes = useStyles();
  const {
    onClick,
    deleteByID,
    id,
    title,
    scenarioPages,
    isIntroPage,
    curPage,
  } = props;

  const [globalUnsaved, setGlobalUnsaved] = useContext(GlobalUnsavedContext);
  // used for delete warning dialog
  const [openDeleteWarningDialog, setOpenDeleteWarningDialog] = useState(false);

  const handleOpenDeleteWarningDialog = () => {
    setOpenDeleteWarningDialog(true);
  };

  // used for unsaved warning dialog
  const [openUnsavedWarningDialog, setOpenUnsavedWarningDialog] = useState(false);
  const handleOpenUnsavedWarningDialog = () => {
    setOpenUnsavedWarningDialog(true);
  };

  const button = curPage ? (
    <Button
      className={classes.pageButtonSelected}
      variant="contained"
      onClick={
                globalUnsaved && !curPage
                  ? handleOpenUnsavedWarningDialog
                  : handleDisplayComponent
            }
    >
      {' '}
      {title}
    </Button>
  ) : (
    <Button
      className={classes.pageButton}
      variant="contained"
      color="primary"
      onClick={
                globalUnsaved && !curPage
                  ? handleOpenUnsavedWarningDialog
                  : handleDisplayComponent
            }
    >
      {title}
    </Button>
  );

  function pageType(title) {
    if (id === -1 || id === -2 || id === -3 || id === -4 || isIntroPage) {
      return (
        <Grid container direction="row" justify="flex-start">
          <Grid item xs={10}>
            <GenericUnsavedWarning
              func={handleDisplayComponent}
              setOpen={setOpenUnsavedWarningDialog}
              open={openUnsavedWarningDialog}
            />
            {button}
          </Grid>
        </Grid>
      );
    }
    return (
      <Grid container direction="row" justify="flex-start">
        <Grid item xs={10}>
          {button}
          <GenericUnsavedWarning
            func={handleDisplayComponent}
            setOpen={setOpenUnsavedWarningDialog}
            open={openUnsavedWarningDialog}
          />
        </Grid>
        <Grid item xs={2} className={classes.deleteButtonContainer}>
          <Button
            className={classes.deleteButton}
            color="primary"
            onClick={handleOpenDeleteWarningDialog}
          >
            <DeleteForeverIcon />
          </Button>
          <GenericDeleteWarning
            remove={() => deleteByID(id)}
            open={openDeleteWarningDialog}
            setOpen={setOpenDeleteWarningDialog}
          />
        </Grid>
      </Grid>
    );
  }

  function handleDisplayComponent() {
    if (!curPage) {
      setGlobalUnsaved(false);
      onClick(id, title, scenarioPages);
    }
  }

  return <div>{pageType(title)}</div>;
}
