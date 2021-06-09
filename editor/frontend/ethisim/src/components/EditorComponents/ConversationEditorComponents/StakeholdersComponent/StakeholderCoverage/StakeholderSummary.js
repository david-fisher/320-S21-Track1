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

StakeholderSummary.propTypes = {
  summary: PropTypes.any,
  issue_number: PropTypes.number,
  stakeholderCoverage: PropTypes.any,
  setStakeholderCoverage: PropTypes.any,
  setUnsaved: PropTypes.any,
};

export default function StakeholderSummary({
  summary,
  issue_number,
  stakeholderCoverage,
  setStakeholderCoverage,
  setUnsaved,
}) {
  const [stakeholderSummary, setStakeholderSummary] = useState(summary);

  function updateStakeholderSummary(val) {
    const coverage = [...stakeholderCoverage];
    setStakeholderCoverage(
      coverage.map((i) => {
        if (i.ISSUE === issue_number) {
          i.SUMMARY = val;
        }
        return i;
      }),
    );
  }

  const onChangeSummary = (e) => {
    setUnsaved(true);
    setStakeholderSummary(e.target.value);
    updateStakeholderSummary(e.target.value);
  };

  return (
    <TextField
      defaultValue={stakeholderSummary}
      variant="filled"
      onChange={onChangeSummary}
      multiline
      placeholder="Stakeholder Summary for Issue"
      style={{ width: '100%' }}
    />
  );
}
