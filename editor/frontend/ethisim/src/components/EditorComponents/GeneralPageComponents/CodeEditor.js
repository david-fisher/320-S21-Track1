import React, { useContext } from 'react';
import Typography from '@material-ui/core/Typography';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs';
import PropTypes from 'prop-types';
import './prism.css';
import GlobalUnsavedContext from '../../Context/GlobalUnsavedContext';

CodeEditor.propTypes = {
  body: PropTypes.string.isRequired,
  setBody: PropTypes.any.isRequired,
  error: PropTypes.bool,
  errorMessage: PropTypes.string,
};
export default function CodeEditor({
  body, setBody, error, errorMessage,
}) {
  // eslint-disable-next-line
  const [globalUnsaved, setGlobalUnsaved] = useContext(GlobalUnsavedContext);
  const handleChange = (str) => {
    setBody(str);
    setGlobalUnsaved(true);
  };

  return (
    <div>
      <Typography variant="h4">Code Editor</Typography>
      <div style={{ border: '1px solid black' }}>
        <Editor
          className="editor"
          value={body}
          defaultValue={body}
          onValueChange={handleChange}
          highlight={(code) => highlight(code, languages.js)}
          padding={15}
        />
      </div>
      {error ? (
        <Typography
          style={{ marginLeft: 15 }}
          variant="caption"
          display="block"
          color="error"
        >
          {errorMessage}
        </Typography>
      ) : null}
    </div>
  );
}
