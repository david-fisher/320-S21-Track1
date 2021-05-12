import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { Avatar, Button, Box, DialogTitle } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import BasicTable from './table';
import QuestionFields from './StakeHolderQuestions/questions';
import SunEditor from 'suneditor-react';
import Body from './SunEditor';
import 'suneditor/dist/css/suneditor.min.css';
import PropTypes from 'prop-types';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import SuccessBanner from './../../../Banners/SuccessBanner';
import ErrorBanner from './../../../Banners/ErrorBanner';
//import LoadingSpinner from './../../../LoadingSpinner';
import GenericDeleteWarning from '../../../WarningDialogs/GenericDeleteWarning';
import GenericUnsavedWarning from '../../../WarningDialogs/GenericUnsavedWarning';
import { baseURL } from './../../../../Constants/Config';
import put from './../../../../universalHTTPRequests/put';

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
        },
    },
    containerRow: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    containerColumn: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        flexDirection: 'column',
    },
    image: {
        width: '80%',
        height: '80%',
    },
    spacing: {
        margin: theme.spacing(1),
    },
    button: {
        margin: theme.spacing(1),
        textTransform: 'unset',
    },
    dialog: {
        overflowX: 'hidden',
    },
    dialogWrapper: {
        padding: theme.spacing(2),
        position: 'absolute',
        top: theme.spacing(5),
    },
    exitOutButton: {
        margin: theme.spacing(1),
        marginLeft: 'auto',
        float: 'right',
    },
    input: {
        display: 'none',
    },
    label: {
        color: '#808080',
        fontSize: 15,
    },
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
    scenario: PropTypes.number,
    version: PropTypes.number,
};

