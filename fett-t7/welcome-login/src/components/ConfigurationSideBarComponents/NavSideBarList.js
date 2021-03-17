import React from 'react';
import NavSideBarNode from '../ConfigurationSideBarComponents/NavSideBarNode';
import PropTypes from 'prop-types';

NavSideBarList.propTypes = {
    onClick: PropTypes.any.isRequired,
    deleteByID: PropTypes.any.isRequired,
    scenarioPages: PropTypes.any.isRequired,
};

export default function NavSideBarList(props) {
    const { onClick, deleteByID, scenarioPages } = props;

    return (
        <div>
            {scenarioPages.map((scenarioPage) => (
                <NavSideBarNode
                    key={scenarioPage.id}
                    onClick={onClick}
                    deleteByID={deleteByID}
                    scenarioPages={scenarioPages}
                    {...scenarioPage}
                />
            ))}
        </div>
    );
}
