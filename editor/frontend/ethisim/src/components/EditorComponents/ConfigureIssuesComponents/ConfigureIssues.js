import React, { useState, useEffect } from 'react';
import { Typography, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import RefreshIcon from '@material-ui/icons/Refresh';
import ErrorIcon from '@material-ui/icons/Error';
import PropTypes from 'prop-types';
import EntryFields from './IssueEntryFieldList';
import get from '../../../universalHTTPRequests/get';
import LoadingSpinner from '../../LoadingSpinner';
import { ConfigureIssuesHelpInfo } from './ConfigureIssuesHelpInfo';
import GenericHelpButton from '../../HelpButton/GenericHelpButton';

// Need scenarioID
const endpointGET = '/api/issues/?SCENARIO=';

const useStyles = makeStyles((theme) => ({
  issue: {
    marginTop: '-15px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  saveButton: {
    margin: theme.spacing(2),
    float: 'right',
    textTransform: 'unset',
  },
  container: {
    padding: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconError: {
    paddingRight: theme.spacing(2),
    fontSize: '75px',
  },
  iconRefreshLarge: {
    fontSize: '75px',
  },
  iconRefreshSmall: {
    fontSize: '30px',
  },
}));

ConfigureIssues.propTypes = {
  scenario_ID: PropTypes.number,
};

export default function ConfigureIssues({ scenario_ID }) {
  const classes = useStyles();
  const [issueEntryFieldList, setIssueEntryFieldList] = useState({
    data: null,
    loading: true,
    error: null,
  });

  const getData = () => {
    get(setIssueEntryFieldList, endpointGET + scenario_ID);
  };

  useEffect(getData, []);

  if (issueEntryFieldList.loading) {
    return <LoadingSpinner />;
  }

  if (issueEntryFieldList.error) {
    return (
      <div className={classes.issue}>
        <div className={classes.container}>
          <ErrorIcon className={classes.iconError} />
          <Typography align="center" variant="h3">
            Error in fetching issues.
          </Typography>
        </div>
        <Button variant="contained" color="primary" onClick={getData}>
          <RefreshIcon className={classes.iconRefreshLarge} />
        </Button>
      </div>
    );
  }

  return (
    <div className={classes.issue}>
      <Typography align="center" variant="h2">
        Configure Ethical Issues
      </Typography>
      <div className={classes.container}>
        <Button variant="contained" color="primary" onClick={getData}>
          <RefreshIcon className={classes.iconRefreshSmall} />
        </Button>
        <GenericHelpButton
          description={ConfigureIssuesHelpInfo}
          title="Configure Issues Help"
        />
      </div>
      <EntryFields
        issueEntryFieldList={
                    issueEntryFieldList !== null ? issueEntryFieldList : []
                }
        setIssueEntryFieldList={setIssueEntryFieldList}
        scenarioID={scenario_ID}
      />
    </div>
  );
}
