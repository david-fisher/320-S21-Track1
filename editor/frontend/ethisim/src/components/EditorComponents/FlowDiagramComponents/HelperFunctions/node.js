import React from 'react';
import { Handle } from 'react-flow-renderer';

export function actionNode({ data }) {
  const { label, actions } = data;
  return (
    <>
      <Handle
        type="target"
        position="top"
        onConnect={(params) => console.log('handle onConnect', params)}
      />
      {label}
      {actions.map((obj, index) => (
        <Handle
          key={index + 1}
          type="source"
          position="bottom"
          id={index + 1}
          style={{ left: `${100 - (100 / (actions.length + 1)) * (index + 1)}%` }}
        />
      ))}
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
      Stakeholder Conversations
      <Handle type="source" position="bottom" />
    </>
  );
}
