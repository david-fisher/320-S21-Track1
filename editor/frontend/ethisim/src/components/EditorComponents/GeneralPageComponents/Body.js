import React, { useContext } from 'react';
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';
import PropTypes from 'prop-types';
import GlobalUnsavedContext from '../../../Context/GlobalUnsavedContext';

Body.propTypes = {
  body: PropTypes.string.isRequired,
  setBody: PropTypes.any.isRequired,
  notSetUnsaved: PropTypes.bool,
};

export default function Body(props) {
  const {
    body, setBody, notSetUnsaved,
  } = props;
  // eslint-disable-next-line
    const [globalUnsaved, setGlobalUnsaved] = useContext(GlobalUnsavedContext);
  let firstTime = true;
  // Executes handleChange when you first click on the text editor
  // There are no unsaved changes until a person types something in
  const handleChange = (content) => {
    if (firstTime) {
      setBody(content, firstTime);
      firstTime = false;
    } else {
      setBody(content, firstTime);
      if (notSetUnsaved) {
        return;
      }
      setGlobalUnsaved(true);
    }
  };

  return (
    <SunEditor
      setContents={body}
      setOptions={{
        width: '100%',
        height: 400,
        placeholder: 'Enter in body for your page...',
        buttonList: [
          ['font', 'fontSize', 'formatBlock'],
          ['paragraphStyle', 'blockquote'],
          [
            'bold',
            'underline',
            'italic',
            'strike',
            'subscript',
            'superscript',
          ],
          ['fontColor', 'hiliteColor', 'textStyle'],
          '/', // Line break
          ['undo', 'redo'],
          ['removeFormat'],
          ['outdent', 'indent'],
          ['align', 'horizontalRule', 'list', 'lineHeight'],
          ['table', 'link', 'image', 'video', 'audio'],
          ['fullScreen', 'showBlocks', 'codeView'],
          ['preview'],
          // (min-width: 1000px)
          [
            '%1000',
            [
              ['undo', 'redo'],
              [
                ':p-More Paragraph-default.more_paragraph',
                'font',
                'fontSize',
                'formatBlock',
                'paragraphStyle',
                'blockquote',
              ],
              ['bold', 'underline', 'italic', 'strike'],
              [
                ':t-More Text-default.more_text',
                'subscript',
                'superscript',
                'fontColor',
                'hiliteColor',
                'textStyle',
              ],
              ['removeFormat'],
              ['outdent', 'indent'],
              [
                ':e-More Line-default.more_horizontal',
                'align',
                'horizontalRule',
                'list',
                'lineHeight',
              ],
              [
                '-right',
                ':i-More Misc-default.more_vertical',
                'fullScreen',
                'showBlocks',
                'codeView',
                'preview',
              ],
              [
                '-right',
                ':r-More Rich-default.more_plus',
                'table',
                'link',
                'image',
                'video',
                'audio',
              ],
            ],
          ],
          // (min-width: 875px)
          [
            '%875',
            [
              ['undo', 'redo'],
              [
                ':p-More Paragraph-default.more_paragraph',
                'font',
                'fontSize',
                'formatBlock',
                'paragraphStyle',
                'blockquote',
              ],
              [
                ':t-More Text-default.more_text',
                'bold',
                'underline',
                'italic',
                'strike',
                'subscript',
                'superscript',
                'fontColor',
                'hiliteColor',
                'textStyle',
                'removeFormat',
              ],
              [
                ':e-More Line-default.more_horizontal',
                'outdent',
                'indent',
                'align',
                'horizontalRule',
                'list',
                'lineHeight',
              ],
              [
                ':r-More Rich-default.more_plus',
                'table',
                'link',
                'image',
                'video',
                'audio',
              ],
              [
                '-right',
                ':i-More Misc-default.more_vertical',
                'fullScreen',
                'showBlocks',
                'codeView',
                'preview',
              ],
            ],
          ],
        ],
      }}
      onChange={handleChange}
    />
  );
}
