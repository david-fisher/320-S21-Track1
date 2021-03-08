import React from 'react';


const HTMLRenderer = ({html}) => {
    const sanitizedHTML = html.replace(/onerror=/, '').replace(/<a .*onmouseover=.*>/, '<a>');
    return (<div className={'sun-editor-editable'} dangerouslySetInnerHTML={{__html: sanitizedHTML}}></div>);
}

export default HTMLRenderer;