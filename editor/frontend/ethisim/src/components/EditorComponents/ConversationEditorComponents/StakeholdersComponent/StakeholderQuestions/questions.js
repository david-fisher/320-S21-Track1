import React, { useState, useContext } from 'react';
import { Button, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import QuestionField from './question';
import deleteReq from '../../../../../universalHTTPRequests/delete';
import put from '../../../../../universalHTTPRequests/put';
import post from '../../../../../universalHTTPRequests/post';
import { ViewQuestionsHelpInfo } from './ViewQuestionsHelpInfo';
import GenericHelpButton from '../../../../HelpButton/GenericHelpButton';
import { getCurrentTimeInt, checkTime } from '../../../../CheckTime';
import ScenarioAccessLevelContext from '../../../../../Context/ScenarioAccessLevelContext';

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
  const accessLevel = useContext(ScenarioAccessLevelContext);

  // eslint-disable-next-line
    const [putValue, setPut] = useState({
    data: null,
    loading: true,
    error: null,
  });
  const handleSave = (e) => {
    const endpointPUT = `/multi_conv?STAKEHOLDER=${stakeholder_id}`;
    const checkIfEmpty = (obj) => !obj.QUESTION
            || !obj.QUESTION.trim()
            || !obj.RESPONSE
            || !obj.RESPONSE.trim();
    if (QRs.some(checkIfEmpty)) {
      setError(true);
      return;
    }
    setError(false);
    function onSuccess() {
      setUnsaved(false);
      setSuccessBannerFade(true);
      setSuccessBannerMessage(
        'Successfully saved stakeholder question and answers!',
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

  /*
    * This section is about managing time to prevent sending a combination of multiple
    *    HTTP GET/POST/PUT/DELETE calls before a response is returned
    */
  const [currentTime, setCurrentTime] = useState(getCurrentTimeInt());

  const addQuestion = (e) => {
    if (!checkTime(currentTime, setCurrentTime)) {
      return;
    }
    const endpointPOST = '/api/conversations/';
    const data = { STAKEHOLDER: stakeholder_id };
    function onSuccess(resp) {
      const newQRs = [...QRs, resp.data];
      setQRs(newQRs);
      setSuccessBannerMessage('Successfully created a conversation!');
      setSuccessBannerFade(true);
    }
    function onFailure() {
      setErrorBannerMessage(
        'Failed to create a conversation! Please try again.',
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
    const endpointDELETE = `/api/conversations/${questionID}/`;
    function onSuccess() {
      const leftQuestions = QRs.filter(
        (q) => q.CONVERSATION !== questionID,
      );
      setQRs(leftQuestions);
      setSuccessBannerMessage('Successfully deleted the conversation!');
      setSuccessBannerFade(true);
    }
    function onFailure() {
      setErrorBannerMessage(
        'Failed to delete the conversation! Please try again.',
      );
      setErrorBannerFade(true);
    }
    deleteReq(setDelete, endpointDELETE, onFailure, onSuccess);
  };

  return (
    <div>
      <GenericHelpButton
        description={ViewQuestionsHelpInfo}
        title="StakeHolder Questions Help"
      />
      <Button
        id="button"
        onClick={addQuestion}
        variant="contained"
        color="primary"
        style={{ textTransform: 'unset' }}
        disabled={accessLevel !== 1}
      >
        Add Question
      </Button>
      <Button
        id="button"
        variant="contained"
        color="primary"
        onClick={handleSave}
        style={{ textTransform: 'unset', marginLeft: '5px' }}
        disabled={accessLevel === 3}
      >
        Save Changes
      </Button>
      {unsaved && accessLevel !== 3 ? (
        <Typography
          variant="h6"
          align="center"
          color="error"
        >
          Unsaved
        </Typography>
      ) : null}
      {error ? (
        <Typography
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
