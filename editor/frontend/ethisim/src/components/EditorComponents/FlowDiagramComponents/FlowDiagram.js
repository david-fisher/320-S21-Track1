import React, { useState, useEffect, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
} from '@material-ui/core';
import ReactFlow, {
  removeElements,
  isEdge,
  isNode,
  MiniMap,
  Controls,
  Background,
} from 'react-flow-renderer';
import RefreshIcon from '@material-ui/icons/Refresh';
import ErrorIcon from '@material-ui/icons/Error';
import PropTypes from 'prop-types';
import initializeElements from './HelperFunctions/initializeElements';
import {
  actionNode,
  reflectionNode,
  genericNode,
  conversationNode,
  introNode,
} from './HelperFunctions/node';
import addEdge from './HelperFunctions/addEdge';
import get from '../../../universalHTTPRequests/get';
import put from '../../../universalHTTPRequests/put';
import LoadingSpinner from '../../LoadingSpinner';
import SuccessBanner from '../../Banners/SuccessBanner';
import ErrorBanner from '../../Banners/ErrorBanner';
import GlobalUnsavedContext from '../../../Context/GlobalUnsavedContext';
import { FlowDiagramHelpInfo } from './FlowDiagramHelpInfo';
import GenericHelpButton from '../../HelpButton/GenericHelpButton';
import ScenarioAccessLevelContext from '../../../Context/ScenarioAccessLevelContext';

const useStyles = makeStyles((theme) => ({
  errorContainer: {
    marginTop: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  container: {
    marginTop: '-15px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: '90vh',
  },
  headerContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
  },
  copyright: {
    margin: theme.spacing(2),
  },
  buttonContainer: {
    display: 'flex',
    float: 'right',
    flexDirection: 'column',
  },
  button: {
    zIndex: 5,
    float: 'right',
  },
  iconError: {
    fontSize: '75px',
  },
  iconRefreshLarge: {
    fontSize: '75px',
  },
  iconRefreshSmall: {
    fontSize: '30px',
  },
}));

// Needs scenario id
const endpointGET = '/flowchart?scenario_id=';
// Needs scenario id
const endpointPUT = '/flowchart?scenario_id=';

FlowDiagram.propTypes = {
  scenario_ID: PropTypes.number,
};

