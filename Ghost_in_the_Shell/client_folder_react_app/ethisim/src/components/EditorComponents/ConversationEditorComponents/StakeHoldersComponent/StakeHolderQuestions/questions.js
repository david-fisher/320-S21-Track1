import React, { useState, useEffect } from 'react';
import QuestionField from './question';
import Button from '@material-ui/core/Button';
import './questions.css';
import PropTypes from 'prop-types';
import SuccessBanner from './../../../../Banners/SuccessBanner';
import ErrorBanner from './../../../../Banners/ErrorBanner';
import LoadingSpinner from './../../../../LoadingSpinner';
import { baseURL } from './../../../../../Constants/Config';

QuestionFields.propTypes = {
    qrs: PropTypes.any,
    stakeholder_id: PropTypes.number,
};

export default function QuestionFields({ qrs, stakeholder_id }) {
    //used to track if we are waiting on a HTTP GET/POST/PUT request
    //not needed for DELETE
    const [isLoading, setLoading] = useState(false);
    var axios = require('axios');

    //for success and error banners
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

    const [QRs, setQRs] = useState(qrs);

    const handleSave = (e) => {
        var axios = require('axios');
        var data = QRs;

        var config = {
            method: 'put',
            url: baseURL + '/multi_conv?STAKEHOLDER=' + stakeholder_id,
            headers: {
                'Content-Type': 'application/json',
            },
            data: data,
        };

        axios(config)
            .then(function (response) {
                setSuccessBannerMessage(
                    'Successfully saved the conversations for this stakeholder!'
                );
                setSuccessBannerFade(true);
            })
            .catch(function (error) {
                setErrorBannerMessage(
                    'Failed to save the conversations for this stakeholder! Please try again.'
                );
                setErrorBannerFade(true);
            });
    };

    const addQuestion = (e) => {
        if (!checkTime(setCurrentTime, currentTime)) {
            return;
        }
        setLoading(true);

        var data = JSON.stringify({ STAKEHOLDER: stakeholder_id });

        var config = {
            method: 'post',
            url: baseURL + '/api/conversations/',
            headers: {
                'Content-Type': 'application/json',
            },
            data: data,
        };

        axios(config)
            .then(function (response) {
                const newQRs = [...QRs, response.data];
                setQRs(newQRs);
                setSuccessBannerMessage('Successfully created a conversation!');
                setSuccessBannerFade(true);
            })
            .catch(function (error) {
                setErrorBannerMessage(
                    'Failed to create a conversation! Please try again.'
                );
                setErrorBannerFade(true);
            });

        setLoading(false);
    };

    const removeQuestion = (questionID) => {
        if (!checkTime(setCurrentTime, currentTime)) {
            return;
        }
        setLoading(true);

        const leftQuestions = QRs.filter((q) => q.CONVERSATION !== questionID);
        setQRs(leftQuestions);

        var data = JSON.stringify({});

        var config = {
            method: 'delete',
            url: baseURL + '/api/conversations/' + questionID + '/',
            headers: {
                'Content-Type': 'application/json',
            },
            data: data,
        };

        axios(config)
            .then(function (response) {
                setSuccessBannerMessage(
                    'Successfully deleted the conversation!'
                );
                setSuccessBannerFade(true);
            })
            .catch(function (error) {
                setErrorBannerMessage(
                    'Failed to delete the conversation! Please try again.'
                );
                setErrorBannerFade(true);
            });

        setLoading(false);
    };

    /*
     * This section is about managing time to prevent sending a combination of multiple
     *    HTTP GET/POST/PUT/DELETE calls before a response is returned
     */
    const [currentTime, setCurrentTime] = useState(getCurrentTimeInt());
    //gets the current time in hms and converts it to an int
    function getCurrentTimeInt() {
        let d = Date();
        var h = d.substring(16, 18);
        var m = d.substring(19, 21);
        var s = d.substring(22, 24);
        return 60 * (60 * h + m) + s;
    }

    //checks if at least 1 second has elapsed since last action
    //if someone waits a multiple of exactly 24 hours since their last action they will
    //    not be able to take an action for an additional second
    function checkTime(setTime, t) {
        var ret = false;
        //current time difference is at least 1 second, but that SHOULD be ample time for
        //the database to get back to the frontend
        if (getCurrentTimeInt() - t !== 0) {
            ret = true;
        }
        setTime(getCurrentTimeInt());
        return ret;
    }

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="questions">
            <Button
                id="button"
                onClick={addQuestion}
                variant="contained"
                color="primary"
            >
                Add Question
            </Button>
            <Button
                id="button"
                variant="contained"
                color="primary"
                onClick={handleSave}
            >
                Save Changes
            </Button>
            <form id="form">
                {QRs.map((data) => (
                    <QuestionField
                        key={data.STAKEHOLDER}
                        id={data.CONVERSATION}
                        removeQuestion={removeQuestion}
                        question={data.QUESTION}
                        response={data.RESPONSE}
                        QRs={QRs}
                        setQRs={setQRs}
                    />
                ))}
            </form>
            <SuccessBanner
                successMessage={successBannerMessage}
                fade={successBannerFade}
            />
            <ErrorBanner
                errorMessage={errorBannerMessage}
                fade={errorBannerFade}
            />
        </div>
    );
}