const endpointPUT = '/api/stakeholders/';
export default function StakeHolder({
    name,
    bio,
    mainConvo,
    id,
    removeStakeHolder,
    job,
    photo,
    stakeHolders,
    setStakeHolders,
    scenario,
    version,
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
    const [displayedPhoto, setdisplayedPhoto] = useState(photo); // Local image to be displayed
    const [issues, setIssues] = useState([]);
    const [qRData, setQRData] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [errorBody, setErrorBody] = useState(false);
    const [stakeHolderPUT, setStakeHolderPUT] = useState({
        data: null,
        loading: false,
        error: null,
    });
    const [stakeHolderObj, setStakeHolderObj] = useState({
        DESCRIPTION: bio,
        INTRODUCTION: mainConvo,
        JOB: job,
        NAME: name,
        PHOTO: photo,
        SCENARIO: scenario,
        STAKEHOLDER: id,
        VERSION: version,
    });
    const [unsavedMainConvo, setUnsavedMainConvo] = useState(false);
    const [unsavedBio, setUnsavedBio] = useState(false);
    const [generalUnsaved, setGeneralUnsaved] = useState(false);

    var axios = require('axios');

    //Warning for Deleteing a Conversation
    const [openDeleteWarningDialog, setOpenDeleteWarningDialog] = useState(
        false
    );
    const [openUnsavedWarningDialog, setOpenUnsavedWarningDialog] = useState(
        false
    );

    const handleOpenDeleteWarningDialog = () => {
        setOpenDeleteWarningDialog(true);
    };

    const handleOpenUnsavedWarningDialog = () => {
        setOpenUnsavedWarningDialog(true);
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
        setUnsavedBio(false);
        setOpenUnsavedWarningDialog(false);
        setOpenBio(false);
    };
    const handleClickOpenMainConvo = () => {
        setOpenMainConvo(true);
    };
    const handleCloseMainConvo = () => {
        setUnsavedMainConvo(false);
        setOpenUnsavedWarningDialog(false);
        setOpenMainConvo(false);
    };

    const handleClickOpenPointSelection = () => {
        getIssues();
    };
    const handleClosePointSelection = () => {
        setOpenUnsavedWarningDialog(false);
        setOpenPointSelection(false);
    };

    const handleClickOpenQuestions = () => {
        getQRs();
    };
    const handleCloseQuestions = () => {
        setOpenUnsavedWarningDialog(false);
        setOpenQuestions(false);
    };

    let handleChangeBiography = (content, editor) => {
        setUnsavedBio(true);
        setStakeHolderBiography(content);
        updateStakeholderInfo(
            stakeHolderName,
            stakeHolderJob,
            content,
            stakeHolderConversation
        );
    };

    let handleChangeConversation = (content, editor) => {
        setUnsavedMainConvo(true);
        setStakeHolderConversation(content);
        updateStakeholderInfo(
            stakeHolderName,
            stakeHolderJob,
            stakeHolderBiography,
            content
        );
    };

    const onChangeName = (e) => {
        setGeneralUnsaved(true);
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
        setGeneralUnsaved(true);
        setStakeHolderJob(e.target.value);
        updateStakeholderInfo(
            stakeHolderName,
            e.target.value,
            stakeHolderBiography,
            stakeHolderConversation,
            stakeHolderPhoto
        );
    };

    const onUploadPhoto = (e) => {
        // Uses PUT request to upload photo to database
        setGeneralUnsaved(true);
        var image = e.target.files[0];
        var url = URL.createObjectURL(image);
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
        setStakeHolderObj({
            ...stakeHolderObj,
            NAME: shname,
            JOB: shjob,
            DESCRIPTION: shbio,
            INTRODUCTION: shconvo,
            PHOTO: shphoto,
        });
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

    const saveStakeHolders = (e) => {
        function onSuccess(resp) {
            setGeneralUnsaved(false);
            setUnsavedBio(false);
            setUnsavedMainConvo(false);
            setSuccessBannerMessage('Successfully saved the stakeholders!');
            setSuccessBannerFade(true);
        }
        function onError(resp) {
            setErrorBannerMessage(
                'Failed to save Stakeholders! Please try again.'
            );
            setErrorBannerFade(true);
        }
        put(
            setStakeHolderPUT,
            endpointPUT + id + '/',
            onError,
            onSuccess,
            stakeHolderObj
        );
    };

    /*
        if (stakeHolderPUT.loading || isLoading) {
            return <LoadingSpinner />;
        }
    */

    return (
        <div id="parent">
            <div className={classes.containerRow}>
                <div id="SHname" className={classes.spacing}>
                    <TextField
                        label="StakeHolder Name"
                        value={stakeHolderName}
                        onChange={onChangeName}
                    />
                </div>
                <div id="SHjob" className={classes.spacing}>
                    <TextField
                        label="StakeHolder Job"
                        value={stakeHolderJob}
                        onChange={onChangeJob}
                    />
                </div>
            </div>

            <Box display="flex" flexDirection="row">
                <Box
                    p={1}
                    className={classes.containerColumn}
                    style={{ width: '25%' }}
                >
                    <Avatar
                        id="SHimg"
                        src={displayedPhoto}
                        className={classes.image}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        component="span"
                        className={classes.button}
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
                </Box>

                <Box p={1} style={{ width: '75%' }}>
                    <div id="Bio">
                        <Typography
                            className={classes.label}
                            variant="h6"
                            color="initial"
                        >
                            Biography
                        </Typography>
                        <div onClick={handleClickOpenBio}>
                            <SunEditor
                                setContents={bio}
                                disable={true}
                                showToolbar={false}
                                setOptions={{
                                    width: 500,
                                    height: 1,
                                    placeholder:
                                        'Enter the biography of the stakeholder...',
                                    resizingBar: false,
                                    showPathLabel: false,
                                }}
                            />
                        </div>
                    </div>

                    <div id="MainConversationField">
                        <Typography
                            className={classes.label}
                            variant="h6"
                            color="initial"
                        >
                            Main Conversation
                        </Typography>
                        <div onClick={handleClickOpenMainConvo}>
                            <SunEditor
                                setContents={mainConvo}
                                disable={true}
                                showToolbar={false}
                                setOptions={{
                                    width: 500,
                                    height: 1,
                                    placeholder:
                                        'Enter the main conversation of the stakeholder...',
                                    resizingBar: false,
                                    showPathLabel: false,
                                }}
                                onChange={handleChangeConversation}
                            />
                        </div>
                    </div>
                </Box>
            </Box>

            <div className={classes.containerRow}>
                <div id="SaveButton">
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={saveStakeHolders}
                        className={classes.button}
                    >
                        Save
                    </Button>
                </div>

                <div id="DeleteButton">
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleOpenDeleteWarningDialog}
                        className={classes.button}
                    >
                        Delete
                    </Button>

                    <GenericDeleteWarning
                        remove={() => removeStakeHolder(id)}
                        setOpen={setOpenDeleteWarningDialog}
                        open={openDeleteWarningDialog}
                    />
                </div>

                <div id="PointButton">
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleClickOpenPointSelection}
                        className={classes.button}
                    >
                        Point Selection
                    </Button>
                </div>

                <div id="stakequestion">
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleClickOpenQuestions}
                        className={classes.button}
                    >
                        View Questions
                    </Button>
                </div>
            </div>

            <Dialog
                onClose={handleCloseBio}
                aria-labelledby="customized-dialog-title"
                open={openBio}
                maxWidth="lg"
                fullWidth={true}
                className={classes.dialog}
            >
                <GenericUnsavedWarning
                    func={handleCloseBio}
                    setOpen={setOpenUnsavedWarningDialog}
                    open={openUnsavedWarningDialog}
                />
                <div>
                    <DialogTitle
                        disableTypography={true}
                        style={{ display: 'flex' }}
                    >
                        <Typography
                            variant="h5"
                            align="center"
                            component="div"
                            style={{ display: 'flex' }}
                        >
                            Biography
                        </Typography>
                        <div className={classes.containerRow}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={saveStakeHolders}
                                className={classes.button}
                                style={{ marginRight: '10px' }}
                            >
                                Save
                            </Button>
                        </div>
                        <Button
                            className={classes.exitOutButton}
                            variant="contained"
                            color="primary"
                            onClick={
                                unsavedBio
                                    ? handleOpenUnsavedWarningDialog
                                    : handleCloseBio
                            }
                        >
                            <HighlightOffIcon />
                        </Button>
                    </DialogTitle>
                    <DialogContent className={classes.dialog}>
                        {unsavedBio ? (
                            <Typography
                                style={{ marginLeft: '30px' }}
                                variant="h6"
                                align="center"
                                color="error"
                            >
                                Unsaved
                            </Typography>
                        ) : null}
                        <Body
                            body={bio}
                            setBody={handleChangeBiography}
                            error={errorBody}
                            errorMessage={
                                'Stakeholder biography cannot be empty'
                            }
                        />
                    </DialogContent>
                </div>
            </Dialog>

            <Dialog
                onClose={handleCloseMainConvo}
                aria-labelledby="customized-dialog-title"
                maxWidth="lg"
                fullWidth={true}
                open={openMainConvo}
                className={classes.dialog}
            >
                <GenericUnsavedWarning
                    func={handleCloseMainConvo}
                    setOpen={setOpenUnsavedWarningDialog}
                    open={openUnsavedWarningDialog}
                />
                <div>
                    <DialogTitle
                        disableTypography={true}
                        style={{ display: 'flex' }}
                    >
                        <Typography
                            variant="h5"
                            align="center"
                            component="div"
                            style={{ display: 'flex' }}
                        >
                            Main Conversation
                        </Typography>
                        <div className={classes.containerRow}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={saveStakeHolders}
                                className={classes.button}
                                style={{ marginRight: '30px' }}
                            >
                                Save
                            </Button>
                        </div>
                        <Button
                            className={classes.exitOutButton}
                            variant="contained"
                            color="primary"
                            onClick={
                                unsavedMainConvo
                                    ? handleOpenUnsavedWarningDialog
                                    : handleCloseMainConvo
                            }
                        >
                            <HighlightOffIcon />
                        </Button>
                    </DialogTitle>
                    <DialogContent className={classes.dialog}>
                        {unsavedMainConvo ? (
                            <Typography
                                style={{ marginLeft: '30px' }}
                                variant="h6"
                                align="center"
                                color="error"
                            >
                                Unsaved
                            </Typography>
                        ) : null}
                        <Body
                            body={mainConvo}
                            setBody={handleChangeConversation}
                            error={errorBody}
                            errorMessage={
                                'Stakeholder biography cannot be empty'
                            }
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
