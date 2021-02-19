import React, { useEffect, useState } from 'react';
import StakeHolder from './stakeHolder';
import Button from '@material-ui/core/Button';
import './stakeHolders.css';
import PropTypes from 'prop-types';
import SuccessBanner from './../../../Banners/SuccessBanner';
import ErrorBanner from './../../../Banners/ErrorBanner';
import LoadingSpinner from './../../../LoadingSpinner';
import { baseURL } from './../../../../Constants/Config';

StakeHolderFields.propTypes = {
    stakeHolders: PropTypes.any,
    setStakeHolders: PropTypes.any,
    scenario: PropTypes.number,
};

export default function StakeHolderFields({ scenario }) {
    const [didGetSHs, setDidGetSHs] = useState(false);

    /*
     * This section is code that is essentially the middleware between the frontend and backend
     * Handles API calls between frontend and backend
     */

    //tracks current state of stakeholders to be represented on the frontend
    const [stakeHolders, setStakeHolders] = useState([]);
    //used to track if we are waiting on a HTTP GET/POST/PUT request
    //not needed for DELETE
    const [isLoading, setLoading] = useState(false);
    var axios = require('axios');

    //for success and error banners
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

    //handles GETting existing stakeholders from the backend and representing
    //    that information in the frontend
    // will eventually know which scenario to get stakeholders from once scenario_id is passed
    // from baseURL + 'stakeholder?scenario_id=' + scenario_id
    function getExistingStakeHolders() {
        setLoading(true);

        var data = { SCENARIO: { scenario } };
        var config = {
            method: 'get',
            url: baseURL + '/api/stakeholders/?SCENARIO=' + scenario,
            headers: {
                'Content-Type': 'application/json',
            },
            data: data,
        };

        axios(config)
            .then(function (response) {
                setStakeHolders(response.data);
            })
            .catch(function (error) {
                setErrorBannerMessage(
                    'Failed to get Stakeholders! Please try again.'
                );
                setErrorBannerFade(true);
            });

        setLoading(false);
    }

    //handles DELETEing a stakeholder from the backend and removing the corresponding
    //    stakeholder from the frontend
    const removeStakeHolder = (stakeHolderID) => {
        if (!checkTime(setCurrentTime, currentTime)) {
            return;
        }
        setLoading(true);

        //handling it on the frontend
        const leftStakeHolders = stakeHolders.filter(
            (s) => s.STAKEHOLDER !== stakeHolderID
        );
        setStakeHolders(leftStakeHolders);

        //calling the DELETE request on the backend
        var data = JSON.stringify({});

        var config = {
            method: 'delete',
            url: baseURL + '/api/stakeholders/' + stakeHolderID + '/',
            headers: {
                'Content-Type': 'application/json',
            },
            data: data,
        };

        axios(config)
            .then(function (response) {
                setSuccessBannerMessage(
                    'Successfully deleted the stakeholder!'
                );
                setSuccessBannerFade(true);
            })
            .catch(function (error) {
                setErrorBannerMessage(
                    'Failed to delete the stakeholder! Please try again.'
                );
                setErrorBannerFade(true);
            });

        setLoading(false);
    };

    //handles POSTing a new stakeholder to the backend and adding that stakeholder to the frontend
    const addStakeHolder = (e) => {
        if (!checkTime(setCurrentTime, currentTime)) {
            return;
        }
        setLoading(true);

        var data = JSON.stringify({
            SCENARIO: scenario,
        });

        var config = {
            method: 'post',
            url: baseURL + '/stakeholder',
            headers: {
                'Content-Type': 'application/json',
            },
            data: data,
        };

        axios(config)
            .then(function (response) {
                setStakeHolders([...stakeHolders, response.data]);
                setSuccessBannerMessage(
                    'Successfully created a new stakeholder!'
                );
                setSuccessBannerFade(true);
            })
            .catch(function (error) {
                setErrorBannerMessage(
                    'Failed to create a stakeholder! Please try again.'
                );
                setErrorBannerFade(true);
            });

        setLoading(false);
    };

    const saveStakeHolders = (e) => {
        var data = [...stakeHolders];

        var config = {
            method: 'put',
            url: baseURL + '/multi_stake?SCENARIO=' + scenario,
            headers: {
                'Content-Type': 'application/json',
            },
            data: data,
        };

        axios(config)
            .then(function (response) {
                setSuccessBannerMessage('Successfully saved the stakeholders!');
                setSuccessBannerFade(true);
            })
            .catch(function (error) {
                setErrorBannerMessage(
                    'Failed to save the stakeholders! Please try again.'
                );
                setErrorBannerFade(true);
            });
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

    /*
     * This code is the frontend rendering; what the users see
     */

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (!didGetSHs) {
        setDidGetSHs(true);
        getExistingStakeHolders();
    }

    return (
        <div className="stakeHolders">
            <Button
                id="button"
                onClick={addStakeHolder}
                variant="contained"
                color="primary"
            >
                Add Stake Holder
            </Button>

            <form id="form">
                {stakeHolders.map((stakeHolder) => (
                    <StakeHolder
                        key={stakeHolder.STAKEHOLDER}
                        removeStakeHolder={removeStakeHolder}
                        id={stakeHolder.STAKEHOLDER}
                        name={stakeHolder.NAME}
                        job={stakeHolder.JOB}
                        bio={stakeHolder.DESCRIPTION}
                        mainConvo={stakeHolder.INTRODUCTION}
                        stakeHolders={stakeHolders}
                        setStakeHolders={setStakeHolders}
                    />
                ))}
            </form>

            <div id="SaveButton">
                <Button
                    variant="contained"
                    color="primary"
                    onClick={saveStakeHolders}
                >
                    Save Stakeholder Changes
                </Button>
            </div>
            <SuccessBanner
                successMessage={successBannerMessage}
                fade={successBannerFade}
            />
            <ErrorBanner
                errorMessage={errorBannerMessage}
                fade={errorBannerFade}
            />
        </div>
    );
}
