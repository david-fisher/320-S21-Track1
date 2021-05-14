import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { Button } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import PropTypes from 'prop-types';
import GenericDeleteWarning from '../../../../WarningDialogs/GenericDeleteWarning';

const useStyles = makeStyles((theme) => ({
    margin: {
        margin: theme.spacing(0.5),
        marginTop: theme.spacing(0),
        width: 50,
    },
}));

QuestionField.propTypes = {
    id: PropTypes.number,
    removeQuestion: PropTypes.any.isRequired,
    setError: PropTypes.any,
    setUnsaved: PropTypes.any,
    question: PropTypes.string,
    response: PropTypes.string,
    QRs: PropTypes.any,
    setQRs: PropTypes.any,
};

export default function QuestionField({
    id,
    removeQuestion,
    setUnsaved,
    setError,
    question,
    response,
    QRs,
    setQRs,
}) {
    const [questionValue, setQuestionValue] = useState(question);
    const [responseValue, setResponseValue] = useState(response);

    function updateQRs(shq, shr) {
        const updatedQRs = [...QRs];
        setQRs(
            updatedQRs.map((qr) => {
                if (qr.CONVERSATION === id) {
                    qr.QUESTION = shq;
                    qr.RESPONSE = shr;
                }
                return qr;
            })
        );
    }

    //Used for delete Warning Popup window
    const [open, setOpen] = React.useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };

    const onChangeQuestion = (e) => {
        setError(false);
        setUnsaved(true);
        setQuestionValue(e.target.value);
        updateQRs(e.target.value, responseValue);
    };

    const onChangeResponse = (e) => {
        setError(false);
        setUnsaved(true);
        setResponseValue(e.target.value);
        updateQRs(questionValue, e.target.value);
    };

    const classes = useStyles();

    return (
        <div>
            <Box
                display="flex"
                flexDirection="row"
                p={1}
                m={1}
                bgcolor="background.paper"
            >
                <Box p={1}>
                    <TextField
                        style={{ width: 700 }}
                        id="outlined-multiline-static"
                        label="Question"
                        multiline
                        rows={2}
                        variant="outlined"
                        value={questionValue}
                        onChange={onChangeQuestion}
                    />
                    <TextField
                        style={{ width: 700, marginTop: 20 }}
                        id="outlined-multiline-static"
                        label="Stakeholder Response"
                        multiline
                        rows={2}
                        variant="outlined"
                        value={responseValue}
                        onChange={onChangeResponse}
                    />
                </Box>
                <Box p={1}>
                    <Button
                        className={classes.margin}
                        variant="contained"
                        color="primary"
                        onClick={handleClickOpen}
                        style={{ textTransform: 'unset' }}
                    >
                        Delete
                    </Button>

                    <GenericDeleteWarning
                        remove={() => removeQuestion(id)}
                        open={open}
                        setOpen={setOpen}
                    />
                </Box>
            </Box>
        </div>
    );
}
