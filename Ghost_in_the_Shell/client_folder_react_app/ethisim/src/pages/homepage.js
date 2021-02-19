import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import {
    Box,
    Container,
    Typography,
    TextField,
    Button,
} from '@material-ui/core';
import Copyright from '../components/Copyright';
import HomepageNavBar from '../components/HomepageComponents/HomepageNavBar';

const useStyles = makeStyles((theme) => ({
    container: {
        height: '100%',
        width: '100%',
        minHeight: '100vh',
        backgroundColor: theme.palette.primary.main,
    },
    studentAccessContainer: {
        marginTop: '0',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    ethisimIntroContainer: {
        marginTop: theme.spacing(4),
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
        width: '225px',
        textTransform: 'unset',
        borderStyle: 'solid',
        borderColor: 'white',
        border: 2,
    },
    margin: {
        margin: theme.spacing(3),
    },
    copyright: {
        color: 'white',
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
}));

const ValidationTextField = withStyles({
    root: {
        width: '300px',
        color: 'white',
        '& .MuiOutlinedInput-root': {
            '&:hover fieldset': {
                borderColor: 'white',
                borderWidth: '2',
            },
        },
        '& .MuiFormLabel-root': {
            color: 'white',
        },
        '& .MuiInputBase-root': {
            color: 'white',
        },
        '& input:valid + fieldset': {
            borderColor: 'white',
            borderWidth: 2,
        },
        '& input:invalid + fieldset': {
            borderColor: 'white',
            borderWidth: 2,
        },
        '& input:valid:focus + fieldset': {
            color: 'white',
            borderColor: 'white',
            borderLeftWidth: 6,
            padding: '4px !important', // override inline-style
        },
    },
})(TextField);

function StudentAccess() {
    const classes = useStyles();

    return (
        <div>
            <Container className={classes.studentAccessContainer}>
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
                <Button
                    className={classes.accessButton}
                    variant="contained"
                    color="primary"
                >
                    <Typography variant="h5" display="block" noWrap>
                        Join
                    </Typography>
                </Button>
            </Container>
        </div>
    );
}

const WhiteTextTypography = withStyles({
    root: {
        color: '#FFFFFF',
    },
})(Typography);

function EthisimIntro() {
    const classes = useStyles();

    return (
        <div className={classes.ethisimIntroContainer}>
            <WhiteTextTypography variant="h3" align="center">
                Convenient Ethics Simulations
            </WhiteTextTypography>
            <WhiteTextTypography align="center" className={classes.margin}>
                Ethisim allows you to easily create and assign ethics
                <br />
                simulations. Run them for a participation grade, or
                <br />
                develop them further into longer discussions for class.
                <br />
            </WhiteTextTypography>
        </div>
    );
}

export default function Homepage() {
    const classes = useStyles();

    return (
        <div className={classes.container}>
            <HomepageNavBar />
            <StudentAccess />
            <EthisimIntro />
            <Box className={classes.copyright}>
                <Copyright />
            </Box>
        </div>
    );
}
