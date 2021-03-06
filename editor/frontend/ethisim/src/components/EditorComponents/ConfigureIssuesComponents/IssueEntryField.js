import React, { useState, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { Button, Box, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import GenericDeleteWarning from '../../WarningDialogs/GenericDeleteWarning';
import deleteReq from '../../../universalHTTPRequests/delete';
import post from '../../../universalHTTPRequests/post';
import put from '../../../universalHTTPRequests/put';
import GlobalUnsavedContext from '../../../Context/GlobalUnsavedContext';
import ScenarioAccessLevelContext from '../../../Context/ScenarioAccessLevelContext';

const endpointPOST = '/issue';
// Need issueID
const endpointPUT = '/api/issues/';
// Need issueID
const endpointDELETE = '/api/issues/';

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(0.5),
    marginTop: theme.spacing(0),
    width: '100%',
    textTransform: 'unset',
  },
}));

IssueEntryField.propTypes = {
  id: PropTypes.number.isRequired,
  scenarioID: PropTypes.number,
  issue: PropTypes.string,
  score: PropTypes.number,
  isNewIssue: PropTypes.bool,
  issueEntryFieldList: PropTypes.any.isRequired,
  setIssueEntryFieldList: PropTypes.any.isRequired,
  setSuccessBannerFade: PropTypes.any,
  setSuccessBannerMessage: PropTypes.any,
  setErrorBannerMessage: PropTypes.any,
  setErrorBannerFade: PropTypes.any,
};

