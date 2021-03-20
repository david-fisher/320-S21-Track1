import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import {
    Box,
    Container,
    Typography,
    TextField,
    Button,
    Paper,
} from '@material-ui/core';
import Copyright from '../components/Copyright';
import { Link } from 'react-router-dom';
import HomepageNavBar from '../components/HomepageComponents/HomepageNavBar';
import Background from '../shared/umass.jpg';


const useStyles = makeStyles((theme) => ({
    container: {
        height: '100%',
        width: '100%',
        minHeight: '100vh',
        backgroundImage: `url(${Background})`
    },
    studentAccessContainer: {
        marginTop: '0',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    studentButtonsContainer: {
        marginTop: '0',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        paddingBottom: theme.spacing(4),
    },
    ethisimIntroContainer: {
        paddingTop: theme.spacing(4),
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    textField: {
        marginTop: theme.spacing(4),
    },
    accessButton: {
        marginTop: theme.spacing(2),
        marginRight: theme.spacing(2),
        width: '225px',
        textTransform: 'unset',
        borderStyle: 'solid',
        borderColor: 'black',
        border: 2,
    },
    guestButton: {
        marginTop: theme.spacing(2),
        marginRight: theme.spacing(2),
        width: '225px',
        textTransform: 'unset',
        borderStyle: 'none',
        borderColor: 'black',
        border: 2,
    },
    margin: {
        margin: theme.spacing(3),
    },
    copyright: {
        backgroundColor: theme.palette.primary.main,
        color: 'white',
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2),
        '@media (min-height:500px)': {
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            justifyContent: 'center',
            bottom: '0px',
            width: '100%',
            position: 'absolute',
        },
    },
    contentContainer:{
        height: '550px',
        width: '750px',
        position: 'absolute', left: '50%', top: '60%',
        transform: 'translate(-50%, -50%)'
    }
}));


const ValidationTextField = withStyles({
    root: {
        width: '300px',
        color: 'black',
        '& .MuiOutlinedInput-root': {
            '&:hover fieldset': {
                borderColor: 'black',
                borderWidth: '2',
            },
        },
        '& .MuiFormLabel-root': {
            color: 'black',
        },
        '& .MuiInputBase-root': {
            color: 'black',
        },
        '& input:valid + fieldset': {
            borderColor: 'black',
            borderWidth: 2,
        },
        '& input:invalid + fieldset': {
            borderColor: 'black',
            borderWidth: 2,
        },
        '& input:valid:focus + fieldset': {
            color: 'black',
            borderColor: 'black',
            borderLeftWidth: 6,
            padding: '4px !important', // override inline-style
        },
    },
})(TextField);

function StudentAccess() {
    const classes = useStyles();

    return (
        <div>
            {/* <Container className={classes.studentAccessContainer}>
                <form
                    className={classes.textField}
                    noValidate
                    autoComplete="off"
                >
                    <ValidationTextField
                        label="Enter Class Code"
                        id="Enter Class Code"
                        variant="outlined"
                    />
                </form>
            </Container> */}
            <Container className={classes.studentButtonsContainer}>
                <Button
                    component={Link}
                    to={'/login'}
                    className={classes.accessButton}
                    variant="contained"
                    color="primary"
                >
                    <Typography variant="h5" display="block" noWrap>
                        Learn More
                    </Typography>
                </Button>
                <Button
                    component={Link}
                    to={'/login'}
                    className={classes.accessButton}
                    variant="contained"
                    color="primary"
                >
                    <Typography variant="h5" display="block" noWrap>
                        Get Started
                    </Typography>
                </Button>
            </Container>
            <Container className={classes.studentButtonsContainer}>
                <Button
                    onClick={() => window.location.href = 'http://localhost:3001'}
                    className={classes.guestButton}
                    variant="contained"
                    color="gray"
                >
                    <Typography display="block" noWrap>
                        Try Ethisim as a Guest
                    </Typography>
                </Button>
            </Container>
        </div>
    );
}

const BlackTextTypography = withStyles({
    root: {
        color: '#000000',
    },
})(Typography);

function EthisimIntro() {
    const classes = useStyles();

    return (
        <div className={classes.ethisimIntroContainer}>
            <BlackTextTypography variant="h3" align="center">
                Welcome to <b>Ethisim</b>
            </BlackTextTypography>
            <BlackTextTypography variant="h5" align="center">
                Convenient Ethics Simulations
            </BlackTextTypography>
            <BlackTextTypography align="center" className={classes.margin}>
                Ethisim allows you to easily create and assign ethics
                <br />
                simulations. Run them for a participation grade, or
                <br />
                develop them further into longer discussions for class.
                <br />
            </BlackTextTypography>
        </div>
    );
}

function TotalContainer() {
    const classes = useStyles();

    return (
        <div className={classes.contentContainer}>
            <Paper elevation={0}>
                <EthisimIntro />
                <StudentAccess />
            </Paper>
        </div>
    )
}

export default function Homepage() {
    const classes = useStyles();

    return (
        <div className={classes.container}>
            <HomepageNavBar />
            <TotalContainer />
            <Paper square className={classes.copyright}>
                <Copyright />
            </Paper>
        </div>
    );
}
