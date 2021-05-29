import React, { useState } from 'react';
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

Toggle.propTypes = {
  body: PropTypes.string.isRequired,
  setBody: PropTypes.any.isRequired,
  error: PropTypes.bool,
  errorMessage: PropTypes.string,
  option: PropTypes.any,
  setOption: PropTypes.func,
};
export default function Toggle({
  body, setBody, error, errorMessage, option, setOption,
}) {
  // TODO Dialog warning
  const handleToggleChange = (e) => {
    setBody('');
    setOption(option === 'TextEditor' ? 'CodeEditor' : 'TextEditor');
    setOpen(false);
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
      </ToggleButtonGroup>
      {option === 'TextEditor' ? (
        <Body
          body={body}
          setBody={setBody}
          error={error}
          errorMessage="Page body cannot be empty."
        />
      )
        : null}
      {option === 'CodeEditor' ? (
        <CodeEditor
          body={body}
          setBody={setBody}
          error={error}
          errorMessage="Page body cannot be empty."
        />
      ) : null}
    </div>
  );
}
