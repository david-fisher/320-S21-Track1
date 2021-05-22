import React, { useState } from 'react';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import PropTypes from 'prop-types';
import IssueRow from './IssueRow';
import put from '../../../../universalHTTPRequests/put';
import { PointSelectionHelpInfo } from './PointSelectionHelpInfo';
import GenericHelpButton from '../../../HelpButton/GenericHelpButton';

const useStyles = makeStyles({
  table: {
    minWidth: 300,
  },
});

BasicTable.propTypes = {
  stakeholder_id: PropTypes.number,
  passed_issues: PropTypes.any,
  setSuccessBannerFade: PropTypes.any,
  setSuccessBannerMessage: PropTypes.any,
  setErrorBannerFade: PropTypes.any,
  setErrorBannerMessage: PropTypes.any,
  setUnsaved: PropTypes.any,
  unsaved: PropTypes.any,
};

export default function BasicTable({
  setSuccessBannerFade,
  setSuccessBannerMessage,
  setErrorBannerFade,
  setErrorBannerMessage,
  setUnsaved,
  unsaved,
  stakeholder_id,
  passed_issues,
}) {
  // used to track if we are waiting on a HTTP GET/POST/PUT request
  // not needed for DELETE
  const [issues, setIssues] = useState(passed_issues);

  const classes = useStyles();

  const [error, setError] = useState(false);
  // eslint-disable-next-line
    const [putValue, setPut] = useState({
    data: null,
    loading: true,
    error: null,
  });
  const handleSave = (e) => {
    if (!checkTime(setCurrentTime, currentTime)) {
      return;
    }
    let data = [...issues];
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

  /*
     * This section is about managing time to prevent sending a combination of multiple
     *    HTTP GET/POST/PUT/DELETE calls before a response is returned
     */
  const [currentTime, setCurrentTime] = useState(getCurrentTimeInt());
  // gets the current time in hms and converts it to an int
  function getCurrentTimeInt() {
    const d = Date();
    const h = d.substring(16, 18);
    const m = d.substring(19, 21);
    const s = d.substring(22, 24);
    return 60 * (60 * h + m) + s;
  }

  // checks if at least 1 second has elapsed since last action
  // if someone waits a multiple of exactly 24 hours since their last action they will
  //    not be able to take an action for an additional second
  function checkTime(setTime, t) {
    let ret = false;
    // current time difference is at least 1 second, but that SHOULD be ample time for
    // the database to get back to the frontend
    if (getCurrentTimeInt() - t !== 0) {
      ret = true;
    }
    setTime(getCurrentTimeInt());
    return ret;
  }

  return (
    <div>
      <GenericHelpButton
        description={PointSelectionHelpInfo}
        title="Point Selection Help"
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
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell style={{ width: '50%' }}>
                Issue
              </TableCell>
              <TableCell align="left">Score</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {issues.map((i) => (
              <TableRow key={i.ISSUE}>
                <TableCell component="th" scope="row">
                  <Typography variant="h6">
                    {i.NAME}
                  </Typography>
                </TableCell>
                <IssueRow
                  name={i.NAME}
                  score={i.COVERAGE_SCORE}
                  setUnsaved={setUnsaved}
                  issue_number={i.ISSUE}
                  issues={issues}
                  setIssues={setIssues}
                />
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
