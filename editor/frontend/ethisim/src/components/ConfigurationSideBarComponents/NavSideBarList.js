import React, { useState } from 'react';
import PropTypes from 'prop-types';
import NavSideBarNode from './NavSideBarNode';
import { getCurrentTimeInt } from '../CheckTime';

NavSideBarList.propTypes = {
  onClick: PropTypes.any.isRequired,
  deleteByID: PropTypes.any.isRequired,
  scenarioPages: PropTypes.any.isRequired,
};

export default function NavSideBarList(props) {
  const { onClick, deleteByID, scenarioPages } = props;

  /*
     * This section is about managing time to prevent sending a combination of multiple
     *    HTTP GET calls (clicking multiple buttons of the sidebar) before a response is returned
     */
  const [currentTime, setCurrentTime] = useState(getCurrentTimeInt());

  return (
    <div>
      {scenarioPages.map((scenarioPage) => (
        <NavSideBarNode
          key={scenarioPage.id}
          onClick={onClick}
          deleteByID={deleteByID}
          scenarioPages={scenarioPages}
          currentTime={currentTime}
          setCurrentTime={setCurrentTime}
          {...scenarioPage}
        />
      ))}
    </div>
  );
}
