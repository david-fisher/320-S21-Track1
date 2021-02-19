import React, { useState, useEffect } from 'react';
import Body from '../GeneralPageComponents/Body';
import Title from '../GeneralPageComponents/Title';
import { Typography, Container, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import universalPost from '../../../universalHTTPRequests/post.js';
import universalDelete from '../../../universalHTTPRequests/delete.js';
import SuccessBanner from '../../Banners/SuccessBanner';
import ErrorBanner from '../../Banners/ErrorBanner';
import LoadingSpinner from '../../LoadingSpinner';

const useStyles = makeStyles((theme) => ({
    saveButton: {
        margin: theme.spacing(2),
        float: 'right',
        textTransform: 'unset',
    },
    bannerContainer: {
        marginTop: theme.spacing(1),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
}));

Introduction.propTypes = {
    scenarioComponents: PropTypes.any,
    setScenarioComponents: PropTypes.any,
    setCurrentPageID: PropTypes.any,
    page_id: PropTypes.any,
    page_type: PropTypes.any,
    page_title: PropTypes.any,
    scenario_ID: PropTypes.any,
    version_ID: PropTypes.any,
    next_page_id: PropTypes.any,
    body: PropTypes.any,
    bodies: PropTypes.any,
    xCoord: PropTypes.any,
    yCoord: PropTypes.any,
};

export default function Introduction(props) {
    const {
        scenarioComponents,
        setScenarioComponents,
        setCurrentPageID,
        page_id,
        page_type,
        page_title,
        scenario_ID,
        next_page_id,
        body,
        bodies,
        xCoord,
        yCoord,
    } = props;

    // eslint-disable-next-line
    const [postValues, setPostValues] = useState({
        data: null,
        loading: false,
        error: null,
    });
    // eslint-disable-next-line
    const [deleteValues, setDeleteValues] = useState({
        data: null,
        loading: false,
        error: null,
    });

    const classes = useStyles();
    const [pageID, setPageID] = useState(page_id);
    const [title, setTitle] = useState(page_title);
    const [bodyText, setBodyText] = useState(body);
    // eslint-disable-next-line
    const [bodiesText, setBodiesText] = useState(bodies);
    const [errorTitle, setErrorTitle] = useState(false);
    const [errorTitleText, setErrorTitleText] = useState(false);
    const [errorBody, setErrorBody] = useState(false);

    var postReqBody = {
        PAGE_TYPE: page_type,
        PAGE_TITLE: title,
        PAGE_BODY: bodyText,
        SCENARIO: scenario_ID,
        NEXT_PAGE: next_page_id,
        BODIES: bodiesText,
        X_COORDINATE: xCoord,
        Y_COORDINATE: yCoord,
    };

    function handlePost(setPostValues, postReqBody, s_id, first_time) {
        const endpoint = '/page?page_id=' + pageID;

        function onSuccess(resp) {
            const deleteEndPoint = '/page?page_id=' + pageID;
            let newScenarioComponents = [...scenarioComponents];
            let component = newScenarioComponents.find((x) => x.id === pageID);
            component.id = resp.data.PAGE;
            component.title = title;
            setPageID(resp.data.PAGE);
            setCurrentPageID(resp.data.PAGE);
            setScenarioComponents(newScenarioComponents);
            setSuccessBannerFade(true);
            setSuccessBannerMessage('Successfully saved page!');
            universalDelete(setDeleteValues, deleteEndPoint, null, null, {
                PAGE: pageID,
            });
        }

        function onFailure() {
            setErrorBannerFade(true);
            setErrorBannerMessage('Failed to save page! Please try again.');
        }

        let validInput = true;

        if (!title || !title.trim()) {
            setErrorTitle(true);
            setErrorTitleText('Page title cannot be empty');
            validInput = false;
        } else if (title.trim().length >= 1000) {
            setErrorTitle(true);
            setErrorTitleText('Page title must have less than 1000 characters');
            validInput = false;
        } else {
            setErrorTitle(false);
        }

        if (!bodyText || !bodyText.trim()) {
            setErrorBody(true);
            validInput = false;
        } else {
            setErrorBody(false);
        }

        if (validInput) {
            universalPost(
                setPostValues,
                endpoint,
                onFailure,
                onSuccess,
                postReqBody
            );
        } else {
            setErrorBannerFade(true);
            setErrorBannerMessage(
                'There are currently errors within your page. Please fix all errors in order to save.'
            );
        }
    }

    const savePage = () => {
        handlePost(setPostValues, postReqBody, scenario_ID, false);
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

    if (postValues.loading) {
        return <LoadingSpinner />;
    }

    //TODO information list
    return (
        <Container component="main">
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
            <Typography align="center" variant="h2">
                Introduction Page
            </Typography>
            <Title
                title={title}
                setTitle={setTitle}
                error={errorTitle}
                errorMessage={errorTitleText}
            />
            <Body
                body={bodyText}
                setBody={setBodyText}
                error={errorBody}
                errorMessage={'Page body cannot be empty.'}
            />
            <Button
                className={classes.saveButton}
                variant="contained"
                color="primary"
                onClick={savePage}
            >
                Save
            </Button>
        </Container>
    );
}
