import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';
import StakeholderFields from './StakeholdersComponent/stakeholders';

ConversationEditor.propTypes = {
  scenario_ID: PropTypes.number,
};

export default function ConversationEditor({ scenario_ID }) {
  const [stakeholders, setStakeholders] = useState([]);

  return (
    <div style={{ marginTop: '-15px' }}>
      <Typography align="center" variant="h2">
        Conversation Editor
      </Typography>
      <StakeholderFields
        stakeholders={stakeholders}
        setStakeholders={setStakeholders}
        scenario={scenario_ID}
      />
    </div>
  );
}
