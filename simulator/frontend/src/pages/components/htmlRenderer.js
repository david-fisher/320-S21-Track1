/* eslint-disable react/prop-types */
import React from 'react';

export const HTMLRenderer = ({ html }) => {
  const sanitizedHTML = html.replace(/onerror=/, '').replace(/<a .*onmouseover=.*>/, '<a>');
  return (<div className="sun-editor-editable" dangerouslySetInnerHTML={{ __html: sanitizedHTML }} />);
};
