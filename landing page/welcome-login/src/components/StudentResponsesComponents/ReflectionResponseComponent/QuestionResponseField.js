import React from 'react';
import TextField from '@material-ui/core/TextField';
import { Typography } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import PropTypes from 'prop-types';

QuestionField.propTypes = {
    question: PropTypes.string,
    response: PropTypes.string,
    id: PropTypes.number,
    removeQuestion: PropTypes.any,
    listOfQuestions: PropTypes.any,
    setListOfQuestions: PropTypes.any,
};

export default function QuestionField({ question, response }) {
    return (
        <div>
            <Box
                display="flex"
                flexDirection="row"
                p={1}
                m={1}
                bgcolor="background.paper"
                style={{ width: '100%' }}
            >
                <Box p={1} style={{ width: '100%' }}>
                    <Typography align="center" variant="h6">
                        {question}
                    </Typography>
                    <TextField
                        style={{ width: '100%' }}
                        id="outlined-multiline-static"
                        multiline
                        rows={2}
                        variant="outlined"
                        value={response}
                    />
                </Box>
            </Box>
        </div>
    );
}
