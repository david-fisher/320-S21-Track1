import React from 'react';
import PropTypes from 'prop-types';

ScenarioCard.propTypes = {
  finished: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  course: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
};
export default function ScenarioCard({
  finished, title, course, date,
}) {
  // scenario card for the simulator homepage
  const word = finished ? 'Completed on: ' : 'Assigned: ';
  return (
    <div>
      <h2>{title}</h2>
      <h4>
        Course:
        {course}
      </h4>
      <p>
        {word}
        {date}
      </p>
    </div>
  );
}
