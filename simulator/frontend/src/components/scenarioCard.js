import React from 'react';
import PropTypes from 'prop-types';

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
      <h2>{title}</h2>
      <h4>
        Courses:
        {coursesToString}
      </h4>
      <p>
        {word}
        {date}
      </p>
    </div>
  );
}