export default function IssueEntryField({
  id,
  scenarioID,
  issue,
  score,
  isNewIssue,
  setIssueEntryFieldList,
  issueEntryFieldList,
  setSuccessBannerMessage,
  setSuccessBannerFade,
  setErrorBannerMessage,
  setErrorBannerFade,
}) {
  const classes = useStyles();

  // TODO replace once versionID is implemented with backend
  const versionID = null;

  // eslint-disable-next-line
    const [postValue, setPost] = useState({
    data: null,
    loading: true,
    error: null,
  });
    // eslint-disable-next-line
    const [putValue, setPut] = useState({
    data: null,
    loading: true,
    error: null,
  });
    // eslint-disable-next-line
    const [deleteReqValue, setDeleteReq] = useState({
    data: null,
    loading: true,
    error: null,
  });

  const [issueID, setIssueID] = useState(id);
  const [issueScore, setIssueScore] = useState(score ? score.toString() : '');
  const [issueName, setIssueName] = useState(issue || '');
  const [newIssue, setNewIssue] = useState(isNewIssue);
  const [unsaved, setUnsaved] = useState(isNewIssue);
  // eslint-disable-next-line
  const [globalUnsaved, setGlobalUnsaved] = useContext(GlobalUnsavedContext);
  const accessLevel = useContext(ScenarioAccessLevelContext);

  const handleChangeScore = (content) => {
    let arr = [...issueEntryFieldList.data];
    arr = arr.map((x) => {
      // Compare with original id rather than issueID to avoid issues with changing issueIDs
      // for newly created issues that are saved into the database and get a new ID
      if (x.ISSUE === id) {
        return {
          ...x,
          unsaved: true,
        };
      }
      return x;
    });
    setIssueEntryFieldList({
      ...issueEntryFieldList,
      data: arr,
    });
    setGlobalUnsaved(true);
    setUnsaved(true);
    setIssueScore(content.target.value);
  };

  const handleChangeName = (content) => {
    let arr = [...issueEntryFieldList.data];
    arr = arr.map((x) => {
      // Compare with original id rather than issueID to avoid issues with changing issueIDs
      // for newly created issues that are saved into the database and get a new ID
      if (x.ISSUE === id) {
        return {
          ...x,
          unsaved: true,
        };
      }
      return x;
    });
    setIssueEntryFieldList({
      ...issueEntryFieldList,
      data: arr,
    });
    setGlobalUnsaved(true);
    setUnsaved(true);
    setIssueName(content.target.value);
  };

  const [errorName, setErrorName] = useState(false);
  const [errorNameText, setErrorNameText] = useState('');
  const [errorScore, setErrorScore] = useState(false);
  const [errorScoreText, setErrorScoreText] = useState('');

  const saveIssue = () => {
    let validInput = true;

    // Issue name is null or white space and issue score is null
    if (!issueName || !issueName.trim()) {
      setErrorNameText('Issue score and name is not filled in!');
      setErrorName(true);
      validInput = false;
    } else {
      setErrorName(false);
    }

    score = Number(issueScore);
    // Issue score is null
    if (!issueScore || !issueScore.trim()) {
      // Issue score is null
      setErrorScoreText('Issue score and name is not filled in!');
      setErrorScore(true);
      validInput = false;
    } else if (
      isNaN(issueScore)
            || issueScore.toString().indexOf('.') !== -1
            || score > 5
            || score < 0
    ) {
      // Issue score is not an integer between 0 and 5
      setErrorScoreText(
        'Issue score must be an integer between 0 and 5.',
      );
      setErrorScore(true);
      validInput = false;
    } else {
      setErrorScore(false);
    }

    if (validInput) {
      if (newIssue) {
        function onSuccess(resp) {
          // if newly created issue, replace fake ID with new ID
          if (resp.data) {
            let arr = [...issueEntryFieldList.data];
            arr = arr.map((x) => {
              if (x.ISSUE === id) {
                delete x.unsaved;
              }
              return x;
            });
            setIssueEntryFieldList({
              ...issueEntryFieldList,
              data: arr,
            });
            if (!arr.some((x) => x.unsaved)) {
              setGlobalUnsaved(false);
            }
            setUnsaved(false);
            setIssueID(resp.data.ISSUE);
            setSuccessBannerFade(true);
            setSuccessBannerMessage('Successfully created issue!');
            setNewIssue(false);
          }
        }
        function onFailure() {
          setErrorBannerMessage('Failed to save! Please try again.');
          setErrorBannerFade(true);
        }
        post(setPost, endpointPOST, onFailure, onSuccess, {
          SCENARIO: scenarioID,
          VERSION: versionID,
          IMPORTANCE_SCORE: score,
          NAME: issueName,
        });
      } else {
        function onSuccess() {
          let arr = [...issueEntryFieldList.data];
          arr = arr.map((x) => {
            if (x.ISSUE === id) {
              return {
                ...x,
                unsaved: false,
              };
            }
            return x;
          });
          setIssueEntryFieldList({
            ...issueEntryFieldList,
            data: arr,
          });
          if (!arr.some((x) => x.unsaved)) {
            setGlobalUnsaved(false);
          }
          setUnsaved(false);
          setSuccessBannerFade(true);
          setSuccessBannerMessage('Successfully updated issue!');
        }
        function onFailure() {
          setErrorBannerMessage('Failed to save! Please try again.');
          setErrorBannerFade(true);
        }
        put(setPut, `${endpointPUT + issueID}/`, onFailure, onSuccess, {
          SCENARIO: scenarioID,
          VERSION: versionID,
          IMPORTANCE_SCORE: score,
          NAME: issueName,
          ISSUE: id,
        });
      }
    }
  };

  const deleteIssue = () => {
    // remove issue from array, id represents the id in issueEntryFieldList
    // If issue is a new issue, A POST request will replace the fake ID with the ID in database
    // ID in the array will remain the fake id, so that is why we compare with 'id' rather than 'issueID'
    if (newIssue) {
      const newData = issueEntryFieldList.data.filter(
        (entry) => entry.ISSUE !== id,
      );
      setIssueEntryFieldList({ ...issueEntryFieldList, data: newData });
    } else {
      function successfullySaved() {
        setUnsaved(false);
        setSuccessBannerFade(true);
        setSuccessBannerMessage('Successfully deleted issue!');
        const newData = issueEntryFieldList.data.filter(
          (entry) => entry.ISSUE !== id,
        );
        setIssueEntryFieldList({
          ...issueEntryFieldList,
          data: newData,
        });
      }
      function onFailure() {
        setErrorBannerMessage('Failed to save! Please try again.');
        setErrorBannerFade(true);
      }

      deleteReq(
        setDeleteReq,
        `${endpointDELETE + issueID}/`,
        onFailure,
        successfullySaved,
        {
          SCENARIO: scenarioID,
          ISSUE: issueID,
        },
      );
    }
  };

  // Used for Delete Warning
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  return (
    <div>
      {unsaved && accessLevel !== 3 ? (
        <Typography
          style={{ marginLeft: '20px' }}
          variant="h6"
          align="center"
          color="error"
        >
          Unsaved
        </Typography>
      ) : null}
      <Box display="flex" flexDirection="row">
        <Box p={1}>
          {errorName ? (
            <TextField
              error
              helperText={errorNameText}
              style={{ width: '63%' }}
              id="outlined-text"
              label="Issue"
              value={issueName}
              onChange={handleChangeName}
              multiline
              rows={2}
              variant="outlined"
            />
          ) : (
            <TextField
              style={{ width: '63%' }}
              id="outlined-text"
              label="Issue"
              value={issueName}
              onChange={handleChangeName}
              multiline
              rows={2}
              variant="outlined"
            />
          )}
          {errorScore ? (
            <TextField
              error
              helperText={errorScoreText}
              style={{ width: '37%' }}
              margin="normal"
              id="outlined-number"
              label="Importance Factor"
              placeholder="0-5"
              onChange={handleChangeScore}
              value={issueScore}
              rows={1}
              variant="filled"
            />
          ) : (
            <TextField
              style={{ width: '37%' }}
              margin="normal"
              id="outlined-number"
              label="Importance Factor"
              placeholder="0-5"
              onChange={handleChangeScore}
              value={issueScore}
              rows={1}
              variant="filled"
            />
          )}
        </Box>
        <Box>
          <div>
            <Button
              className={classes.button}
              variant="contained"
              color="primary"
              onClick={() => saveIssue()}
              disabled={accessLevel === 3}
            >
              Save
            </Button>
          </div>
          <Button
            className={classes.button}
            variant="contained"
            color="primary"
            onClick={handleClickOpen}
            disabled={accessLevel !== 1}
          >
            Delete
          </Button>
          <GenericDeleteWarning
            remove={() => deleteIssue()}
            open={open}
            setOpen={setOpen}
          />
        </Box>
      </Box>
    </div>
  );
}
