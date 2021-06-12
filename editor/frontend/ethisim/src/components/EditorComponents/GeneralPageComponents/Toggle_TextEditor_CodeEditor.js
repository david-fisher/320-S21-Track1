import React, { useState, useContext } from 'react';
import {
  Typography,
}
  from '@material-ui/core';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import PropTypes from 'prop-types';
import './prism.css';
import CodeIcon from '@material-ui/icons/Code';
import TextFormatIcon from '@material-ui/icons/TextFormat';
import Body from './Body';
import CodeEditor from './CodeEditor';
import ChangeEditorWarning from '../../WarningDialogs/ChangeEditorWarning';
import GlobalUnsavedContext from '../../../Context/GlobalUnsavedContext';

// We know if a page is using the CodeEditor if the string has the tag "<!--CodeEditor-->"" at the end"
Toggle.propTypes = {
  body: PropTypes.string.isRequired,
  setBody: PropTypes.any.isRequired,
  error: PropTypes.bool,
  errorMessage: PropTypes.string,
  option: PropTypes.any,
  setOption: PropTypes.func,
  notSetUnsaved: PropTypes.bool, // notSetUnsaved is for Add New Page component, we don't need to warn user of unsaved changes
};
export default function Toggle({
  body, setBody, error, errorMessage, option, setOption, notSetUnsaved,
}) {
  // eslint-disable-next-line
  const [globalUnsaved, setGlobalUnsaved] = useContext(GlobalUnsavedContext);
  const handleToggleChange = (e) => {
    setBody('');
    setOption(option === 'TextEditor' ? 'CodeEditor' : 'TextEditor');
    setOpen(false);
    if (notSetUnsaved) {
      return;
    }
    setGlobalUnsaved(true);
  };
  // warning dialog
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Typography variant="h4">Body</Typography>
      <ChangeEditorWarning open={open} setOpen={setOpen} setOption={handleToggleChange} />
      <ToggleButtonGroup
        value={option}
        exclusive
        onChange={() => setOpen(true)}
        aria-label="text alignment"
      >
        <ToggleButton value="TextEditor" aria-label="left aligned">
          <TextFormatIcon />
        </ToggleButton>
        <ToggleButton value="CodeEditor" aria-label="centered">
          <CodeIcon />
        </ToggleButton>
        <Typography
          color="error"
          style={{
            marginLeft: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          Changing editors will erase all data.
        </Typography>
      </ToggleButtonGroup>

      {option === 'TextEditor' ? (
        <Body
          body={body}
          setBody={setBody}
          notSetUnsaved={notSetUnsaved}
        />
      )
        : null}
      {option === 'CodeEditor' ? (
        <CodeEditor
          body={body}
          setBody={setBody}
          notSetUnsaved={notSetUnsaved}
        />
      ) : null}
      {error ? (
        <Typography
          style={{ marginLeft: 15 }}
          variant="caption"
          display="block"
          color="error"
        >
          {errorMessage || 'Page body cannot be empty.'}
        </Typography>
      ) : null}
    </div>
  );
}
