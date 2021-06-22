import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';

// eslint-disable-next-line
const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(0.5),
    marginTop: theme.spacing(0),
    width: 50,
  },
}));

IssueScore.propTypes = {
  score: PropTypes.any,
  issue_number: PropTypes.number,
  stakeholderCoverage: PropTypes.any,
  setStakeholderCoverage: PropTypes.any,
  setUnsaved: PropTypes.any,
};

export default function IssueScore({
  score,
  issue_number,
  stakeholderCoverage,
  setStakeholderCoverage,
  setUnsaved,
}) {
  const [issueScore, setIssueScore] = useState(score);

  function updateIssueScore(val) {
    const coverage = [...stakeholderCoverage];
    setStakeholderCoverage(
      coverage.map((i) => {
        if (i.ISSUE === issue_number) {
          i.COVERAGE_SCORE = val;
        }
        return i;
      }),
    );
  }

  const onChangeScore = (e) => {
    setUnsaved(true);
    setIssueScore(e.target.value);
    updateIssueScore(e.target.value);
  };

  return (
    <TextField
      defaultValue={issueScore}
      variant="filled"
      onChange={onChangeScore}
      placeholder="Coverage Score from 0-3"
      style={{ width: '100%' }}
    />
  );
}
