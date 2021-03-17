import React from 'react';
import { Handle } from 'react-flow-renderer';

export function actionNode({ data }) {
    return (
        <>
            <Handle
                type="target"
                position="top"
                onConnect={(params) => console.log('handle onConnect', params)}
            />
            {data.label}
            <Handle
                type="source"
                position="bottom"
                id="a"
                style={{ left: '20%' }}
            />
            <Handle
                type="source"
                position="bottom"
                id="b"
                style={{ left: '80%' }}
            />
        </>
    );
}

export function introNode({ data }) {
    return (
        <>
            {data.label}
            <Handle type="source" position="bottom" />
        </>
    );
}

export function reflectionNode({ data }) {
    return (
        <>
            <Handle type="target" position="top" />
            {data.label}
            <Handle type="source" position="bottom" />
        </>
    );
}

export function genericNode({ data }) {
    return (
        <>
            <Handle type="target" position="top" />
            {data.label}
            <Handle type="source" position="bottom" />
        </>
    );
}

export function conversationNode({ data }) {
    return (
        <>
            <Handle type="target" position="top" />
            {'Stakeholder Conversations'}
            <Handle type="source" position="bottom" />
        </>
    );
}
