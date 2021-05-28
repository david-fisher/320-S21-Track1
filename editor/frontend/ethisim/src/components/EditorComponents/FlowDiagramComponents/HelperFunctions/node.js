import React from 'react';
import { Handle } from 'react-flow-renderer';
import HTMLPreview from '../../HTMLPreview';

export function actionNode({ data }) {
  const { label, actions, componentData } = data;
  return (
    <>
      <Handle
        type="target"
        position="top"
        onConnect={(params) => console.log('handle onConnect', params)}
      />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <HTMLPreview
          title={componentData.PAGE_TITLE}
          body={componentData.PAGE_BODY}
          choices={componentData.ACTION}
          isFlowDiagram
        />
      </div>
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
  const { label, componentData } = data;
  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <HTMLPreview
          title={componentData.PAGE_TITLE}
          body={componentData.PAGE_BODY}
          isFlowDiagram
        />
      </div>
      {label}
      <Handle type="source" position="bottom" />
    </>
  );
}

export function reflectionNode({ data }) {
  const { label, componentData } = data;
  return (
    <>
      <Handle type="target" position="top" />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <HTMLPreview
          title={componentData.PAGE_TITLE}
          body={componentData.PAGE_BODY}
          questions={componentData.REFLECTION_QUESTIONS}
          isFlowDiagram
        />
      </div>
      {label}
      <Handle type="source" position="bottom" />
    </>
  );
}

export function genericNode({ data }) {
  const { label, componentData } = data;
  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <HTMLPreview
          title={componentData.PAGE_TITLE}
          body={componentData.PAGE_BODY}
          isFlowDiagram
        />
      </div>
      <Handle type="target" position="top" />
      {label}
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
