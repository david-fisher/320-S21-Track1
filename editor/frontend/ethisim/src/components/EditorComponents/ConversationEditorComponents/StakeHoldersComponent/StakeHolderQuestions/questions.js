import React, { useState } from 'react';
import QuestionField from './question';
import { Button, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import deleteReq from '../../../../../universalHTTPRequests/delete';
import put from '../../../../../universalHTTPRequests/put';
import post from '../../../../../universalHTTPRequests/post';

QuestionFields.propTypes = {
    qrs: PropTypes.any,
    stakeholder_id: PropTypes.number,
    setSuccessBannerFade: PropTypes.any,
    setSuccessBannerMessage: PropTypes.any,
    setErrorBannerFade: PropTypes.any,
    setErrorBannerMessage: PropTypes.any,
    setUnsaved: PropTypes.any,
    unsaved: PropTypes.any,
};

export default function QuestionFields({
    setSuccessBannerFade,
    setSuccessBannerMessage,
    setErrorBannerFade,
    setErrorBannerMessage,
    setUnsaved,
    unsaved,
    qrs,
    stakeholder_id,
}) {
    const [error, setError] = useState(false);
    const [QRs, setQRs] = useState(qrs);

    // eslint-disable-next-line
    const [putValue, setPut] = useState({
        data: null,
        loading: true,
        error: null,
    });
    const handleSave = (e) => {
        const endpointPUT = '/multi_conv?STAKEHOLDER=' + stakeholder_id;
        const checkIfEmpty = (obj) =>
            !obj.QUESTION ||
            !obj.QUESTION.trim() ||
            !obj.RESPONSE ||
            !obj.RESPONSE.trim();
        if (QRs.some(checkIfEmpty)) {
            setError(true);
            return;
        }
        setError(false);
        function onSuccess() {
            setUnsaved(false);
            setSuccessBannerFade(true);
            setSuccessBannerMessage(
                'Successfully saved stakeholder question and answers!'
            );
        }
        function onFailure() {
            setErrorBannerMessage('Failed to save! Please try again.');
            setErrorBannerFade(true);
        }
        put(setPut, endpointPUT, onFailure, onSuccess, QRs);
    };

    // eslint-disable-next-line
    const [postValue, setPost] = useState({
        data: null,
        loading: true,
        error: null,
    });
    const addQuestion = (e) => {
        if (!checkTime(setCurrentTime, currentTime)) {
            return;
        }
        const endpointPOST = '/api/conversations/';
        var data = { STAKEHOLDER: stakeholder_id };
        function onSuccess(resp) {
            console.log(resp);
            const newQRs = [...QRs, resp.data];
            setQRs(newQRs);
            setSuccessBannerMessage('Successfully created a conversation!');
            setSuccessBannerFade(true);
        }
        function onFailure() {
            setErrorBannerMessage(
                'Failed to create a conversation! Please try again.'
            );
            setErrorBannerFade(true);
        }
        post(setPost, endpointPOST, onFailure, onSuccess, data);
    };

    // eslint-disable-next-line
    const [deleteValue, setDelete] = useState({
        data: null,
        loading: true,
        error: null,
    });
    const removeQuestion = (questionID) => {
        if (!checkTime(setCurrentTime, currentTime)) {
            return;
        }
        const endpointDELETE = '/api/conversations/' + questionID + '/';
        function onSuccess() {
            const leftQuestions = QRs.filter(
                (q) => q.CONVERSATION !== questionID
            );
            setQRs(leftQuestions);
            setSuccessBannerMessage('Successfully deleted the conversation!');
            setSuccessBannerFade(true);
        }
        function onFailure() {
            setErrorBannerMessage(
                'Failed to delete the conversation! Please try again.'
            );
            setErrorBannerFade(true);
        }
        deleteReq(setDelete, endpointDELETE, onFailure, onSuccess);
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

    return (
        <div>
            <Button
                id="button"
                onClick={addQuestion}
                variant="contained"
                color="primary"
                style={{ textTransform: 'unset' }}
            >
                Add Questions
            </Button>
            <Button
                id="button"
                variant="contained"
                color="primary"
                onClick={handleSave}
                style={{ textTransform: 'unset', marginLeft: '5px' }}
            >
                Save Changes
            </Button>
            {unsaved ? (
                <Typography
                    style={{ marginLeft: '30px' }}
                    variant="h6"
                    align="center"
                    color="error"
                >
                    Unsaved
                </Typography>
            ) : null}
            {error ? (
                <Typography
                    style={{ marginLeft: '5px' }}
                    variant="h6"
                    align="center"
                    color="error"
                >
                    One or more text fields are empty!
                </Typography>
            ) : null}
            <form id="form">
                {QRs.map((data) => (
                    <QuestionField
                        setUnsaved={setUnsaved}
                        setError={setError}
                        key={data.CONVERSATION}
                        id={data.CONVERSATION}
                        removeQuestion={removeQuestion}
                        question={data.QUESTION}
                        response={data.RESPONSE}
                        QRs={QRs}
                        setQRs={setQRs}
                    />
                ))}
            </form>
        </div>
    );
}
