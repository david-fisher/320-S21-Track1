import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';
import QuestionResponseField from './QuestionResponseField';

ReflectionResponse.propTypes = {
  studentReflections: PropTypes.any,
};

export default function ReflectionResponse({ studentReflections }) {
  // questionsResponses is an array of object in format {question: string, response: string}
  const questionResponsesWithID = studentReflections.questionResponses.map(
    (data, index) =>
    // setID(id + 1);
      // eslint-disable-next-line implicit-arrow-linebreak
      ({
        question: data.question,
        response: data.response,
        id: index,
      }),
  );

  return (
    <div>
      <Typography align="center" variant="h3">
        {studentReflections.title}
      </Typography>
      {questionResponsesWithID.map((data) => (
        <QuestionResponseField
          key={data.id}
          id={data.id}
          question={data.question}
          response={data.response}
        />
      ))}
    </div>
  );
}