export default function FlowDiagram({ scenario_ID }) {
  const scenarioID = scenario_ID;
  const classes = useStyles();
  const [fetchedElements, setFetchedElements] = useState({
    data: null,
    loading: true,
    error: null,
  });

  const [elementsPUT, setElementsPUT] = useState({
    data: null,
    loading: false,
    error: null,
  });

  const [elements, setElements] = useState([]);
  const [errorText, setErrorText] = useState('');
  const [unsaved, setUnsaved] = useContext(GlobalUnsavedContext);
  const accessLevel = useContext(ScenarioAccessLevelContext);

  function positionElements(elements) {
    const introductionElement = elements.filter(
      (componentData) => componentData.PAGE_TYPE === 'I',
    );
    const genericElements = elements.filter(
      (componentData) => componentData.PAGE_TYPE === 'G',
    );
    const reflectionElements = elements.filter(
      (componentData) => componentData.PAGE_TYPE === 'R',
    );
    const actionElements = elements.filter(
      (componentData) => componentData.PAGE_TYPE === 'A',
    );
    const stakeholderConversationElement = elements.filter(
      (componentData) => componentData.PAGE_TYPE === 'S',
    );
    const feedbackElement = elements.filter(
      (componentData) => componentData.PAGE_TYPE === 'F',
    );

    const edges = elements.filter((componentData) => isEdge(componentData));

    let initialElements = introductionElement.concat(
      genericElements,
      reflectionElements,
      actionElements,
      stakeholderConversationElement,
      feedbackElement,
      edges,
    );

    initialElements = initialElements.map((componentData) => initializeElements(componentData));

    // Set position of elements if elements are new ({x: 0,y: 0})
    // Height of nodes are 91 pixels
    initialElements.reduce((acc, currentValue) => {
      if (
        currentValue.position.x === 0
                && currentValue.position.y === 0
      ) {
        currentValue.position.y += acc;
        return acc + 91;
      }
      return acc;
    }, 0);

    return initialElements;
  }

  function addEdges(elements) {
    // Add edges
    elements.forEach((currentElement) => {
      // TODO
      if (currentElement.type === 'actionNode') {
        const actions = currentElement.ACTION;
        for (let i = 0; i < actions.length; i++) {
          if (currentElement.ACTION[i].RESULT_PAGE_id) {
            elements = addEdge(
              {
                source: `${currentElement.id.toString()}__${i + 1}`,
                target: currentElement.ACTION[i].RESULT_PAGE_id.toString(),
              },
              elements,
            );
          }
        }
      } else if (currentElement.NEXT_PAGE_id) {
        elements = addEdge(
          {
            source: currentElement.id.toString(),
            target: currentElement.NEXT_PAGE_id.toString(),
          },
          elements,
        );
      }
    });
    return elements;
  }

  const getData = () => {
    setUnsaved(false);
    function onSuccess(resp) {
      setElements(addEdges(positionElements(resp.data)));
    }
    function onError(resp) {
      setErrorText('Unable to fetch Flow Diagram! Please try again.');
    }
    get(setFetchedElements, endpointGET + scenarioID, onError, onSuccess);
  };

  useEffect(getData, []);

  const [isRemoveButtonDisabled, setIsRemoveButtonDisabled] = useState(true);
  const [currentEdgeSelected, setCurrentEdgeSelected] = useState();

  const nodeTypes = {
    actionNode,
    reflectionNode,
    genericNode,
    introNode,
    conversationNode,
  };

  // Height and Width of flow diagram
  const graphStyles = { width: '100%', height: '100%', border: 'solid' };

  const onConnect = (params) => {
    setUnsaved(true);
    setElements((elements) => addEdge(params, elements));
  };

  const onRemoveEdge = (params, element) => {
    if (isEdge(element)) {
      setIsRemoveButtonDisabled(false);
      setCurrentEdgeSelected([element]);
    }
  };

  const deleteEdge = () => {
    setUnsaved(true);
    if (currentEdgeSelected != null) {
      setElements((elements) => removeElements(currentEdgeSelected, elements));
      setCurrentEdgeSelected(null);
      setIsRemoveButtonDisabled(true);
    }
  };

  // Update of nodes position
  const onNodeDrag = (event, element) => {
    setUnsaved(true);
    // ID's in flow diagram library are stored as strings
    const index = elements.findIndex(
      (ele) => ele.id === Number(element.id),
    );
    // important to create a copy, otherwise you'll modify state outside of setState call
    const elementsCopy = [...elements];
    elementsCopy[index] = {
      ...elementsCopy[index],
      position: element.position,
    };
    setElements(elementsCopy);
  };

  const save = () => {
    function onSuccess() {
      const resetElements = elements.reduce((array, currentElement) => {
        if (isNode(currentElement) && currentElement.position.x === 0) {
          return array.concat({
            ...currentElement,
            X_COORDINATE: 0,
            Y_COORDINATE: 0,
            position: { x: 0, y: 0 },
          });
        }
        return array.concat(currentElement);
      }, []);
      setElements(positionElements(resetElements));
      setUnsaved(false);
      setSuccessBannerFade(true);
      setSuccessBannerMessage('Successfully Saved!');
    }

    function onError() {
      setErrorBannerFade(true);
      setErrorBannerMessage('Failed to Save!');
    }

    const updatedElements = elements.reduce((array, currentElement) => {
      if (isNode(currentElement)) {
        const nodeElement = {
          PAGE: currentElement.PAGE,
          PAGE_TYPE: currentElement.PAGE_TYPE,
          PAGE_TITLE: currentElement.PAGE_TITLE,
          PAGE_BODY: currentElement.PAGE_BODY,
          SCENARIO: currentElement.SCENARIO_id,
          VERSION: currentElement.VERSION,
          NEXT_PAGE: null,
          X_COORDINATE: Math.floor(currentElement.position.x),
          Y_COORDINATE:
                        Math.floor(currentElement.position.x) !== 0
                          ? Math.floor(currentElement.position.y)
                          : 0,
        };

        if (currentElement.type === 'actionNode') {
          nodeElement.ACTION = currentElement.ACTION.map(
            (actionData) => ({
              APC_ID: actionData.APC_ID,
              PAGE: actionData.PAGE_id,
              CHOICE: actionData.CHOICE,
              RESULT_PAGE: null,
            }),
          );
          const actions = currentElement.ACTION;
          for (let i = 0; i < actions.length; i++) {
            elements.forEach((currElement) => {
            // First option
              if (
                isEdge(currElement)
                            && currElement.source.substring(0, currElement.source.length - 1) === `${currentElement.id}__`
              ) {
                const index = Number(currElement.source[currElement.source.length - 1]) - 1;
                nodeElement.ACTION[index] = {
                  APC_ID: currentElement.ACTION[index].APC_ID,
                  CHOICE: currentElement.ACTION[index].CHOICE,
                  PAGE: currentElement.id,
                  RESULT_PAGE: Number(currElement.target),
                };
              }
            });
          }
        } else {
          // Set next page ID for all other node types
          elements.some((currElement) => {
            // currElement.source is type string, convert to number
            if (
              isEdge(currElement)
                            && Number(currElement.source) === currentElement.id
            ) {
              // Set NEXT_PAGE id to type number
              nodeElement.NEXT_PAGE = Number(currElement.target);
              return true;
            }
            return false;
          });
        }
        return array.concat(nodeElement);
      }
      return array;
    }, []);
    put(
      setElementsPUT,
      endpointPUT + scenarioID,
      onError,
      onSuccess,
      updatedElements,
    );
  };

  const [successBannerFade, setSuccessBannerFade] = useState(false);
  const [successBannerMessage, setSuccessBannerMessage] = useState('');
  const [errorBannerFade, setErrorBannerFade] = useState(false);
  const [errorBannerMessage, setErrorBannerMessage] = useState('');

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSuccessBannerFade(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [successBannerFade]);

  // RESET Pop-up Dialog
  const [openReset, setOpenReset] = useState(false);
  const [openRefresh, setOpenRefresh] = useState(false);

  const refresh = () => {
    if (unsaved) {
      setOpenRefresh(true);
    } else {
      getData();
    }
  };

  const handleCloseRefresh = (refresh) => {
    setOpenRefresh(false);
    // remove all edges and reset x and y coordinates to 0
    if (refresh) {
      getData();
    }
  };

  const handleClickOpenReset = () => {
    setOpenReset(true);
  };

  const handleCloseReset = (reset) => {
    setOpenReset(false);
    // remove all edges and reset x and y coordinates to 0
    if (reset) {
      setUnsaved(true);
      const resetElements = elements.reduce((array, currentElement) => {
        if (isNode(currentElement)) {
          return array.concat({
            ...currentElement,
            NEXT_PAGE: null,
            X_COORDINATE: 0,
            Y_COORDINATE: 0,
            position: { x: 0, y: 0 },
          });
        }
        return array;
      }, []);
      setElements(positionElements(resetElements));
    }
  };

  ConfirmationDialog.propTypes = {
    onClose: PropTypes.any,
    open: PropTypes.bool,
    title: PropTypes.string,
    content: PropTypes.string,
  };

  function ConfirmationDialog({
    onClose, open, title, content,
  }) {
    const handleCancel = () => {
      onClose();
    };

    const handleOk = () => {
      onClose(true);
    };

    return (
      <Dialog
        maxWidth="xs"
        aria-labelledby="confirmation-dialog-title"
        open={open}
      >
        <DialogTitle id="confirmation-dialog-title">
          {title}
        </DialogTitle>
        <DialogContent dividers>
          <Typography>{content}</Typography>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleOk} color="primary">
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  if (fetchedElements.loading || elementsPUT.loading) {
    return <LoadingSpinner />;
  }

  if (fetchedElements.error) {
    return (
      <div className={classes.errorContainer}>
        <div className={classes.container}>
          <ErrorIcon className={classes.iconError} />
          <Typography align="center" variant="h5">
            {errorText}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={getData}
          >
            <RefreshIcon className={classes.iconRefreshLarge} />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={classes.container}>
      <Typography variant="h3">Order Scenario Pages</Typography>
      <div className={classes.headerContainer}>
        <Button variant="contained" color="primary" onClick={refresh}>
          <RefreshIcon className={classes.iconRefreshSmall} />
        </Button>
        <GenericHelpButton
          description={FlowDiagramHelpInfo}
          title="Flow Diagram Help"
        />
      </div>
      {unsaved && accessLevel !== 3 ? (
        <Typography variant="h6" align="center" color="error">
          Unsaved
        </Typography>
      ) : null}
      <SuccessBanner
        successMessage={successBannerMessage}
        fade={successBannerFade}
      />
      <ErrorBanner
        errorMessage={errorBannerMessage}
        fade={errorBannerFade}
      />
      <ConfirmationDialog
        id="confirmRefresh"
        keepMounted
        open={openRefresh}
        onClose={handleCloseRefresh}
        title="Unsaved Changes"
        content="You have unsaved changes. Would you still like to refresh?"
      />
      <ConfirmationDialog
        id="confirmReset"
        keepMounted
        open={openReset}
        onClose={handleCloseReset}
        title="Reset Flow Diagram"
        content="Would you like to reset the flow diagram?"
      />
      <ReactFlow
        elements={elements}
        style={graphStyles}
        onConnect={onConnect}
        onElementClick={onRemoveEdge}
        onNodeDragStop={onNodeDrag}
        nodeTypes={nodeTypes}
      >
        <div className={classes.buttonContainer}>
          <Button
            className={classes.button}
            variant="contained"
            color="primary"
            onClick={save}
            disabled={accessLevel === 3}
          >
            <Typography variant="h6" display="block" noWrap>
              Save Changes
            </Typography>
          </Button>
          <Button
            className={classes.button}
            variant="contained"
            color="primary"
            onClick={handleClickOpenReset}
          >
            <Typography variant="h6" display="block" noWrap>
              Reset
            </Typography>
          </Button>
          <Button
            className={classes.button}
            variant="contained"
            color="primary"
            disabled={isRemoveButtonDisabled}
            onClick={deleteEdge}
          >
            <Typography variant="h6" display="block" noWrap>
              Remove Edge
            </Typography>
          </Button>
        </div>
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
}
