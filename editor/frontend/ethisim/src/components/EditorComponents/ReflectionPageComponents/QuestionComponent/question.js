import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import { Button } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import PropTypes from 'prop-types';
import GenericDeleteWarning from '../../../DeleteWarnings/GenericDeleteWarning';

QuestionField.propTypes = {
    removeQuestion: PropTypes.any,
    question: PropTypes.any,
    id: PropTypes.number,
    listOfQuestions: PropTypes.any,
    setListOfQuestions: PropTypes.any,
    setReqBodyNew: PropTypes.any,
};

export default function QuestionField({
    question,
    removeQuestion,
    id,
    listOfQuestions,
    setListOfQuestions,
    setReqBodyNew,
}) {
    const [questionValue, setQuestionValue] = useState(question);

    const onChangeQuestion = (event) => {
        setQuestionValue(event.target.value);
        let listOfQuestions2 = [...listOfQuestions];
        for (let i = 0; i < listOfQuestions2.length; i++) {
            if (listOfQuestions2[i].id === id) {
                listOfQuestions2[i].REFLECTION_QUESTION = event.target.value;
            }
        }
        setListOfQuestions(listOfQuestions2);
        let reqBody = listOfQuestions2.map((obj) => obj.REFLECTION_QUESTION);
        setReqBodyNew(reqBody);
    };

    //Warning to Delete a question componet
    const [open, setOpen] = React.useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };

    return (
        <div>
            <Box display="flex" flexDirection="row" p={1} m={1}>
                <Box p={1} style={{ width: '80%' }}>
                    <TextField
                        style={{ width: '100%' }}
                        label="Question"
                        multiline
                        rows={2}
                        variant="outlined"
                        value={questionValue}
                        onChange={onChangeQuestion}
                    />
                </Box>
                <Box p={1} style={{ width: '20%' }}>
                    <div>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleClickOpen}
                        >
                            Delete
                        </Button>
                        <GenericDeleteWarning
                            remove={() => removeQuestion(id)}
                            setOpen={setOpen}
                            open={open}
                        />
                    </div>
                </Box>
            </Box>
        </div>
    );
}
