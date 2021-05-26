import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import RefreshIcon from '@material-ui/icons/Refresh';
import Stakeholder from './stakeholder';
import SuccessBanner from '../../../Banners/SuccessBanner';
import ErrorBanner from '../../../Banners/ErrorBanner';
import LoadingSpinner from '../../../LoadingSpinner';
import get from '../../../../universalHTTPRequests/get';
import deleteReq from '../../../../universalHTTPRequests/delete';
import post from '../../../../universalHTTPRequests/post';
import { ConversationEditorHelpInfo } from '../ConversationEditorHelpInfo';
import GenericHelpButton from '../../../HelpButton/GenericHelpButton';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  headerContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  spacing: {
    margin: theme.spacing(1),
  },
  button: {
    margin: theme.spacing(1),
    textTransform: 'unset',
  },
  iconRefreshSmall: {
    fontSize: '30px',
  },
}));

StakeholderFields.propTypes = {
  stakeholders: PropTypes.any,
  setStakeholders: PropTypes.any,
  scenario: PropTypes.number,
  version: PropTypes.number,
};

const endpointGET = '/api/stakeholders/?SCENARIO=';
const endpointPOST = '/stakeholder';
const endpointDELETE = '/api/stakeholders/';

export default function StakeholderFields({ scenario, version }) {
  const classes = useStyles();
  // TODO when/if versions get implemented
  version = version || 1;
  // tracks current state of stakeholders to be represented on the frontend
  const [fetchedStakeholders, setFetchedStakeholders] = useState({
    data: null,
    loading: true,
    error: null,
  });
  const [postReq, setPostReq] = useState({
    data: null,
    loading: false,
    error: null,
  });
  const [delReq, setDeleteReq] = useState({
    data: null,
    loading: false,
    error: null,
  });

  // eslint-disable-next-line
    const setStakeholders = (arr) => {
    setFetchedStakeholders({
      ...fetchedStakeholders,
      data: arr,
    });
  };
    // used to track if we are waiting on a HTTP GET/POST/PUT request
    // not needed for DELETE

  // handles GETting existing stakeholders from the backend and representing that information in the frontend
  // will eventually know which scenario to get stakeholders from once scenario_id is passed
  // from baseURL + 'stakeholder?scenario_id=' + scenario_id
  function getExistingStakeholders() {
    function onError(resp) {
      setErrorBannerMessage(
        'Failed to get Stakeholders! Please try again.',
      );
      setErrorBannerFade(true);
    }
    get(setFetchedStakeholders, endpointGET + scenario, onError);
  }

  useEffect(getExistingStakeholders, []);

  // handles DELETEing a stakeholder from the backend and removing the corresponding stakeholder from the frontend
  const removeStakeholder = (stakeholderID) => {
    if (!checkTime(setCurrentTime, currentTime)) {
      return;
    }
    // calling the DELETE request on the backend
    function onSuccess(resp) {
      getExistingStakeholders();
      setSuccessBannerMessage('Successfully deleted the stakeholder!');
      setSuccessBannerFade(true);
    }
    function onError(resp) {
      setErrorBannerMessage(
        'Failed to delete the stakeholder! Please try again.',
      );
      setErrorBannerFade(true);
    }

    deleteReq(
      setDeleteReq,
      `${endpointDELETE + stakeholderID}/`,
      onError,
      onSuccess,
    );
  };

  // handles POSTing a new stakeholder to the backend and adding that stakeholder to the frontend
  const addStakeholder = (e) => {
    if (!checkTime(setCurrentTime, currentTime)) {
      return;
    }

    function onSuccess(resp) {
      getExistingStakeholders();
      setSuccessBannerMessage('Successfully created a new stakeholder!');
      setSuccessBannerFade(true);
    }
    function onError(resp) {
      setErrorBannerMessage(
        'Failed to create a stakeholder! Please try again.',
      );
      setErrorBannerFade(true);
    }

    const data = {
      SCENARIO: scenario,
      VERSION: version,
    };
    post(setPostReq, endpointPOST, onError, onSuccess, data);
  };

  // TODO function that saves all stakeholders at once
  /*
    const saveStakeholders = (e) => {
        var data = [...stakeholders];
        for (var i = 0; i < data.length; i++) {
            var form = new FormData();
            var id;
            var item = data[i];
            for (var key in item) {
                if (key === 'STAKEHOLDER') {
                    id = item[key];
                    form.append(key, item[key]);
                } else if (key === 'PHOTO') {
                    if (item[key] instanceof File) {
                        form.append(key, item[key]);
                    }
                } else {
                    form.append(key, item[key]);
                }
            }
            var config = {
                method: 'put',
                url: baseURL + '/api/stakeholders/' + id + '/',
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                data: form,
            };

            axios(config)
                .then(function (response) {
                    setSuccessBannerMessage(
                        'Successfully saved the stakeholders!'
                    );
                    setSuccessBannerFade(true);
                })
                .catch(function (error) {
                    setErrorBannerMessage(
                        'Failed to save the stakeholders! Please try again.'
                    );
                    setErrorBannerFade(true);
                });
        }
    };
    */

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

  // for success and error banners
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

  if (fetchedStakeholders.loading || postReq.loading || delReq.loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className={classes.container}>
      <SuccessBanner
        successMessage={successBannerMessage}
        fade={successBannerFade}
      />
      <ErrorBanner
        errorMessage={errorBannerMessage}
        fade={errorBannerFade}
      />
      <div className={classes.headerContainer}>
        <Button
          variant="contained"
          color="primary"
          onClick={getExistingStakeholders}
        >
          <RefreshIcon className={classes.iconRefreshSmall} />
        </Button>
        <GenericHelpButton
          description={ConversationEditorHelpInfo}
          title="Conversation Editor Help"
        />
      </div>
      <Button
        id="button"
        className={classes.button}
        onClick={addStakeholder}
        variant="contained"
        color="primary"
      >
        Add Stakeholder
      </Button>
      {/*
            <div id="SaveButton">
                <Button
                    variant="contained"
                    color="primary"
                    onClick={saveStakeholders}
                >
                    Save Stakeholder Changes
                </Button>
            </div>
            */}
      <form id="form">
        {fetchedStakeholders.data
          ? fetchedStakeholders.data.map((stakeholder) => (
            <Stakeholder
              key={stakeholder.STAKEHOLDER}
              removeStakeholder={removeStakeholder}
              id={stakeholder.STAKEHOLDER}
              name={stakeholder.NAME}
              job={stakeholder.JOB}
              bio={stakeholder.DESCRIPTION}
              photo={stakeholder.PHOTO}
              mainConvo={stakeholder.INTRODUCTION}
              version={stakeholder.VERSION}
              stakeholders={fetchedStakeholders.data}
              setStakeholders={setStakeholders}
              scenario={scenario}
            />
          ))
          : null}
      </form>
    </div>
  );
}
