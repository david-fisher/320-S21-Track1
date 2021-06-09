import React, { useContext } from 'react';
import Button from '@material-ui/core/Button';
import './questions.css';
import PropTypes from 'prop-types';
import GlobalUnsavedContext from '../../../Context/GlobalUnsavedContext';
import QuestionField from './question';

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
  // eslint-disable-next-line
    const [globalUnsaved, setGlobalUnsaved] = useContext(GlobalUnsavedContext);
  // When we select new issue button, we add new issue object into array.
  // We set a temporary unique ID.
  function setNewIssueID() {
    let newID = Math.floor(Math.random() * 10000000);
    let collision = questions.filter((data) => data.RQ_ID === newID).length !== 0;
    while (collision) {
      newID = Math.floor(Math.random() * 10000000);
      const checkNewID = newID;
      collision = questions.data.filter((data) => data.RQ_ID === checkNewID)
        .length !== 0;
    }
    return newID;
  }

  const removeQuestion = (questionID) => {
    setGlobalUnsaved(true);
    const leftQuestions = questions.filter((q) => q.RQ_ID !== questionID);
    setQuestions(leftQuestions);
    const reqBody = leftQuestions.map((obj) => obj.REFLECTION_QUESTION);
    setReqBodyNew(reqBody);
  };

  const addQuestion = (e) => {
    setGlobalUnsaved(true);
    e.preventDefault();
    let newQuestions = questions.map((data) => data.REFLECTION_QUESTION);
    newQuestions = [...newQuestions, ''];
    setReqBodyNew(newQuestions);
    const newQuestionsList = questions.concat({
      RQ_ID: setNewIssueID(),
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
        style={{ textTransform: 'unset' }}
      >
        Add Question
      </Button>

      <form id="form">
        {questions.map((data) => (
          <QuestionField
            key={data.RQ_ID}
            id={data.RQ_ID}
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
