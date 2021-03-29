import React from 'react';
import { Typography, Fade } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import ErrorIcon from '@material-ui/icons/Error';

const useStyles = makeStyles((theme) => ({
    container: {
        position: 'fixed',
        padding: theme.spacing(1),
        bottom: '0px',
        width: '50%',
        border: '5px solid',
        zIndex: '100',
        borderColor: theme.palette.error.dark,
        backgroundColor: theme.palette.error.main,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
    },
    icon: {
        paddingRight: theme.spacing(2),
        fontSize: '40px',
        color: 'white',
    },
}));

ErrorBanner.propTypes = {
    fade: PropTypes.any,
    errorMessage: PropTypes.string,
};

/* To use fade correctly:

    1. Set state of fade variable
    const [successBannerFade, setErrorBannerFade] = useState(false);
    
    2. Use useEffect to switch "fade" from true to false, fading out the success banner.

        useEffect(() => {
        const timeout = setTimeout(() => {
            setErrorBannerFade(false);
        }, 1000);

        return () => clearTimeout(timeout);
    }, [successBannerFade]);

    When "Error" (successful GET/POST/PUT/DELETE request):
    2. setErrorBannerFade(true);
       setErrorBannerMessage('Error!');

    useEffect will detect the change, and in setErrorBannerFade(false), after 1 second, the banner will fade away.
*/

export default function ErrorBanner({ errorMessage, fade }) {
    const classes = useStyles();
    return (
        <Fade timeout={{ appear: 0, exit: 3000 }} in={fade}>
            <div className={classes.container}>
                <ErrorIcon className={classes.icon} />
                <Typography align="center" variant="h6">
                    {errorMessage}
                </Typography>
            </div>
        </Fade>
    );
}
