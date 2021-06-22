import React from 'react';
import PropTypes from 'prop-types';
import {
  Typography,
} from '@material-ui/core';

ScenarioCard.propTypes = {
  finished: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  courses: PropTypes.array.isRequired,
  date: PropTypes.string.isRequired,
};
export default function ScenarioCard({
  finished, title, courses, date,
}) {
  // scenario card for the simulator homepage
  const word = finished ? 'Completed on: ' : 'Assigned: ';
  let coursesToString = courses ? courses.reduce((acc, cur) => `${acc}, ${cur.NAME}`, '') : '';
  coursesToString = coursesToString !== '' ? coursesToString.substring(1, coursesToString.length) : '';

  return (
    <div>
      <Typography variant="h4" color="primary" style={{ margin: '8px' }}>{title}</Typography>
      <Typography variant="h6" style={{ margin: '8px' }}>
        Courses:
        {coursesToString}
      </Typography>
      <Typography variant="body1" style={{ margin: '8px' }}>
        {word}
        {date}
      </Typography>
    </div>
  );
}
