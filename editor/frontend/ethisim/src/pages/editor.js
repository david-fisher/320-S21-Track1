import React, { useState, useEffect } from 'react';
import { makeStyles, useTheme, withStyles } from '@material-ui/core/styles';
import { Drawer, Box, Button, Typography } from '@material-ui/core';
import clsx from 'clsx';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Logistics from '../components/EditorComponents/LogisticsPageComponents/Logistics';
import Generic from '../components/EditorComponents/GenericPageComponents/Generic';
import ConfigureIssues from '../components/EditorComponents/ConfigureIssuesComponents/ConfigureIssues';
import ConversationEditor from '../components/EditorComponents/ConversationEditorComponents/ConversationEditor';
import Reflection from '../components/EditorComponents/ReflectionPageComponents/Reflection';
import Action from '../components/EditorComponents/ActionPageComponents/Action';
import Introduction from '../components/EditorComponents/GenericPageComponents/Introduction';
import FlowDiagram from '../components/EditorComponents/FlowDiagramComponents/FlowDiagram';
import AddNewSimulationScenarioPageDialog from '../components//EditorComponents/AddNewSimulationScenarioPageDialog';
import NavSideBarList from '../components/ConfigurationSideBarComponents/NavSideBarList';
import AddIcon from '@material-ui/icons/Add';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import SuccessBanner from '../components/Banners/SuccessBanner';
import ErrorBanner from '../components/Banners/ErrorBanner';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import RefreshIcon from '@material-ui/icons/Refresh';
import ErrorIcon from '@material-ui/icons/Error';

import universalPost from '../universalHTTPRequests/post.js';
import universalFetch from '../universalHTTPRequests/get.js';
import universalDelete from '../universalHTTPRequests/delete.js';
//  setResponse, endpoint, onError, onSuccess, requestBody

