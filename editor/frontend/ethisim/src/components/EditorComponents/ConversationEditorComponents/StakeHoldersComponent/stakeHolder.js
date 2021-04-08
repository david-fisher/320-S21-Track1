import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { Avatar, Button} from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import BasicTable from './table';
import './stakeHolder.css';
import QuestionFields from './StakeHolderQuestions/questions';
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';
import shemptylogo from './shemptylogo.png';
import PropTypes from 'prop-types';
import SuccessBanner from './../../../Banners/SuccessBanner';
import ErrorBanner from './../../../Banners/ErrorBanner';
import LoadingSpinner from './../../../LoadingSpinner';
import GenericDeleteWarning from '../../../DeleteWarnings/GenericDeleteWarning';
import { baseURL } from './../../../../Constants/Config';

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
        },
    },
    input: {
        display: 'none',
    },
    label:{
        color:'#808080',
        fontSize: 15
    }
}));

const styles = (theme) => ({
    root: {
        margin: 1,
        padding: theme.spacing(2),
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
});

const DialogTitle = withStyles(styles)((props) => {
    const { children, classes, onClose, ...other } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root} {...other}>
            <Typography variant="h6">{children}</Typography>
            {onClose ? (
                <IconButton
                    aria-label="close"
                    className={classes.closeButton}
                    onClick={onClose}
                >
                    <CloseIcon />
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
});

const DialogContent = withStyles((theme) => ({
    root: {
        padding: theme.spacing(2),
    },
}))(MuiDialogContent);

StakeHolder.propTypes = {
    name: PropTypes.string,
    bio: PropTypes.string,
    mainConvo: PropTypes.string,
    id: PropTypes.number,
    removeStakeHolder: PropTypes.any,
    job: PropTypes.string,
    photo: PropTypes.any,
    stakeHolders: PropTypes.any,
    setStakeHolders: PropTypes.func,
};

export default function StakeHolder({
    name,
    bio,
    mainConvo,
    id,
    removeStakeHolder,
    job,
    photo,
    stakeHolders,
    setStakeHolders
}) {
    const classes = useStyles();

    const [openBio, setOpenBio] = useState(false);
    const [openMainConvo, setOpenMainConvo] = useState(false);
    const [openPointSelection, setOpenPointSelection] = useState(false);
    const [openQuestions, setOpenQuestions] = useState(false);
    const [stakeHolderName, setStakeHolderName] = useState(name);
    const [stakeHolderJob, setStakeHolderJob] = useState(job);
    const [stakeHolderBiography, setStakeHolderBiography] = useState(bio);
    const [stakeHolderPhoto, setStakeHolderPhoto] = useState(photo); // Image object to be uploaded on save 
    const [stakeHolderConversation, setStakeHolderConversation] = useState(
        mainConvo
    );
    const[displayedPhoto, setdisplayedPhoto] = useState(photo); // Local image to be displayed
    const [issues, setIssues] = useState([]);
    const [qRData, setQRData] = useState([]);
    const [isLoading, setLoading] = useState(false);

    var axios = require('axios');

    //Warning for Deleteing a Conversation
    const [open, setOpen] = React.useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };

    //for success and error banners
    // eslint-disable-next-line
    const [successBannerMessage, setSuccessBannerMessage] = useState('');
    const [successBannerFade, setSuccessBannerFade] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setSuccessBannerFade(false);
        }, 1000);

        return () => clearTimeout(timeout);
    }, [successBannerFade]);

    const [errorBannerMessage, setErrorBannerMessage] = useState('');
    const [errorBannerFade, setErrorBannerFade] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setErrorBannerFade(false);
        }, 1000);

        return () => clearTimeout(timeout);
    }, [errorBannerFade]);

    //TABLE
    const handleClickOpenBio = () => {
        setOpenBio(true);
    };
    const handleCloseBio = () => {
        updateStakeholderInfo(
            stakeHolderName,
            stakeHolderJob,
            stakeHolderBiography,
            stakeHolderConversation,
            stakeHolderPhoto
        );
        setOpenBio(false);
    };
    const handleClickOpenMainConvo = () => {
        setOpenMainConvo(true);
    };
    const handleCloseMainConvo = () => {
        updateStakeholderInfo(
            stakeHolderName,
            stakeHolderJob,
            stakeHolderBiography,
            stakeHolderConversation,
            stakeHolderPhoto
        );
        setOpenMainConvo(false);
    };

    const handleClickOpenPointSelection = () => {
        getIssues();
    };
    const handleClosePointSelection = () => {
        setOpenPointSelection(false);
    };

    const handleClickOpenQuestions = () => {
        getQRs();
    };
    const handleCloseQuestions = () => {
        setOpenQuestions(false);
    };

    let handleChangeBiography = (content, editor) => {
        setStakeHolderBiography(content);
    };

    let handleChangeConversation = (content, editor) => {
        setStakeHolderConversation(content);
    };

    const onChangeName = (e) => {
        setStakeHolderName(e.target.value);
        updateStakeholderInfo(
            e.target.value,
            stakeHolderJob,
            stakeHolderBiography,
            stakeHolderConversation,
            stakeHolderPhoto
        );
    };

    const onChangeJob = (e) => {
        setStakeHolderJob(e.target.value);
        updateStakeholderInfo(
            stakeHolderName,
            e.target.value,
            stakeHolderBiography,
            stakeHolderConversation,
            stakeHolderPhoto
        );
    };

    const onUploadPhoto = (e) => { // Uses PUT request to upload photo to database
        var image = e.target.files[0];
        var url = URL.createObjectURL(image)
        setdisplayedPhoto(url);
        setStakeHolderPhoto(image);
        updateStakeholderInfo(
            stakeHolderName,
            stakeHolderJob,
            stakeHolderBiography,
            stakeHolderConversation,
            image
            );
    };

    function updateStakeholderInfo(shname, shjob, shbio, shconvo, shphoto) {
        const updatedStakeHolders = [...stakeHolders];
        setStakeHolders(
            updatedStakeHolders.map((sh) => {
                if (sh.STAKEHOLDER === id) {
                    sh.NAME = shname;
                    sh.JOB = shjob;
                    sh.DESCRIPTION = shbio;
                    sh.INTRODUCTION = shconvo;
                    sh.PHOTO = shphoto;
                }
                return sh;
            })
        );
    }

    function getQRs() {
        var data = {};
        var config = {
            method: 'get',
            url: baseURL + '/api/conversations/?STAKEHOLDER=' + id,
            headers: {
                'Content-Type': 'application/json',
            },
            data: data,
        };

        axios(config)
            .then(function (response) {
                setQRData(response.data);
                setOpenQuestions(true);
            })
            .catch(function (error) {
                setErrorBannerMessage(
                    'Failed to get the conversation(s) for this stakeholder! Please try again.'
                );
                setErrorBannerFade(true);
            });
    }

    function getIssues() {
        setLoading(true);
        var data = JSON.stringify({});

        var config = {
            method: 'get',
            url: baseURL + '/coverages?stakeholder_id=' + id,
            headers: {
                'Content-Type': 'application/json',
            },
            data: data,
        };

        axios(config)
            .then(function (response) {
                setIssues(response.data.ISSUES);
                setLoading(false);
                setOpenPointSelection(true);
            })
            .catch(function (error) {
                setErrorBannerMessage(
                    'Failed to get the issue(s) for this stakeholder! Please try again.'
                );
                setErrorBannerFade(true);
            });
    }

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <div id="parent">
            <div id="SHname">
                <TextField
                    label="StakeHolder Name"
                    value={stakeHolderName}
                    onChange={onChangeName}
                />
            </div>
            <div id="SHjob">
                <TextField
                    label="StakeHolder Job"
                    value={stakeHolderJob}
                    onChange={onChangeJob}
                />
            </div>
            
            <Avatar id="SHimg" src={displayedPhoto}/>
             
            <label id="upl"> 
                <Button
                    variant="contained"
                    color="primary"
                    component="span"
                    style={{ textTransform: 'unset' }}
                >
                    Select Image
                    <input
                        accept="image/jpeg, image/png"
                        type="file"
                        multiple={false}
                        hidden
                        onChange={onUploadPhoto}
                    />
                </Button>   
            </label>
             
            <div id="Bio">
                <Typography className={classes.label} variant="h6" color="initial">
                    Biography
                </Typography>
                <div onClick={handleClickOpenBio}>
                    <SunEditor
                                setContents={bio}
                                resizingBar={false}
                                disable={true}
                                showToolbar={false}
                                setOptions={{
                                    width: 500,
                                    height: 1,
                                    placeholder:
                                        'Enter the biography of the stakeholder...',
                                    }}
                                onChange={handleChangeBiography}
                            />
                </div>
            </div>

            <div id="MainConversationField">
                <Typography className={classes.label} variant="h6" color="initial">
                    Main Conversation
                </Typography>
                <div onClick={handleClickOpenMainConvo}>
                    <SunEditor
                                setContents={mainConvo}
                                resizingBar={false}
                                disable={true}
                                showToolbar={false}
                                setOptions={{
                                    width: 500,
                                    height: 1,
                                    placeholder:
                                        'Enter the main conversation of the stakeholder...',
                                    }}
                                onChange={handleChangeConversation}
                            />
                </div>
            </div>
            <div id="DeleteButton">
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleClickOpen}
                >
                    Delete
                </Button>

                <GenericDeleteWarning
                    remove={() => removeStakeHolder(id)}
                    setOpen={setOpen}
                    open={open}
                />
            </div>
            <div id="PointButton">
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleClickOpenPointSelection}
                >
                    Point Selection
                </Button>
            </div>

            <div id="stakequestion">
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleClickOpenQuestions}
                >
                    View Questions
                </Button>
            </div>

            <Dialog
                onClose={handleCloseBio}
                aria-labelledby="customized-dialog-title"
                open={openBio}
                maxWidth={false}
            >
                <div style={{ width: 900 }}>
                    <DialogTitle
                        id="customized-dialog-title"
                        onClose={handleCloseBio}
                    >
                        Biography
                    </DialogTitle>
                    <DialogContent>
                        <SunEditor
                            setContents={bio}
                            setOptions={{
                                width: '100%',
                                height: 400,
                                placeholder:
                                'Enter the biography of the stakeholder...',
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
                                    '/',
                                    ['undo', 'redo'],
                                    ['removeFormat'],
                                    ['outdent', 'indent'],
                                    [
                                        'align',
                                        'horizontalRule',
                                        'list',
                                        'lineHeight',
                                    ],
                                    [
                                        'table',
                                        'link',
                                        'image',
                                        'video',
                                        'audio',
                                    ],
                                    ['fullScreen', 'showBlocks', 'codeView'],
                                    ['preview'],
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
                                            [
                                                'bold',
                                                'underline',
                                                'italic',
                                                'strike',
                                            ],
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
                            onChange={handleChangeBiography}
                        />
                    </DialogContent>
                </div>
            </Dialog>

            <Dialog
                onClose={handleCloseMainConvo}
                aria-labelledby="customized-dialog-title"
                maxWidth={false}
                open={openMainConvo}
            >
                <div style={{ width: 900 }}>
                    <DialogTitle
                        id="customized-dialog-title"
                        onClose={handleCloseMainConvo}
                    >
                        Main Coversation
                    </DialogTitle>
                    <DialogContent>
                        <SunEditor
                            setContents={mainConvo}
                            setOptions={{
                                height: 400,
                                placeholder:
                                'Enter the main conversation of the stakeholder...',
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
                                    '/',
                                    ['undo', 'redo'],
                                    ['removeFormat'],
                                    ['outdent', 'indent'],
                                    [
                                        'align',
                                        'horizontalRule',
                                        'list',
                                        'lineHeight',
                                    ],
                                    [
                                        'table',
                                        'link',
                                        'image',
                                        'video',
                                        'audio',
                                    ],
                                    ['fullScreen', 'showBlocks', 'codeView'],
                                    ['preview'],
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
                                            [
                                                'bold',
                                                'underline',
                                                'italic',
                                                'strike',
                                            ],
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
                            onChange={handleChangeConversation}
                        />
                    </DialogContent>
                </div>
            </Dialog>

            <Dialog
                onClose={handleCloseQuestions}
                aria-labelledby="customized-dialog-title"
                maxWidth={false}
                open={openQuestions}
            >
                <div style={{ width: 900 }}>
                    <DialogTitle
                        id="customized-dialog-title"
                        onClose={handleCloseQuestions}
                    >
                        <h2 className="questions-header">Questions</h2>
                    </DialogTitle>
                    <DialogContent>
                        <QuestionFields qrs={qRData} stakeholder_id={id} />
                    </DialogContent>
                </div>
            </Dialog>

            <Dialog
                onClose={handleClosePointSelection}
                aria-labelledby="customized-dialog-title"
                open={openPointSelection}
            >
                <div className="point-selection-body" style={{ width: 500 }}>
                    <DialogTitle
                        id="customized-dialog-title"
                        onClose={handleClosePointSelection}
                    >
                        <div className="point-selection-header">
                            Point Selection
                        </div>
                    </DialogTitle>
                    <DialogContent>
                        <BasicTable
                            stakeholder_id={id}
                            passed_issues={issues}
                        />
                    </DialogContent>
                </div>
            </Dialog>
            <SuccessBanner
                successMessage={successBannerMessage}
                fade={successBannerFade}
            />
            <ErrorBanner
                errorMessage={errorBannerMessage}
                fade={errorBannerFade}
            />
        </div>
    );
}
