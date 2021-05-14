import React, { useState } from 'react';
import StakeholderFields from './StakeholdersComponent/stakeholders';
import PropTypes from 'prop-types';

ConversationEditor.propTypes = {
    scenario_ID: PropTypes.number,
};

export default function ConversationEditor({ scenario_ID }) {
    const [stakeholders, setStakeholders] = useState([]);

    return (
        <div>
            <StakeholderFields
                stakeholders={stakeholders}
                setStakeholders={setStakeholders}
                scenario={scenario_ID}
            />
        </div>
    );
}
