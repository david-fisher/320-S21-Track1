import React from 'react';
import NavSideBarNode from './NavSideBarListNode';
import PropTypes from 'prop-types';

NavSideBarList.propTypes = {
    onClick: PropTypes.any.isRequired,
    deleteByID: PropTypes.any.isRequired,
    scenarioPages: PropTypes.any.isRequired,
};

export default function NavSideBarList(props) {
    NavSideBarList.propTypes = props.data;
    const data = props;
    const { studentResponsePages, onClick } = data;

    return (
        <div>
            {studentResponsePages.map((studentResponsePage) => (
                <NavSideBarNode
                    key={studentResponsePage.id}
                    onClick={onClick}
                    {...studentResponsePage}
                />
            ))}
        </div>
    );
}
