import React from 'react';
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';
import PropTypes from 'prop-types';

EditedSunEditor.propTypes = {
    setText: PropTypes.any,
    text: PropTypes.string,
};

export default function EditedSunEditor({ setText, text }) {
    let handleChange = (content) => {
        setText(content);
    };

    return (
        <div>
            <SunEditor
                setContents={text}
                setOptions={{
                    width: '100%',
                    height: 150,
                    placeholder: 'Enter in Introduction for Scenario Page...',
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
                        '/', // Line break
                        ['undo', 'redo'],
                        ['removeFormat'],
                        ['outdent', 'indent'],
                        ['align', 'horizontalRule', 'list', 'lineHeight'],
                        ['preview'],
                        // (min-width: 1200px)
                        [
                            '%1200',
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
        </div>
    );
}
