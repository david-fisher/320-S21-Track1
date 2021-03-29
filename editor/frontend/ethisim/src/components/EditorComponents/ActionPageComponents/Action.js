import React, { useState, useEffect } from 'react';
import { Button, TextField, Typography, Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Body from '../GeneralPageComponents/Body';
import Title from '../GeneralPageComponents/Title';
import PropTypes from 'prop-types';
import universalPost from '../../../universalHTTPRequests/post.js';
import universalDelete from '../../../universalHTTPRequests/delete.js';
import SuccessBanner from '../../Banners/SuccessBanner';
import ErrorBanner from '../../Banners/ErrorBanner';
import LoadingSpinner from '../../LoadingSpinner';

Action.propTypes = {
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
    choice1: PropTypes.any,
    choice2: PropTypes.any,
    r1: PropTypes.any,
    r2: PropTypes.any,
};

const useStyles = makeStyles((theme) => ({
    container: {
        marginTop: theme.spacing(2),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    form: {
        marginTop: theme.spacing(1),
        width: '100%',
    },
    submit: {
        marginTop: theme.spacing(2),
        backgroundColor: theme.palette.primary.main,
        color: 'white',
        textTransform: 'unset',
    },
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

export default function Action(props) {
    const classes = useStyles();
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
        choice1,
        choice2,
        xCoord,
        yCoord,
    } = props;

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

    const [pageID, setPageID] = useState(page_id);
    const [title, setTitle] = useState(page_title);
    const [bodyText, setBodyText] = useState(body);
    const [option1, setOption1] = useState(choice1);
    const [option2, setOption2] = useState(choice2);

    const [errorTitle, setErrorTitle] = useState(false);
    const [errorTitleText, setErrorTitleText] = useState(false);
    const [errorBody, setErrorBody] = useState(false);
    const [errorOption1, setErrorOption1] = useState(false);
    const [errorOption1Text, setErrorOption1Text] = useState(false);
    const [errorOption2, setErrorOption2] = useState(false);
    const [errorOption2Text, setErrorOption2Text] = useState(false);

    var postReqBody = {
        PAGE: pageID,
        PAGE_TYPE: page_type,
        PAGE_TITLE: title,
        PAGE_BODY: bodyText,
        SCENARIO: scenario_ID,
        NEXT_PAGE: next_page_id,
        CHOICES: [
            { CHOICE: option1, RESULT_PAGE: null },
            { CHOICE: option2, RESULT_PAGE: null },
        ],
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
        } else if (title.length >= 1000) {
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

        if (!option1 || !option1.trim()) {
            setErrorOption1(true);
            setErrorOption1Text('Option cannot be empty');
            validInput = false;
        } else if (option1.length >= 1000) {
            setErrorOption1(true);
            setErrorOption1Text('Option must have less than 1000 characters');
            validInput = false;
        } else {
            setErrorOption1(false);
        }

        if (!option2 || !option2.trim()) {
            setErrorOption2(true);
            setErrorOption2Text('Option cannot be empty');
            validInput = false;
        } else if (option2.length >= 1000) {
            setErrorOption2(true);
            setErrorOption2Text('Option must have less than 1000 characters');
            validInput = false;
        } else {
            setErrorOption2(false);
        }

        if (option1 && option2 && option1.trim() === option2.trim()) {
            setErrorOption1(true);
            setErrorOption1Text('Option1 cannot be the same as Option2');
            setErrorOption2(true);
            setErrorOption2Text('Option1 cannot be the same as Option2');
            validInput = false;
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

    const onChangeOption1 = (event) => {
        setOption1(event.target.value);
    };

    const onChangeOption2 = (event) => {
        setOption2(event.target.value);
    };

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
                Action Component
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
            <div className={classes.container}>
                <form className={classes.form}>
                    <Typography align="center" variant="h6">
                        Option 1
                    </Typography>
                    {errorOption1 ? (
                        <TextField
                            error
                            helperText={errorOption1Text}
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="option 1"
                            label="Input Option 1 Text"
                            name="option 1"
                            value={option1}
                            onChange={onChangeOption1}
                        />
                    ) : (
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="option 1"
                            label="Input Option 1 Text"
                            name="option 1"
                            value={option1}
                            onChange={onChangeOption1}
                        />
                    )}
                    <Typography align="center" variant="h6">
                        Option 2
                    </Typography>
                    {errorOption2 ? (
                        <TextField
                            error
                            helperText={errorOption2Text}
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="option 2"
                            label="Input Option 2 Text"
                            name="option 2"
                            value={option2}
                            onChange={onChangeOption2}
                        />
                    ) : (
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="option 2"
                            label="Input Option 2 Text"
                            name="option 2"
                            value={option2}
                            onChange={onChangeOption2}
                        />
                    )}
                    <Button
                        className={classes.saveButton}
                        variant="contained"
                        color="primary"
                        onClick={savePage}
                    >
                        Save
                    </Button>
                </form>
            </div>
        </Container>
    );
}
