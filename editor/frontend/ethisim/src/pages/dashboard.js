import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Container, Box, Typography, Grid, Divider } from '@material-ui/core';
import ScenarioCard from '../components/DashboardComponents/ScenarioCard';
import AddNewScenarioCard from '../components/DashboardComponents/AddNewScenarioCard';
import Copyright from '../components/Copyright';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { withStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import deleteReq from '../universalHTTPRequests/delete';
import post from '../universalHTTPRequests/post';
import get from '../universalHTTPRequests/get';
import LoadingSpinner from '../components/LoadingSpinner';
import RefreshIcon from '@material-ui/icons/Refresh';
import ErrorIcon from '@material-ui/icons/Error';
import SuccessBanner from '../components/Banners/SuccessBanner';
import ErrorBanner from '../components/Banners/ErrorBanner';
import Tags from '../components/DashboardComponents/DropDown';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import DashboardNavBar from '../components/DashboardComponents/DashboardNavbar';

const useStyles = makeStyles((theme) => ({
    container: {
        marginTop: theme.spacing(11),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    copyright: {
        margin: theme.spacing(2),
    },
    issue: {
        marginTop: theme.spacing(10),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    errorContainer: {
        marginTop: theme.spacing(2),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    iconError: {
        paddingRight: theme.spacing(2),
        fontSize: '75px',
    },
    iconRefreshLarge: {
        fontSize: '75px',
    },
    iconRefreshSmall: {
        fontSize: '30px',
    },
    border: {
        borderStyle: 'none none solid none',
        marginBottom: theme.spacing(2),
    },
}));

//TODO when Shibboleth gets implemented
const endpointGet = '/dashboard?professor_id=1';
const endpointGetCourses = '/api/courses/';
const endpointPost = '/dashboard';
const endpointDelete = '/api/scenarios/';

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

const DialogActions = withStyles((theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(1),
    },
}))(MuiDialogActions);

//Passing props with React Router in Material UI: https://stackoverflow.com/questions/30115324/pass-props-in-link-react-router
export default function Dashboard() {
    const classes = useStyles();

    // post on success, concatenating a scenario card to array
    //delete on success, concatenating a scenario card to array

    //when posting a new scenario setting fake id, now deleting that scenario, have to replace id with id in database

    //post returns new id of scenario, when you concatenating to array set the id to that
    const [finishedScenarios, setFinishedScenarios] = useState(null);
    const [unfinishedScenarios, setUnfinishedScenarios] = useState(null);
    const [menuCourseItems, setMenuCourseItems] = useState([]);
    const [open, setOpen] = React.useState(false);
    const [fetchScenariosResponse, setFetchScenariosResponse] = useState({
        data: null,
        loading: false,
        error: null,
    });
    // eslint-disable-next-line
    const [fetchCourseResponse, setFetchCourseResponse] = useState({
        data: null,
        loading: false,
        error: null,
    });
    // eslint-disable-next-line
    const [deleteReqValue, setDeleteReq] = useState({
        data: null,
        loading: false,
        error: null,
    });
    const [successBannerMessage, setSuccessBannerMessage] = useState('');
    const [successBannerFade, setSuccessBannerFade] = useState(false);
    const [errorBannerMessage, setErrorBannerMessage] = useState('');
    const [errorBannerFade, setErrorBannerFade] = useState(false);
    const [errorName, setErrorName] = useState(false);
    const [errorNameText, setErrorNameText] = useState('');
    const [errorCourses, setErrorCourses] = useState(false);
    const [shouldFetch, setShouldFetch] = useState(0);
    // eslint-disable-next-line
    const [postValue, setPost] = useState({
        data: null,
        loading: false,
        error: null,
    });
    const [NewScenario, setNewScenario] = useState({
        NAME: ' ',
        IS_FINISHED: false,
        PUBLIC: false,
        NUM_CONVERSATIONS: 0,
        PROFESSOR: 1,
        COURSES: [],
    });

    //For Banners
    useEffect(() => {
        const timeout = setTimeout(() => {
            setSuccessBannerFade(false);
        }, 1000);

        return () => clearTimeout(timeout);
    }, [successBannerFade]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setErrorBannerFade(false);
        }, 1000);

        return () => clearTimeout(timeout);
    }, [errorBannerFade]);

    //For create new scenario dialogue box
    const handleClickOpen = () => {
        setOpen(true);
        NewScenario.PUBLIC = false;
        setNewScenario(NewScenario);
        getCourses();
    };

    const handleCloseSave = () => {
        function onSuccessPost(resp) {
            setShouldFetch(shouldFetch + 1);
            setSuccessBannerMessage('Successfully created Scenario!');
            setSuccessBannerFade(true);
        }
        function onFailurePost() {
            setErrorBannerMessage(
                'Failed to create Scenario! Please try again.'
            );
            setErrorBannerFade(true);
            //Post failed, loading animation should end
            setFetchScenariosResponse({
                data: null,
                loading: false,
                error: null,
            });
        }

        let validInput = true;

        if (!NewScenario.NAME || !NewScenario.NAME.trim()) {
            setErrorName(true);
            setErrorNameText('Scenario name cannot be empty');
            validInput = false;
        } else if (NewScenario.NAME.length >= 1000) {
            setErrorName(true);
            setErrorNameText(
                'Scenario name must have less than 1000 characters'
            );
            validInput = false;
        } else {
            setErrorName(false);
        }

        if (NewScenario.COURSES.length === 0) {
            setErrorCourses(true);
            validInput = false;
        } else {
            setErrorCourses(false);
        }

        if (validInput) {
            setNewScenario({
                NAME: ' ',
                IS_FINISHED: false,
                PUBLIC: false,
                NUM_CONVERSATIONS: 0,
                PROFESSOR: 1,
                COURSES: [],
            });
            //Smooth loading animation, loading animation will not reset during POST and GET Request
            setFetchScenariosResponse({
                data: null,
                loading: true,
                error: null,
            });
            post(
                setPost,
                endpointPost,
                onFailurePost,
                onSuccessPost,
                NewScenario
            );
            setOpen(false);
        }
    };

    //X button on dialog for creating new scenario
    const handleClose = () => {
        setNewScenario({
            NAME: ' ',
            IS_FINISHED: false,
            PUBLIC: false,
            NUM_CONVERSATIONS: 0,
            PROFESSOR: 1,
            COURSES: [],
        });
        setErrorName(false);
        setErrorCourses(false);
        setErrorNameText('');
        setOpen(false);
    };

    //For new Scenario Post
    const handleOnChangeName = (event) => {
        NewScenario.NAME = event.target.value;
        setNewScenario(NewScenario);
    };

    const handleOnChangePublic = (info) => {
        NewScenario.PUBLIC = !NewScenario.PUBLIC;
        setNewScenario(NewScenario);
    };

    //Update Classes
    const updateSelectedClasses = (selectedClasses) => {
        //set new scenario courses to selected classes
        let sel = [];
        selectedClasses.map((element) => sel.push({ COURSE: element.COURSE }));
        NewScenario.COURSES = sel;
        setNewScenario(NewScenario);
    };

    //Delete Scenario
    const deleteScenario = (scenarioID, isFinished) => {
        function successfullyDeleted(resp) {
            if (isFinished) {
                setSuccessBannerFade(true);
                setSuccessBannerMessage('Successfully Deleted Scenario!');
                let newData = [];
                finishedScenarios &&
                    finishedScenarios.filter(
                        (entry) => entry.SCENARIO !== scenarioID
                    );
                setFinishedScenarios(newData);
                setShouldFetch(shouldFetch + 1);
            } else {
                setSuccessBannerFade(true);
                setSuccessBannerMessage('Successfully deleted scenario!');

                let newData = [];
                unfinishedScenarios &&
                    unfinishedScenarios.filter(
                        (entry) => entry.SCENARIO !== scenarioID
                    );
                setUnfinishedScenarios(newData);
                setShouldFetch(shouldFetch + 1);
            }
        }

        function onFailure() {
            setErrorBannerMessage(
                'Failed to delete scenario! Please try again.'
            );
            setErrorBannerFade(true);
            //Delete req failed, loading animation should end
            setFetchScenariosResponse({
                data: null,
                loading: false,
                error: null,
            });
        }

        //Smooth loading animation, loading animation will not reset during DELETE and GET Request
        setFetchScenariosResponse({
            data: null,
            loading: true,
            error: null,
        });

        deleteReq(
            setDeleteReq,
            endpointDelete + scenarioID + '/',
            onFailure,
            successfullyDeleted,
            null
        );
    };

    //Get Scenario
    let getData = () => {
        function onSuccess(response) {
            let finishedScenarios = response.data.filter(
                (data) => data.IS_FINISHED
            );
            let unfinishedScenarios = response.data.filter(
                (data) => !data.IS_FINISHED
            );
            finishedScenarios = finishedScenarios.map((data) => (
                <ScenarioCard
                    key={data.SCENARIO}
                    data={data}
                    scenarioID={data.SCENARIO}
                    scenarioName={data.NAME}
                    dateCreated={data.DATE_CREATED}
                    isFinished={data.IS_FINISHED}
                    courses={data.COURSES}
                    onDelete={deleteScenario}
                />
            ));
            unfinishedScenarios = unfinishedScenarios.map((data) => (
                <ScenarioCard
                    key={data.SCENARIO}
                    data={data}
                    scenarioID={data.SCENARIO}
                    scenarioName={data.NAME}
                    dateCreated={data.DATE_CREATED}
                    finished={data.IS_FINISHED}
                    courses={data.COURSES}
                    onDelete={deleteScenario}
                />
            ));
            setFinishedScenarios(finishedScenarios);
            setUnfinishedScenarios(unfinishedScenarios);
        }

        function onFailure() {
            setErrorBannerMessage('Failed to get scenarios! Please try again.');
            setErrorBannerFade(true);
        }
        get(setFetchScenariosResponse, endpointGet, onFailure, onSuccess);
    };

    //Get Courses
    let getCourses = () => {
        function onSuccessCourse(response) {
            setMenuCourseItems(response.data);
        }

        function onFailureCourse() {
            setErrorBannerMessage('Failed to get courses! Please try again.');
            setErrorBannerFade(true);
        }
        get(
            setFetchCourseResponse,
            endpointGetCourses,
            onFailureCourse,
            onSuccessCourse
        );
    };

    //Reload Page
    useEffect(getData, [shouldFetch]);

    if (fetchScenariosResponse.loading) {
        return (
            <div>
                <DashboardNavBar />
                <div style={{ marginTop: '100px' }}>
                    <LoadingSpinner />
                </div>
            </div>
        );
    }

    if (fetchScenariosResponse.error) {
        return (
            <div>
                <DashboardNavBar />
                <div className={classes.issue}>
                    <div className={classes.errorContainer}>
                        <ErrorBanner
                            fade={errorBannerFade}
                            errorMessage={errorBannerMessage}
                        />
                        <ErrorIcon className={classes.iconError} />
                        <Typography align="center" variant="h3">
                            Error in fetching Scenarios.
                        </Typography>
                    </div>
                    <div className={classes.errorContainer}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={getData}
                        >
                            <RefreshIcon className={classes.iconRefreshLarge} />
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <DashboardNavBar />
            <Container
                className={classes.container}
                component="main"
                maxWidth="lg"
            >
                <SuccessBanner
                    fade={successBannerFade}
                    successMessage={successBannerMessage}
                />
                <ErrorBanner
                    fade={errorBannerFade}
                    errorMessage={errorBannerMessage}
                />
                <div className={classes.border}>
                    <Typography variant="h3">Unfinished Scenarios</Typography>
                </div>
                <Grid
                    container
                    spacing={2}
                    direction="row"
                    justify="flex-start"
                    alignItems="stretch"
                >
                    {unfinishedScenarios}
                    <AddNewScenarioCard onClick={handleClickOpen} />
                </Grid>
                <div className={classes.border}>
                    <Typography variant="h3">Finished Scenarios</Typography>
                </div>
                <Grid
                    container
                    spacing={2}
                    direction="row"
                    justify="flex-start"
                    alignItems="stretch"
                >
                    {finishedScenarios}
                </Grid>
                <Box className={classes.copyright}>
                    <Copyright />
                </Box>
            </Container>

            <Dialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
                maxWidth={false}
            >
                <div style={{ width: 600 }}>
                    <DialogTitle
                        id="customized-dialog-title"
                        onClose={handleClose}
                    >
                        Create New Scenario
                    </DialogTitle>
                    <DialogContent>
                        <form style={{ marginBottom: 20 }}>
                            {errorName ? (
                                <TextField
                                    error
                                    label="Scenario Name"
                                    helperText={errorNameText}
                                    style={{ width: 500 }}
                                    rows={1}
                                    variant="outlined"
                                    onChange={handleOnChangeName}
                                />
                            ) : (
                                <TextField
                                    label="Scenario Name"
                                    style={{ width: 500 }}
                                    rows={1}
                                    variant="outlined"
                                    onChange={handleOnChangeName}
                                />
                            )}
                        </form>

                        <form style={{ marginBottom: 10 }}>
                            <Tags
                                courses={menuCourseItems}
                                update={updateSelectedClasses}
                            />
                            {errorCourses ? (
                                <Typography
                                    style={{ marginLeft: 15 }}
                                    variant="caption"
                                    display="block"
                                    color="error"
                                >
                                    At least one course must be selected
                                </Typography>
                            ) : null}
                        </form>

                        <Divider style={{ margin: '20px 0' }} />

                        <form style={{ marginLeft: -13 }}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        onChange={handleOnChangePublic}
                                        color="primary"
                                    />
                                }
                                label="Public"
                                labelPlacement="start"
                            />
                        </form>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            autoFocus
                            onClick={handleCloseSave}
                            color="primary"
                        >
                            Save changes
                        </Button>
                    </DialogActions>
                </div>
            </Dialog>
        </div>
    );
}