const drawerWidth = 250;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    appBar: {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    exitButton: {
        margin: theme.spacing(2),
        borderStyle: 'solid',
        borderColor: 'white',
        border: 2,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
    container: {
        marginTop: theme.spacing(1),
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    bannerContainer: {
        marginTop: theme.spacing(1),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    title: {
        textAlign: 'center',
    },
    copyright: {
        margin: theme.spacing(2),
        opacity: 0.5,
    },
    addPageButton: {
        margin: theme.spacing(2),
        textTransform: 'unset',
        border: 'solid 3px',
        borderColor: theme.palette.primary.light,
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
    },
    content1: {
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: -drawerWidth,
    },
    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
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
}));

Editor.propTypes = {
    location: PropTypes.any,
};

export default function Editor(props) {
    const [showComponent, setShowComponent] = useState(true);
    const [openPopup, setOpenPopup] = useState(false);

    const location = useLocation();
    const scenarioIDFromURL = location.pathname.split('/').pop();
    const scenario_ID = props.location.data
        ? props.location.data.SCENARIO
        : scenarioIDFromURL;

    //TODO when version control is implemented
    const tempVersionID = 1;

    const [getValues, setGetValues] = useState({
        data: null,
        loading: true,
        error: null,
    });

    // eslint-disable-next-line
    const [deleteValues, setDeleteValues] = useState({
        data: null,
        loading: true,
        error: null,
    });

    // eslint-disable-next-line
    const [postValues, setPostValues] = useState({
        data: null,
        loading: true,
        error: null,
    });

    const [scenarioComponents, setScenarioComponents] = useState([]);
    const [scenarioComponent, setScenarioComponent] = useState(null);
    const [showEditor, setShowEditor] = useState(false);
    const [addNewPageIndex, setAddNewPageIndex] = useState(null);
    const [currentPageID, setCurrentPageID] = useState(-1);

    let handleLogisticsGet = function handleLogisticsGet() {
        let initialComponents = [
            {
                id: -1,
                title: 'Logistics',
                component: <Logistics />,
            },
            {
                id: -2,
                title: 'Configure Issues',
                component: <ConfigureIssues />,
            },
            {
                id: -3,
                title: 'Conversation Editor',
                component: <ConversationEditor />,
            },
            { id: -4, title: 'Flow Diagram', component: <FlowDiagram /> },
        ];

        const endpoint = '/logistics?scenario_id=' + scenario_ID;

        function onSuccess(resp) {
            let p = null;
            let logistics_and_pages = resp.data;
            p = {
                scenario_ID: logistics_and_pages.SCENARIO,
                version_ID: logistics_and_pages.VERSION,
                title: logistics_and_pages.NAME,
                is_finished: logistics_and_pages.IS_FINISHED,
                public_scenario: logistics_and_pages.PUBLIC,
                num_convos: logistics_and_pages.NUM_CONVERSATION,
                professors: [logistics_and_pages.PROFESSOR],
                courses: logistics_and_pages.COURSES,
            };

            initialComponents[0].component = <Logistics {...p}></Logistics>;
            initialComponents[1].component = (
                <ConfigureIssues scenario_ID={p.scenario_ID}></ConfigureIssues>
            );
            initialComponents[2].component = (
                <ConversationEditor
                    scenario_ID={p.scenario_ID}
                ></ConversationEditor>
            );
            initialComponents[3].component = (
                <FlowDiagram scenario_ID={p.scenario_ID}></FlowDiagram>
            );

            let pages = logistics_and_pages.PAGES;

            for (let i = 0; i < pages.length; i++) {
                //Already have component in initial components
                if (pages[i].PAGE_TYPE === 'S') {
                    continue;
                }
                //Intro page is first page on sidebar
                if (pages[i].PAGE_TYPE === 'I') {
                    initialComponents.splice(4, 0, {
                        id: pages[i].PAGE,
                        title: pages[i].PAGE_TITLE,
                        isIntroPage: true,
                        component: null,
                    });
                } else {
                    initialComponents.push({
                        id: pages[i].PAGE,
                        title: pages[i].PAGE_TITLE,
                        component: null,
                    });
                }
            }
            setScenarioComponents(initialComponents);
            if (addNewPageIndex) {
                handlePageGet(
                    setGetValues,
                    initialComponents[addNewPageIndex].id,
                    initialComponents
                );
                setAddNewPageIndex(null);
            } else {
                setScenarioComponent(initialComponents[0].component);
            }
            setShowEditor(true);
        }

        function onFailure() {
            //console.log('Failed to get logistics info');
        }

        universalFetch(setGetValues, endpoint, onFailure, onSuccess, {
            SCENARIO: scenario_ID,
        });
    };

    //TODO implement banner
    function handleDelete(setDeleteValues, d_id) {
        const endpoint = '/page?page_id=' + d_id;
        function onSuccess(resp) {
            setSuccessBannerFade(true);
            setSuccessBannerMessage('Successfully deleted page!');
            setShowEditor(true);
        }
        function onFailure() {
            setErrorBannerFade(true);
            setErrorBannerMessage('Failed to save page! Please try again.');
        }

        universalDelete(setDeleteValues, endpoint, onFailure, onSuccess, {
            PAGE: d_id,
        });
    }

    function handlePageGet(setGetValues, g_id, scenarioComponentsArray) {
        const endpoint = '/page?page_id=' + g_id;

        function onSuccess(resp) {
            let p = null;
            let c = null;

            let currPageInfo = resp.data;
            if (currPageInfo.PAGE_TYPE === 'I') {
                p = {
                    scenarioComponents: scenarioComponentsArray,
                    setScenarioComponents: setScenarioComponents,
                    setCurrentPageID: setCurrentPageID,
                    page_id: currPageInfo.PAGE,
                    page_type: currPageInfo.PAGE_TYPE,
                    page_title: currPageInfo.PAGE_TITLE,
                    scenario_ID: currPageInfo.SCENARIO,
                    version_ID: tempVersionID,
                    next_page_id: currPageInfo.NEXT_PAGE,
                    body: currPageInfo.PAGE_BODY,
                    bodies: currPageInfo.BODIES,
                    xCoord: currPageInfo.X_COORDINATE,
                    yCoord: currPageInfo.Y_COORDINATE,
                    created: false,
                };
                c = <Introduction {...p}></Introduction>;
            } else if (currPageInfo.PAGE_TYPE === 'G') {
                p = {
                    scenarioComponents: scenarioComponentsArray,
                    setScenarioComponents: setScenarioComponents,
                    setCurrentPageID: setCurrentPageID,
                    page_id: currPageInfo.PAGE,
                    page_type: currPageInfo.PAGE_TYPE,
                    page_title: currPageInfo.PAGE_TITLE,
                    scenario_ID: currPageInfo.SCENARIO,
                    version_ID: tempVersionID,
                    next_page_id: currPageInfo.NEXT_PAGE,
                    body: currPageInfo.PAGE_BODY,
                    bodies: currPageInfo.BODIES,
                    xCoord: currPageInfo.X_COORDINATE,
                    yCoord: currPageInfo.Y_COORDINATE,
                    created: false,
                };
                c = <Generic {...p}></Generic>;
            } else if (currPageInfo.PAGE_TYPE === 'A') {
                p = {
                    scenarioComponents: scenarioComponentsArray,
                    setScenarioComponents: setScenarioComponents,
                    setCurrentPageID: setCurrentPageID,
                    page_id: currPageInfo.PAGE,
                    page_type: currPageInfo.PAGE_TYPE,
                    page_title: currPageInfo.PAGE_TITLE,
                    scenario_ID: currPageInfo.SCENARIO,
                    next_page_id: currPageInfo.NEXT_PAGE,
                    version_ID: tempVersionID,
                    body: currPageInfo.PAGE_BODY,
                    choice1: currPageInfo.CHOICES[0]
                        ? currPageInfo.CHOICES[0].CHOICE
                        : '',
                    r1: currPageInfo.CHOICES[0]
                        ? currPageInfo.CHOICES[0].RESULT_PAGE
                        : null,
                    choice2: currPageInfo.CHOICES[1]
                        ? currPageInfo.CHOICES[1].CHOICE
                        : '',
                    r2: currPageInfo.CHOICES[1]
                        ? currPageInfo.CHOICES[1].RESULT_PAGE
                        : null,
                    xCoord: currPageInfo.X_COORDINATE,
                    yCoord: currPageInfo.Y_COORDINATE,
                    created: false,
                };
                c = <Action {...p}></Action>;
            } else if (currPageInfo.PAGE_TYPE === 'R') {
                p = {
                    scenarioComponents: scenarioComponentsArray,
                    setScenarioComponents: setScenarioComponents,
                    setCurrentPageID: setCurrentPageID,
                    page_id: currPageInfo.PAGE,
                    page_type: currPageInfo.PAGE_TYPE,
                    page_title: currPageInfo.PAGE_TITLE,
                    scenario_ID: currPageInfo.SCENARIO,
                    version_ID: tempVersionID,
                    next_page_id: currPageInfo.NEXT_PAGE,
                    body: currPageInfo.PAGE_BODY,
                    reflection_questions: currPageInfo.REFLECTION_QUESTIONS,
                    xCoord: currPageInfo.X_COORDINATE,
                    yCoord: currPageInfo.Y_COORDINATE,
                    created: false,
                };
                c = <Reflection {...p}></Reflection>;
            }

            let newScenarioComponents = [...scenarioComponentsArray];
            newScenarioComponents = newScenarioComponents.map((x) =>
                x.id === resp.data.PAGE ? { ...x, component: c } : x
            );
            setCurrentPageID(currPageInfo.PAGE);
            setScenarioComponents(newScenarioComponents);
            setScenarioComponent(c);
            setShowComponent(true);
        }

        function onFailure() {
            //console.log('Get failed');
        }

        universalFetch(setGetValues, endpoint, onFailure, onSuccess, {
            PAGE: g_id,
        });
    }

    const classes = useStyles();
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const handleDrawerOpen = () => {
        setOpen(true);
    };
    const handleDrawerClose = () => {
        setOpen(false);
    };

    const WhiteTextTypography = withStyles({
        root: {
            color: '#FFFFFF',
        },
    })(Typography);

    const BlackTextTypography = withStyles({
        root: {
            color: '#000000',
        },
    })(Typography);

    const [shouldFetch, setShouldFetch] = useState(0);
    useEffect(handleLogisticsGet, [shouldFetch]);

    let onClick = (id, title, scenarioPages) => {
        setCurrentPageID(id);
        if (id !== -1 && id !== -2 && id !== -3 && id !== -4) {
            handlePageGet(setGetValues, id, scenarioPages);
        }
        setScenarioComponent(
            scenarioComponents.find((x) => x.id === id).component
        );
    };

    const deleteByID = (d_id) => {
        //If on page that is going to be deleted, redirect back to logistics page
        if (
            scenarioComponents.filter((i) => i.id === d_id)[0].id ===
            currentPageID
        ) {
            setCurrentPageID(-1);
            setScenarioComponent(scenarioComponents[0].component);
        }
        setScenarioComponents(scenarioComponents.filter((i) => i.id !== d_id));
        setShowEditor(false);
        handleDelete(setDeleteValues, d_id);
    };

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

    function Sidebar() {
        const classes = useStyles();

        const addNewPage = (pageType, pageName, pageBody) => {
            setShowComponent(false);
            const endpoint = '/api/pages/';
            // eslint-disable-next-line
            let c = null;
            // eslint-disable-next-line
            let p = null;
            let postReqBody;

            function onSuccess(resp) {
                setAddNewPageIndex(scenarioComponents.length);
                setShouldFetch(shouldFetch + 1);
            }

            function onFailure() {
                setShowEditor(true);
            }

            switch (pageType) {
                case 'Generic':
                    postReqBody = {
                        PAGE_TYPE: 'G',
                        PAGE_TITLE: pageName,
                        PAGE_BODY: pageBody,
                        SCENARIO: scenario_ID,
                        VERSION: tempVersionID,
                        NEXT_PAGE: null,
                        X_COORDINATE: 0,
                        Y_COORDINATE: 0,
                    };

                    p = {
                        setScenarioComponents: setScenarioComponents,
                        page_type: 'G',
                        page_title: pageName,
                        scenario_ID: scenario_ID,
                        body: pageBody,
                        bodies: [],
                        version_ID: tempVersionID,
                        next_page_id: null,
                        created: true,
                        xCoord: 0,
                        yCoord: 0,
                    };
                    break;
                case 'Reflection':
                    postReqBody = {
                        PAGE_TYPE: 'R',
                        PAGE_TITLE: pageName,
                        PAGE_BODY: pageBody,
                        SCENARIO: scenario_ID,
                        VERSION: tempVersionID,
                        NEXT_PAGE: null,
                        X_COORDINATE: 0,
                        Y_COORDINATE: 0,
                    };
                    p = {
                        setScenarioComponents: setScenarioComponents,
                        page_type: 'R',
                        page_title: pageName,
                        scenario_ID: scenario_ID,
                        version_ID: tempVersionID,
                        next_page_id: null,
                        body: pageBody,
                        reflection_questions: [],
                        created: true,
                        xCoord: 0,
                        yCoord: 0,
                    };
                    break;
                case 'Action':
                    postReqBody = {
                        PAGE_TYPE: 'A',
                        PAGE_TITLE: pageName,
                        PAGE_BODY: pageBody,
                        SCENARIO: scenario_ID,
                        VERSION: tempVersionID,
                        NEXT_PAGE: null,
                        X_COORDINATE: 0,
                        Y_COORDINATE: 0,
                    };
                    p = {
                        setScenarioComponents: setScenarioComponents,
                        page_type: 'A',
                        page_title: pageName,
                        scenario_ID: scenario_ID,
                        version_ID: tempVersionID,
                        next_page_id: null,
                        body: pageBody,
                        choice1: '',
                        r1: null,
                        choice2: '',
                        r2: null,
                        created: true,
                        xCoord: 0,
                        yCoord: 0,
                    };
                    break;
                default:
                    c = <Typography>Error</Typography>;
            }

            setShowEditor(false);

            universalPost(
                setPostValues,
                endpoint,
                onFailure,
                onSuccess,
                postReqBody
            );
        };

        function handleAddNewComponent() {
            setOpenPopup(true);
        }

        return (
            <div>
                <Drawer
                    className={classes.drawer}
                    variant="persistent"
                    anchor="left"
                    open={open}
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                >
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'ltr' ? (
                            <ChevronLeftIcon />
                        ) : (
                            <ChevronRightIcon />
                        )}
                        <BlackTextTypography variant="h6">
                            Hide Menu
                        </BlackTextTypography>
                    </IconButton>

                    <NavSideBarList
                        onClick={onClick}
                        deleteByID={deleteByID}
                        scenarioPages={scenarioComponents}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleAddNewComponent}
                        className={classes.addPageButton}
                    >
                        <AddIcon />
                        Add Page
                    </Button>
                </Drawer>
                <AddNewSimulationScenarioPageDialog
                    openPopup={openPopup}
                    title="Add New Page"
                    setOpenPopup={setOpenPopup}
                    addPage={addNewPage}
                ></AddNewSimulationScenarioPageDialog>
            </div>
        );
    }

    const NavBar = (
        <div>
            <CssBaseline />
            <AppBar
                position="fixed"
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: open,
                })}
            >
                <Toolbar>
                    <Box display="flex" flexGrow={1}>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            onClick={handleDrawerOpen}
                            edge="start"
                            className={clsx(
                                classes.menuButton,
                                open && classes.hide
                            )}
                        >
                            <MenuIcon />
                        </IconButton>

                        <Typography variant="h4" noWrap>
                            Ethisim Scenario Editor
                        </Typography>
                    </Box>

                    <Button
                        component={Link}
                        to={{
                            pathname: '/dashboard',
                        }}
                        className={classes.exitButton}
                    >
                        <WhiteTextTypography noWrap>
                            Return to Dashboard
                        </WhiteTextTypography>
                    </Button>
                </Toolbar>
            </AppBar>
        </div>
    );

    if (getValues.error) {
        return (
            <div>
                {NavBar}
                <div className={classes.issue}>
                    <div className={classes.container}>
                        <ErrorIcon className={classes.iconError} />
                        <Typography align="center" variant="h3">
                            Error in fetching Scenario Data.
                        </Typography>
                    </div>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleLogisticsGet}
                    >
                        <RefreshIcon className={classes.iconRefreshLarge} />
                    </Button>
                </div>
            </div>
        );
    }

    if (showEditor === false) {
        return <LoadingSpinner />;
    }

    return (
        <div className={classes.container}>
            {NavBar}
            <Sidebar />
            <main
                className={clsx(classes.content1, {
                    [classes.contentShift]: open,
                })}
            >
                <div className={classes.drawerHeader} />
                <div className={classes.bannerContainer}>
                    <SuccessBanner
                        successMessage={successBannerMessage}
                        fade={successBannerFade}
                    />
                    <ErrorBanner
                        errorMessage={errorBannerMessage}
                        fade={errorBannerFade}
                    />
                </div>
                {!getValues.data ||
                scenarioComponent === null ||
                getValues.loading ||
                !showComponent ? (
                    <LoadingSpinner />
                ) : (
                    <div>{scenarioComponent}</div>
                )}
            </main>
        </div>
    );
}
