import React, { useState, useEffect } from 'react';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import './table.css';
import PropTypes from 'prop-types';
import SuccessBanner from './../../../Banners/SuccessBanner';
import ErrorBanner from './../../../Banners/ErrorBanner';
import IssueRow from './IssueRow';
import LoadingSpinner from './../../../LoadingSpinner';
import { baseURL } from './../../../../Constants/Config';

const useStyles = makeStyles({
    table: {
        minWidth: 300,
    },
});

BasicTable.propTypes = {
    stakeholder_id: PropTypes.number,
    passed_issues: PropTypes.any,
};

export default function BasicTable({ stakeholder_id, passed_issues }) {
    //used to track if we are waiting on a HTTP GET/POST/PUT request
    //not needed for DELETE
    const [isLoading, setLoading] = useState(false);

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

    const [issues, setIssues] = useState(passed_issues);

    const classes = useStyles();

    const handleSave = (e) => {
        if (!checkTime(setCurrentTime, currentTime)) {
            return;
        }
        setLoading(true);

        var axios = require('axios');

        var data = [...issues];
        data = data.map((i) => {
            delete i.NAME;
            return i;
        });

        var config = {
            method: 'put',
            url: baseURL + '/multi_coverage?STAKEHOLDER=' + stakeholder_id,
            headers: {
                'Content-Type': 'application/json',
            },
            data: data,
        };

        axios(config)
            .then(function (response) {
                setSuccessBannerMessage(
                    'Successfully saved the issues for this stakeholder!'
                );
                setSuccessBannerFade(true);
            })
            .catch(function (error) {
                setErrorBannerMessage(
                    'Failed to save the issues for this stakeholder! Please try again.'
                );
                setErrorBannerFade(true);
            });

        setLoading(false);
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

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <div>
            <Button
                id="button-save"
                variant="contained"
                color="primary"
                onClick={handleSave}
            >
                Save Changes
            </Button>
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Issue</TableCell>
                            <TableCell>Score</TableCell>
                            <TableCell align="right"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {issues.map((i) => (
                            <TableRow key={i.ISSUE}>
                                <IssueRow
                                    name={i.NAME}
                                    score={i.COVERAGE_SCORE}
                                    issue_number={i.ISSUE}
                                    issues={issues}
                                    setIssues={setIssues}
                                />
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
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
