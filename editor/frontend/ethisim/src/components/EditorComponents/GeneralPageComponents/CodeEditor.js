import React, { useContext } from 'react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs';
import PropTypes from 'prop-types';
import './prism.css';
import GlobalUnsavedContext from '../../../Context/GlobalUnsavedContext';

CodeEditor.propTypes = {
  body: PropTypes.string.isRequired,
  setBody: PropTypes.any.isRequired,
  notSetUnsaved: PropTypes.bool,
};
export default function CodeEditor({
  body, setBody, notSetUnsaved,
}) {
  // eslint-disable-next-line
  const [globalUnsaved, setGlobalUnsaved] = useContext(GlobalUnsavedContext);
  const handleChange = (str) => {
    setBody(str);
    if (notSetUnsaved) {
      return;
    }
    setGlobalUnsaved(true);
  };

  return (
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
  );
}
