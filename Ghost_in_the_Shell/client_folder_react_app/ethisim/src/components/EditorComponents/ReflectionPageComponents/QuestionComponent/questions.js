import React from 'react';
import QuestionField from './question';
import Button from '@material-ui/core/Button';
import './questions.css';
import PropTypes from 'prop-types';

QuestionFields.propTypes = {
    questions: PropTypes.any,
    setQuestions: PropTypes.any,
    setReqBodyNew: PropTypes.any,
};

export default function QuestionFields({
    questions,
    setQuestions,
    setReqBodyNew,
}) {
    //When we select new issue button, we add new issue object into array.
    //We set a temporary unique ID.
    function setNewIssueID() {
        let newID = Math.floor(Math.random() * 10000000);
        let collision =
            questions.filter((data) => data.id === newID).length !== 0;
        while (collision) {
            newID = Math.floor(Math.random() * 10000000);
            const checkNewID = newID;
            collision =
                questions.data.filter((data) => data.id === checkNewID)
                    .length !== 0;
        }
        return newID;
    }

    const removeQuestion = (questionID) => {
        const leftQuestions = questions.filter((q) => q.id !== questionID);
        setQuestions(leftQuestions);
        let reqBody = leftQuestions.map((obj) => obj.REFLECTION_QUESTION);
        setReqBodyNew(reqBody);
    };

    const addQuestion = (e) => {
        e.preventDefault();
        let newQuestions = questions.map((data) => data.REFLECTION_QUESTION);
        newQuestions = [...newQuestions, ''];
        setReqBodyNew(newQuestions);
        let newQuestionsList = questions.concat({
            id: setNewIssueID(),
            REFLECTION_QUESTION: '',
        });
        setQuestions(newQuestionsList);
    };

    return (
        <div className="questions">
            <Button
                id="button"
                onClick={addQuestion}
                variant="contained"
                color="primary"
            >
                Add Question
            </Button>

            <form id="form">
                {questions.map((data) => (
                    <QuestionField
                        key={data.id}
                        id={data.id}
                        removeQuestion={removeQuestion}
                        question={data.REFLECTION_QUESTION}
                        listOfQuestions={questions}
                        setListOfQuestions={setQuestions}
                        setReqBodyNew={setReqBodyNew}
                    />
                ))}
            </form>
        </div>
    );
}
