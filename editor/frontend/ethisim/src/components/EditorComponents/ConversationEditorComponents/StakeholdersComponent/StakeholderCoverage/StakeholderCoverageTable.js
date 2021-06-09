import React, { useState } from 'react';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import IssueScore from './IssueScore';
import put from '../../../../../universalHTTPRequests/put';
import { PointSelectionHelpInfo } from './PointSelectionHelpInfo';
import GenericHelpButton from '../../../../HelpButton/GenericHelpButton';
import StakeholderSummary from './StakeholderSummary';
import ConvoPreview from './ConvoPreview';

const useStyles = makeStyles({
  table: {
    minWidth: 300,
  },
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

StakeholderCoverageTable.propTypes = {
  stakeholder_id: PropTypes.number,
  coverage: PropTypes.any,
  setSuccessBannerFade: PropTypes.any,
  setSuccessBannerMessage: PropTypes.any,
  setErrorBannerFade: PropTypes.any,
  setErrorBannerMessage: PropTypes.any,
  setUnsaved: PropTypes.any,
  unsaved: PropTypes.any,
  name: PropTypes.string.isRequired,
  job: PropTypes.string,
  bio: PropTypes.string,
  mainConvo: PropTypes.string,
  photo: PropTypes.string,
};

export default function StakeholderCoverageTable({
  setSuccessBannerFade,
  setSuccessBannerMessage,
  setErrorBannerFade,
  setErrorBannerMessage,
  setUnsaved,
  unsaved,
  stakeholder_id,
  coverage,
  name,
  job,
  bio,
  mainConvo,
  photo,
}) {
  // used to track if we are waiting on a HTTP GET/POST/PUT request
  // not needed for DELETE
  const [stakeholderCoverage, setStakeholderCoverage] = useState(coverage);
  const classes = useStyles();

  const [error, setError] = useState(false);
  // eslint-disable-next-line
    const [putValue, setPut] = useState({
    data: null,
    loading: true,
    error: null,
  });
  const handleSave = (e) => {
    let data = [...stakeholderCoverage];
    const checkInvalidScore = (obj) => {
      const issueScore = obj.COVERAGE_SCORE.toString()
        ? Number(obj.COVERAGE_SCORE)
        : null;
      return (
        !obj.COVERAGE_SCORE.toString()
                || isNaN(issueScore)
                || issueScore.toString().indexOf('.') !== -1
                || issueScore > 5
                || issueScore < 0
      );
    };

    if (data.some(checkInvalidScore)) {
      setError(true);
      return;
    }
    data = data.map((i) => i);

    const endpointPUT = `/multi_coverage?STAKEHOLDER=${stakeholder_id}`;
    function onSuccess() {
      setUnsaved(false);
      setSuccessBannerMessage(
        'Successfully saved the issues for this stakeholder!',
      );
      setSuccessBannerFade(true);
    }
    function onFailure() {
      setErrorBannerMessage(
        'Failed to save the issues for this stakeholder! Please try again.',
      );
      setErrorBannerFade(true);
    }
    put(setPut, endpointPUT, onFailure, onSuccess, data);
  };

  return (
    <div>
      <GenericHelpButton
        description={PointSelectionHelpInfo}
        title="Point Selection Help"
      />
      <ConvoPreview
        id={stakeholder_id}
        name={name}
        job={job}
        bio={bio}
        mainConvo={mainConvo}
        photo={photo}
      />
      <Button
        id="button-save"
        variant="contained"
        color="primary"
        onClick={handleSave}
        style={{ textTransform: 'unset' }}
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
          Scores must be an integer between 0 and 5.
        </Typography>
      ) : null}
      {stakeholderCoverage.map((i) => (
        <div key={i.ISSUE} style={{ marginBottom: '10px' }}>
          <div className={classes.container}>
            <Typography variant="h6" style={{ width: '100%' }}>
              {i.NAME}
            </Typography>
            <IssueScore
              name={i.NAME}
              score={i.COVERAGE_SCORE}
              setUnsaved={setUnsaved}
              issue_number={i.ISSUE}
              stakeholderCoverage={stakeholderCoverage}
              setStakeholderCoverage={setStakeholderCoverage}
            />
          </div>
          <StakeholderSummary
            summary={i.SUMMARY}
            setUnsaved={setUnsaved}
            issue_number={i.ISSUE}
            stakeholderCoverage={stakeholderCoverage}
            setStakeholderCoverage={setStakeholderCoverage}
          />
        </div>
      ))}
    </div>
  );
}
