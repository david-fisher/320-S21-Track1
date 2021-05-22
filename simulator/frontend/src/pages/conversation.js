import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  withStyles,
  Typography,
  Box,
  Grid,
  Button,
  makeStyles,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Checkbox,
} from '@material-ui/core';
import { STUDENT_ID } from '../constants/config';
import get from '../universalHTTPRequests/get';
import post from '../universalHTTPRequests/post';

const TextTypography = withStyles({
  root: {
    color: '#373a3c',
    whiteSpace: 'pre-line',
  },
})(Typography);

const useStyles = makeStyles((theme) => ({
  textBox: {
    overflowY: 'auto',
    marginTop: '3px',
    maxHeight: window.innerHeight * 0.6,
    borderRadius: '5px',
    boxShadow: '0px 0px 2px',
  },
}));

Conversation.propTypes = {
  stakeholder: PropTypes.object.isRequired,
  showStakeholders: PropTypes.func.isRequired,
  setShowStakeholders: PropTypes.func.isRequired,
  versionID: PropTypes.number.isRequired,
  sessionID: PropTypes.number.isRequired,
};
export default function Conversation({
  sessionID,
  showStakeholders,
  setShowStakeholders,
  stakeholder,
  versionID,
}) {
  const classes = useStyles();
  const body = stakeholder.introduction.replace(/\\"/g, '"');

  function goToStakeholders() {
    setShowStakeholders(true);
  }

  const [answer, setAnswer] = useState('');
  const [questionAnswered, setQuestionAnswered] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(-1);
  const [hasQuestions, setHasQuestions] = useState(false);
  const endpointGet = `/scenarios/conversation/page?versionId=${versionID}&scenarioId=${versionID}&stakeholderId=${stakeholder.id}`;
  // eslint-disable-next-line
  const [fetchConversationResponse, setFetchConversationResponse] = useState({
    data: null,
    loading: false,
    error: null,
  });
  // eslint-disable-next-line
  const [shouldFetch, setShouldFetch] = useState(0);

  const getData = () => {
    function onSuccess(response) {
      console.log(response);
      setConversations(response.data.result[1]);
      setHasQuestions(true);
    }

    function onFailure(err) {
      // TODO stakeholder does not have questions
      setQuestionAnswered(true);
      setHasQuestions(false);
    }
    get(setFetchConversationResponse, endpointGet, onFailure, onSuccess);
  };

  const checkQuestionAnswered = () => {
    const endpoint = `/scenarios/conversation/had?versionId=${versionID}&stakeholderId=${stakeholder.id}&userId=${STUDENT_ID}`;

    function onSuccess(response) {
      if (response.data.message === 'succes') {
        // Yes, there is a typo in the endpoint.
        setQuestionAnswered(true);
        setSelectedConversation(response.data.result[0].conversation_id);
        setAnswer(response.data.result[0].conversation_response);
      }
    }

    function onFailure(err) {
      console.log('Error');
    }

    get(setFetchConversationResponse, endpoint, onFailure, onSuccess);
  };

  useEffect(getData, [shouldFetch]);
  useEffect(checkQuestionAnswered, [shouldFetch]);

  const postData = () => {
    function onSuccess(response) {
      console.log(response);
      setAnswer(response.data.result.conversation_response);
    }

    function onFailure(err) {
      console.log('Error');
    }

    const endpointPost = `/scenarios/conversation?versionId=${versionID}&scenarioId=${versionID}&stakeholderId=${stakeholder.id}&conversationId=${selectedConversation}&sessionId=${sessionID}`;

    post(setFetchConversationResponse, endpointPost, onFailure, onSuccess, {
      already_exist: true,
    });
    setSelectedConversation(-1);
  };

  const handleToggle = (value) => () => {
    setSelectedConversation(value);
  };

  const handleSubmit = () => {
    postData();
    setQuestionAnswered(true);
  };

  return (
    <div>
      <Box mt={5}>
        <Grid container direction="column" justify="center" alignItems="center">
          <TextTypography variant="h4" align="center" gutterBottom>
            Conversation
          </TextTypography>
          <Avatar
            style={{ height: '100px', width: '100px' }}
            alt="Stakeholder Photo"
            size
            src={stakeholder.photo}
          />
          <TextTypography variant="h4" align="center" gutterBottom>
            {stakeholder.name}
          </TextTypography>
          <TextTypography variant="h5" align="center" gutterBottom>
            {stakeholder.job}
          </TextTypography>
          <div dangerouslySetInnerHTML={{ __html: body }} />
        </Grid>
      </Box>
      <Grid container direction="row" justify="space-between">
        <Grid
          item
          style={{
            marginLeft: '0rem',
            marginRight: '0rem',
            marginTop: '-3rem',
          }}
        />
      </Grid>
      {hasQuestions
        ? (
          <Grid container spacing={2}>
            <Grid item lg={12}>
              <Divider
                style={{
                  marginTop: '10px',
                  marginBottom: '30px',
                  height: '2px',
                  backgroundColor: 'black',
                }}
              />
              <Box align="left">
                Select one Question to Ask:
                <List>
                  {conversations.map((value) => {
                    const labelId = `question-${value.conversation_id}$`;

                    return (
                      <ListItem
                        alignItems="center"
                        key={value.conversation_id}
                        role="listitem"
                        disabled={questionAnswered}
                        button
                        onClick={handleToggle(value.conversation_id)}
                      >
                        <ListItemIcon>
                          <Checkbox
                            color="primary"
                            checked={selectedConversation === value.conversation_id}
                          />
                        </ListItemIcon>
                        <ListItemText id={labelId} primary={value.question} />
                      </ListItem>
                    );
                  })}
                </List>
                <Button
                  align="left"
                  style={{ marginTop: '15px', marginBottom: '25px' }}
                  disabled={selectedConversation === -1 || questionAnswered}
                  variant="outlined"
                  size="medium"
                  color="primary"
                  onClick={handleSubmit}
                >
                  Select
                </Button>
              </Box>
              <Box fontWeight={500}>Response</Box>
              <Box p={2} className={classes.textBox}>
                {answer}
              </Box>
            </Grid>
          </Grid>
        )
        : null }
      <Grid item style={{ marginLeft: '0rem', marginTop: '1rem', marginBottom: '1rem' }}>
        {!questionAnswered && hasQuestions ? (
          <Typography display="block" variant="subtitle" color="error">
            You must select one question to ask the stakeholder before you can
            return.
          </Typography>
        ) : null}
        <Button
          variant="contained"
          color="primary"
          disabled={!questionAnswered && hasQuestions}
          onClick={goToStakeholders}
        >
          Return
        </Button>
      </Grid>
    </div>
  );
}
