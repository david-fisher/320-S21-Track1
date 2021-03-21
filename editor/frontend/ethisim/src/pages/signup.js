import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import {
    Button,
    TextField,
    Box,
    Typography,
    Container,
} from '@material-ui/core';
import Copyright from '../components/Copyright';
import RedLogo from '../shared/RedLogo.png';

const useStyles = makeStyles((theme) => ({
    container: {
        marginTop: theme.spacing(2),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    logo: {
        width: '100px',
    },
    form: {
        marginTop: theme.spacing(1),
        width: '100%',
    },
    submit: {
        marginTop: theme.spacing(2),
        backgroundColor: theme.palette.primary.main,
        color: 'white',
    },
    copyright: {
        margin: theme.spacing(2),
        opacity: 0.5,
    },
}));

export default function Signup() {
    const classes = useStyles();

    //TODO add functionality to signup account button
    return (
        <Container component="main" maxWidth="xs">
            <div className={classes.container}>
                <img src={RedLogo} alt="EthismLogo" className={classes.logo} />
                <Typography variant="h4">Sign up</Typography>
                <form className={classes.form}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="first_name"
                        label="First Name"
                        name="first_name"
                        autoComplete="first_name"
                        autoFocus
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="last_name"
                        label="Last Name"
                        name="last_name"
                        autoComplete="last_name"
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email_address"
                        label="Email Address"
                        name="email_address"
                        autoComplete="email_address"
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Username"
                        name="username"
                        autoComplete="username"
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="password"
                        label="Password"
                        name="password"
                        autoComplete="password"
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="confirm_password"
                        label="Confirm Password"
                        name="confirm_password"
                        autoComplete="confirm_password"
                    />
                    <Button
                        component={Link}
                        to={'/login'}
                        type="submit"
                        fullWidth
                        variant="contained"
                        className={classes.submit}
                    >
                        Sign up
                    </Button>
                </form>
            </div>
            <Box className={classes.copyright}>
                <Copyright />
            </Box>
        </Container>
    );
}
