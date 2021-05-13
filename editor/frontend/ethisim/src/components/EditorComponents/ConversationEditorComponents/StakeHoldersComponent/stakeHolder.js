import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { Avatar, Button, Box, DialogTitle } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogContent from '@material-ui/core/DialogContent';
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
import get from './../../../../universalHTTPRequests/get';
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
        height: '32px',
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
        height: '32px',
    },
    input: {
        display: 'none',
    },
    label: {
        color: '#808080',
        fontSize: 15,
    },
}));

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
    const [unsavedQuestions, setUnsavedQuestions] = useState(false);
    const [unsavedPointSelection, setUnsavedPointSelection] = useState(false);
    const [generalUnsaved, setGeneralUnsaved] = useState(false);

    //used for delete warning dialog
    const [openDeleteWarningDialog, setOpenDeleteWarningDialog] = useState(
        false
    );

    const handleOpenDeleteWarningDialog = () => {
        setOpenDeleteWarningDialog(true);
    };

    //used for unsaved warning dialog
    const [openUnsavedWarningDialog, setOpenUnsavedWarningDialog] = useState(
        false
    );
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
        updateStakeholderInfo(
            stakeHolderName,
            stakeHolderJob,
            stakeHolderBiography,
            stakeHolderConversation
        );
    };
    const handleClickOpenMainConvo = () => {
        setOpenMainConvo(true);
    };
    const handleCloseMainConvo = () => {
        setUnsavedMainConvo(false);
        setOpenUnsavedWarningDialog(false);
        setOpenMainConvo(false);
        updateStakeholderInfo(
            stakeHolderName,
            stakeHolderJob,
            stakeHolderBiography,
            stakeHolderConversation
        );
    };

    const handleClickOpenPointSelection = () => {
        getIssues();
    };
    const handleClosePointSelection = () => {
        setUnsavedPointSelection(false);
        setOpenUnsavedWarningDialog(false);
        setOpenPointSelection(false);
    };

    const handleClickOpenQuestions = () => {
        getQRs();
    };
    const handleCloseQuestions = () => {
        setUnsavedQuestions(false);
        setOpenUnsavedWarningDialog(false);
        setOpenQuestions(false);
    };

    let handleChangeBiography = (content, firstTime) => {
        if (!firstTime) {
            setUnsavedBio(true);
        } else {
            setUnsavedBio(false);
        }
        updateStakeholderInfo(
            stakeHolderName,
            stakeHolderJob,
            content,
            stakeHolderConversation
        );
    };

    let handleChangeConversation = (content, firstTime) => {
        if (!firstTime) {
            setUnsavedMainConvo(true);
        } else {
            setUnsavedMainConvo(false);
        }
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

    const [getQRsObj, setGetQRsObj] = useState({
        data: null,
        loading: false,
        error: null,
    });
    function getQRs() {
        const getEndpointQRs = '/api/conversations/?STAKEHOLDER=' + id;
        function onSuccess() {
            setOpenQuestions(true);
        }
        function onError(resp) {
            setErrorBannerMessage(
                'Failed to get stakeholder questions and answers! Please try again.'
            );
            setErrorBannerFade(true);
        }
        get(setGetQRsObj, getEndpointQRs, onError, onSuccess);
    }

    const [getIssuesObj, setGetIssuesObj] = useState({
        data: null,
        loading: false,
        error: null,
    });
    function getIssues() {
        const getEndpointIssues = '/coverages?stakeholder_id=';
        function onSuccess() {
            setOpenPointSelection(true);
        }
        function onError(resp) {
            setErrorBannerMessage(
                'Failed to get the issue(s) for this stakeholder! Please try again.'
            );
            setErrorBannerFade(true);
        }
        get(setGetIssuesObj, getEndpointIssues + id, onError, onSuccess);
    }

    const [error, setError] = useState(false);
    const saveStakeHolders = (e) => {
        function onSuccess(resp) {
            setGeneralUnsaved(false);
            setUnsavedBio(false);
            setUnsavedMainConvo(false);
            setStakeHolderBiography(resp.data.DESCRIPTION);
            setStakeHolderConversation(resp.data.INTRODUCTION);
            setSuccessBannerMessage('Successfully saved the stakeholder!');
            setSuccessBannerFade(true);
        }
        function onError(resp) {
            setErrorBannerMessage(
                'Failed to save Stakeholders! Please try again.'
            );
            setErrorBannerFade(true);
        }

        if (
            !stakeHolderObj.DESCRIPTION ||
            !stakeHolderObj.DESCRIPTION.trim() ||
            !stakeHolderObj.INTRODUCTION ||
            !stakeHolderObj.INTRODUCTION.trim()
        ) {
            setErrorBody(true);
            return;
        }
        setErrorBody(false);

        if (
            !stakeHolderObj.JOB ||
            !stakeHolderObj.JOB.trim() ||
            !stakeHolderObj.NAME ||
            !stakeHolderObj.NAME.trim()
        ) {
            setError(true);
            return;
        }
        setError(false);

        //1 second of timeout needed for text editor to save data
        setTimeout(
            () =>
                put(
                    setStakeHolderPUT,
                    endpointPUT + id + '/',
                    onError,
                    onSuccess,
                    stakeHolderObj
                ),
            1000
        );
    };

    /*
        if (stakeHolderPUT.loading || isLoading) {
            return <LoadingSpinner />;
        }
    */

    return (
        <div id="parent">
            <SuccessBanner
                successMessage={successBannerMessage}
                fade={successBannerFade}
            />
            <ErrorBanner
                errorMessage={errorBannerMessage}
                fade={errorBannerFade}
            />
            {generalUnsaved ? (
                <Typography
                    style={{ marginLeft: '30px' }}
                    variant="h6"
                    align="center"
                    color="error"
                >
                    Unsaved
                </Typography>
            ) : null}
            {error ? (
                <Typography
                    style={{ marginLeft: '5px' }}
                    variant="h6"
                    align="center"
                    color="error"
                >
                    Fields cannot be empty.
                </Typography>
            ) : null}
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
                disableBackdropClick={true}
                disableEscapeKeyDown={true}
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
                            disabled={stakeHolderPUT.loading}
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
                                style={{ marginLeft: '3%', marginTop: '-20px' }}
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
                disableBackdropClick={true}
                disableEscapeKeyDown={true}
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
                            disabled={stakeHolderPUT.loading}
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
                                style={{ marginLeft: '5%', marginTop: '-20px' }}
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
                open={openQuestions}
                maxWidth="md"
                fullWidth={true}
                className={classes.dialog}
                disableBackdropClick={true}
                disableEscapeKeyDown={true}
            >
                <GenericUnsavedWarning
                    func={handleCloseQuestions}
                    setOpen={setOpenUnsavedWarningDialog}
                    open={openUnsavedWarningDialog}
                />
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
                        Stakeholder Questions and Answers
                    </Typography>
                    <Button
                        className={classes.exitOutButton}
                        variant="contained"
                        color="primary"
                        disabled={stakeHolderPUT.loading}
                        onClick={
                            unsavedQuestions
                                ? handleOpenUnsavedWarningDialog
                                : handleCloseQuestions
                        }
                    >
                        <HighlightOffIcon />
                    </Button>
                </DialogTitle>
                <DialogContent>
                    <QuestionFields
                        setErrorBannerFade={setErrorBannerFade}
                        setErrorBannerMessage={setErrorBannerMessage}
                        setSuccessBannerMessage={setSuccessBannerMessage}
                        setSuccessBannerFade={setSuccessBannerFade}
                        setUnsaved={setUnsavedQuestions}
                        unsaved={unsavedQuestions}
                        qrs={getQRsObj.data ? getQRsObj.data : []}
                        stakeholder_id={id}
                    />
                </DialogContent>
            </Dialog>

            <Dialog
                onClose={handleClosePointSelection}
                aria-labelledby="customized-dialog-title"
                open={openPointSelection}
                maxWidth="lg"
                fullWidth={true}
                className={classes.dialog}
                disableBackdropClick={true}
                disableEscapeKeyDown={true}
            >
                <GenericUnsavedWarning
                    func={handleClosePointSelection}
                    setOpen={setOpenUnsavedWarningDialog}
                    open={openUnsavedWarningDialog}
                />
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
                        Stakeholder Questions and Answers
                    </Typography>
                    <Button
                        className={classes.exitOutButton}
                        variant="contained"
                        color="primary"
                        disabled={stakeHolderPUT.loading}
                        onClick={
                            unsavedPointSelection
                                ? handleOpenUnsavedWarningDialog
                                : handleClosePointSelection
                        }
                    >
                        <HighlightOffIcon />
                    </Button>
                </DialogTitle>
                <DialogContent>
                    <BasicTable
                        setErrorBannerFade={setErrorBannerFade}
                        setErrorBannerMessage={setErrorBannerMessage}
                        setSuccessBannerMessage={setSuccessBannerMessage}
                        setSuccessBannerFade={setSuccessBannerFade}
                        setUnsaved={setUnsavedPointSelection}
                        unsaved={unsavedPointSelection}
                        stakeholder_id={id}
                        passed_issues={
                            getIssuesObj.data ? getIssuesObj.data.ISSUES : []
                        }
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}
