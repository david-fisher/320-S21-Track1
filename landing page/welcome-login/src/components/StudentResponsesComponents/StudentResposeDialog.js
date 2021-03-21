import React, { useState } from 'react';
import { makeStyles, useTheme, withStyles } from '@material-ui/core/styles';
import { Drawer, Box, Button, Typography, Dialog } from '@material-ui/core';
import clsx from 'clsx';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ReflectionResponse from './ReflectionResponseComponent/ReflectionResponse';
import ActionResponse from './ActionResponseComponent/ActionResponse';
import NavSideBarList from './SideBar/NavSideBarList';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import PropTypes from 'prop-types';
import { mockFinishedScenarioStudentResponse } from '../../shared/mockScenarioData';

const drawerWidth = 240;
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
        marginLeft: 0,
    },
    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: drawerWidth,
    },
    closeDialogButton: {
        color: 'white',
        fontSize: '42px',
    },
}));

const addPage = (array, id, title, componentType, data) => {
    var c = null;
    switch (componentType) {
        case 'Reflection':
            c = <ReflectionResponse studentReflections={data} />;
            break;
        case 'Action':
            c = (
                <ActionResponse
                    option1={data.option1}
                    option2={data.option2}
                    choice={data.choice}
                    title={title}
                />
            );
            break;
        default:
            c = <Typography>Error</Typography>;
    }
    return array.concat({ id, title, page: c });
};

Data.propTypes = {
    open: PropTypes.any,
    selectedResponseData: PropTypes.any,
    handleClose: PropTypes.any,
};

export default function Data({ open, selectedResponseData, handleClose }) {
    const classes = useStyles();
    const { NAME } = selectedResponseData;
    const [openDrawer, setOpenDrawer] = React.useState(true);
    const theme = useTheme();
    const handleDrawerOpen = () => {
        setOpenDrawer(true);
    };
    const handleDrawerClose = () => {
        setOpenDrawer(false);
    };

    const BlackTextTypography = withStyles({
        root: {
            color: '#000000',
        },
    })(Typography);

    //Fake fetch of scenarioData with components
    let fetchedStudentResponses = mockFinishedScenarioStudentResponse;
    let reflectionResponses = fetchedStudentResponses.reflections;
    let actionResponses = fetchedStudentResponses.actions;
    actionResponses = actionResponses.reduce((result, currentValue) => {
        return addPage(
            result,
            currentValue.id,
            currentValue.title,
            'Action',
            currentValue
        );
    }, []);
    let studentResponsePages = reflectionResponses.reduce(
        (result, currentValue) => {
            return addPage(
                result,
                currentValue.id,
                currentValue.title,
                'Reflection',
                currentValue
            );
        },
        actionResponses
    );

    const [studentResponsePage, setStudentResponsePage] = useState(
        studentResponsePages[0].page
    );
    function Sidebar() {
        const classes = useStyles();

        const onClick = function (component) {
            setStudentResponsePage(component);
        };

        return (
            <div>
                <Drawer
                    className={classes.drawer}
                    variant="persistent"
                    anchor="left"
                    open={openDrawer}
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
                        studentResponsePages={studentResponsePages}
                    />
                </Drawer>
            </div>
        );
    }

    return (
        <Dialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={open}
            fullScreen={true}
        >
            <CssBaseline />
            <AppBar
                position="fixed"
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: openDrawer,
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
                                openDrawer && classes.hide
                            )}
                        >
                            <MenuIcon />
                        </IconButton>

                        <Typography variant="h4" noWrap>
                            {NAME + "'s Responses"}
                        </Typography>
                    </Box>

                    <Button
                        onClick={handleClose}
                        className={classes.closeButton}
                    >
                        <ExitToAppIcon className={classes.closeDialogButton} />
                    </Button>
                </Toolbar>
            </AppBar>

            <Sidebar />

            <main
                className={clsx(classes.content1, {
                    [classes.contentShift]: openDrawer,
                })}
            >
                <div className={classes.drawerHeader} />
                {studentResponsePage}
            </main>
        </Dialog>
    );
}
