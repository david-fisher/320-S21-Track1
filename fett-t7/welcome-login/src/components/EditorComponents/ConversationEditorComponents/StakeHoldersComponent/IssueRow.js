import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

// eslint-disable-next-line
const useStyles = makeStyles((theme) => ({
    margin: {
        margin: theme.spacing(0.5),
        marginTop: theme.spacing(0),
        width: 50,
    },
}));

IssueRow.propTypes = {
    name: PropTypes.string,
    score: PropTypes.number,
    issue_number: PropTypes.number,
    scenario: PropTypes.number,
    issues: PropTypes.any,
    setIssues: PropTypes.any,
};

export default function IssueRow({
    name,
    score,
    issue_number,
    issues,
    setIssues,
}) {
    const [issueScore, setIssueScore] = useState(score);

    function updateIssueScore(val) {
        const updatedIssues = [...issues];
        setIssues(
            updatedIssues.map((i) => {
                if (i.ISSUE === issue_number) {
                    i.COVERAGE_SCORE = val;
                }
                return i;
            })
        );
    }

    const onChangeScore = (e) => {
        setIssueScore(e.target.value);
        updateIssueScore(e.target.value);
    };

    return (
        <div>
            <TableRow key={issue_number}>
                <TableCell component="th" scope="row">
                    <TextField
                        id="filled"
                        defaultValue={name}
                        variant="filled"
                    />
                </TableCell>

                <TableCell>
                    <TextField
                        id="filled"
                        defaultValue={issueScore}
                        variant="filled"
                        onChange={onChangeScore}
                    />
                </TableCell>
            </TableRow>
        </div>
    );
}
