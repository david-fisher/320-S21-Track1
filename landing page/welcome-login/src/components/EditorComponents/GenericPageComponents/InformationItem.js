import React from 'react';
import Box from '@material-ui/core/Box';
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';
import htmlToText from 'html-to-text';
import PropTypes from 'prop-types';
import GenericDeleteWarning from '../../DeleteWarnings/GenericDeleteWarning';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

let handleChange = (content) => {
    //TODO Implement
};

const useStyles = makeStyles((theme) => ({
    margin: {
        margin: theme.spacing(0.5),
        marginTop: theme.spacing(0),
        height: '5vh',
        textTransform: 'unset',
    },
}));

InformationItem.propTypes = {
    onDelete: PropTypes.any.isRequired,
    iItem: PropTypes.any.isRequired,
    data: PropTypes.any.isRequired,
};

export default function InformationItem(props) {
    InformationItem.propTypes = props.data;
    const classes = useStyles();
    //Warning to Delete information Item
    const [open, setOpen] = React.useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };

    return (
        <div>
            <SunEditor
                setOptions={{
                    width: '100%',
                    height: '200px',
                    placeholder: 'Enter body for information item...',
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

            <Box
                display="flex"
                flexDirection="row"
                p={1}
                m={1}
                bgcolor="background.paper"
            >
                <Box p={1}>
                    <div>
                        <Button
                            className={classes.margin}
                            variant="contained"
                            color="primary"
                        >
                            Save
                        </Button>
                        <Button
                            className={classes.margin}
                            variant="contained"
                            color="primary"
                            onClick={handleClickOpen}
                        >
                            Delete
                        </Button>
                        <GenericDeleteWarning
                            remove={() => props.onDelete(props.iItem.id)}
                            setOpen={setOpen}
                            open={open}
                        />
                    </div>
                </Box>
            </Box>
        </div>
    );
}
