import React, { useState, useEffect, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Container, Button } from '@material-ui/core';
import PropTypes from 'prop-types';
import EntryField from './IssueEntryField';
import SuccessBanner from '../../Banners/SuccessBanner';
import ErrorBanner from '../../Banners/ErrorBanner';
import GlobalUnsavedContext from '../../../Context/GlobalUnsavedContext';
import ScenarioAccessLevelContext from '../../../Context/ScenarioAccessLevelContext';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
  },
  button: {
    margin: theme.spacing(1),
    marginTop: theme.spacing(1),
    textTransform: 'unset',
  },
}));

IssueEntryFieldList.propTypes = {
  issueEntryFieldList: PropTypes.any.isRequired,
  setIssueEntryFieldList: PropTypes.any.isRequired,
  scenarioID: PropTypes.number,
};

export default function IssueEntryFieldList({
  issueEntryFieldList,
  setIssueEntryFieldList,
  scenarioID,
}) {
  const classes = useStyles();
  // eslint-disable-next-line
  const [globalUnsaved, setGlobalUnsaved] = useContext(GlobalUnsavedContext);
  const accessLevel = useContext(ScenarioAccessLevelContext);

  // When we select new issue button, we add new issue object into array.
  // We set a temporary unique ID.
  function setNewIssueID() {
    let newID = Math.floor(Math.random() * 10000000);
    let collision = issueEntryFieldList.data.filter((data) => data.ISSUE === newID)
      .length !== 0;
    while (collision) {
      newID = Math.floor(Math.random() * 10000000);
      const checkNewID = newID;
      collision = issueEntryFieldList.data.filter(
        (data) => data.ISSUE === checkNewID,
      ).length !== 0;
    }
    return newID;
  }

  const [entryCur, setEntryCur] = useState({
    ISSUE: setNewIssueID(),
    isNewIssue: true,
    unsaved: true,
  });

  const addIssue = (e) => {
    e.preventDefault();
    const newEntry = entryCur;
    issueEntryFieldList.data = issueEntryFieldList.data.concat(newEntry);
    setIssueEntryFieldList(issueEntryFieldList);
    setGlobalUnsaved(true);
    setEntryCur({
      ISSUE: setNewIssueID(),
      isNewIssue: true,
      unsaved: true,
    });
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

  return (
    <Container component="main" className={classes.container}>
      <SuccessBanner
        successMessage={successBannerMessage}
        fade={successBannerFade}
      />
      <ErrorBanner
        errorMessage={errorBannerMessage}
        fade={errorBannerFade}
      />
      <Button
        className={classes.button}
        id="button"
        onClick={addIssue}
        variant="contained"
        color="primary"
        disabled={accessLevel !== 1}
      >
        Create Issue
      </Button>

      <form id="form">
        {issueEntryFieldList.data.map((entry) => (
          <EntryField
            key={entry.ISSUE}
            id={entry.ISSUE}
            scenarioID={scenarioID}
            isNewIssue={entry.isNewIssue}
            issue={entry.NAME}
            score={entry.IMPORTANCE_SCORE}
            setIssueEntryFieldList={setIssueEntryFieldList}
            issueEntryFieldList={issueEntryFieldList}
            entry={entry}
            setSuccessBannerFade={setSuccessBannerFade}
            setSuccessBannerMessage={setSuccessBannerMessage}
            setErrorBannerFade={setErrorBannerFade}
            setErrorBannerMessage={setErrorBannerMessage}
          />
        ))}
      </form>
    </Container>
  );
}
