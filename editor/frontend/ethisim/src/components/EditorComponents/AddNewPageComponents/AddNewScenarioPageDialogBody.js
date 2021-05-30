import React, { useState } from 'react';
import {
  Select,
  MenuItem,
  Button,
  TextField,
  Typography,
  makeStyles,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import PropTypes from 'prop-types';
import Toggle from '../GeneralPageComponents/Toggle_TextEditor_CodeEditor';

const useStyles = makeStyles((theme) => ({
  containerRow: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  mainContainer: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  menuButton: {
    margin: theme.spacing(2),
  },
  addButton: {
    width: '100%',
    maxWidth: '450px',
    margin: theme.spacing(1),
    textTransform: 'unset',
  },
  selectMenu: {
    minWidth: '200px',
    marginLeft: theme.spacing(2),
  },
}));

AddNewScenarioPageDialogBody.propTypes = {
  setOpenPopup: PropTypes.any.isRequired,
  addPage: PropTypes.any.isRequired,
};

export default function AddNewScenarioPageDialogBody(props) {
  const classes = useStyles();
  AddNewScenarioPageDialogBody.propTypes = props.data;
  const data = props;
  const { addPage, setOpenPopup } = data;

  // eslint-disable-next-line
    const [anchorEl, setAnchorEl] = useState(null);
  const [pageType, setPageType] = useState('Generic');
  const [pageName, setPageName] = useState('');
  // Text Editor default value
  const [pageBody, setPageBody] = useState('<p><br></p>');

  const [errorName, setErrorName] = useState(false);
  const [errorNameText, setErrorNameText] = useState('');
  const [errorBody, setErrorBody] = useState(false);

  const [editorOption, setEditorOption] = useState('TextEditor');
  // eslint-disable-next-line
    const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChange = (event) => {
    setPageType(event.target.value);
  };

  const createNewPage = () => {
    let validInput = true;

    if (!pageName || !pageName.trim()) {
      setErrorName(true);
      setErrorNameText('Scenario name cannot be empty');
      validInput = false;
    } else if (pageName.length >= 1000) {
      setErrorName(true);
      setErrorNameText(
        'Scenario name must have less than 1000 characters',
      );
      validInput = false;
    } else {
      setErrorName(false);
    }

    if (!pageBody || !pageBody.trim()) {
      setErrorBody(true);
      validInput = false;
    } else {
      setErrorBody(false);
    }

    if (validInput) {
      // Used to differentiate between Code Editor and Text Editor format
      let formattedPageBody = pageBody;
      if (editorOption === 'CodeEditor') {
        formattedPageBody = `${pageBody}<!--CodeEditor-->`;
      }
      addPage(pageType, pageName, formattedPageBody);
      setOpenPopup(false);
    }
  };

  return (
    <div className={classes.mainContainer}>
      <div className={classes.containerRow}>
        <Typography variant="h6">Page Type:</Typography>
        <Select
          className={classes.selectMenu}
          id="Scenario-Page-Type-Menu"
          labelId="Scenario-Page-Type-Menu"
          value={pageType}
          onChange={handleChange}
        >
          <MenuItem value="Generic" onClick={handleClose}>
            Generic Page
          </MenuItem>
          <MenuItem value="Action" onClick={handleClose}>
            Action Page
          </MenuItem>
          <MenuItem value="Reflection" onClick={handleClose}>
            Reflection Page
          </MenuItem>
        </Select>
      </div>
      {errorName ? (
        <TextField
          error
          helperText={errorNameText}
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="New Page Title"
          label="Page Title"
          id="scenariopageAdder"
          onChange={(e) => setPageName(e.target.value)}
        />
      ) : (
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="New Page Title"
          label="Page Title"
          id="scenariopageAdder"
          onChange={(e) => setPageName(e.target.value)}
        />
      )}

      <Toggle
        body={pageBody}
        setBody={setPageBody}
        error={errorBody}
        option={editorOption}
        setOption={setEditorOption}
        notSetUnsaved
      />
      <div className={classes.containerRow}>
        <Button
          className={classes.addButton}
          variant="contained"
          color="primary"
          onClick={createNewPage}
        >
          <AddIcon />
          Add New Page
        </Button>
      </div>
    </div>
  );
}
