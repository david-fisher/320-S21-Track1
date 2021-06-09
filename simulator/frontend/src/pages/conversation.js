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
import InnerHTML from 'dangerously-set-html-content';
import get from '../universalHTTPRequestsEditor/get';
// import post from '../universalHTTPRequestsEditor/post';

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
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(-1);
  const [hasQuestions, setHasQuestions] = useState(false);
  const endpointGet = `/api/conversations/?STAKEHOLDER=${stakeholder.id}`;
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
      setConversations(response.data);
      setHasQuestions(response.data.length > 0);
    }

    function onFailure(err) {
      setHasQuestions(false);
    }
    get(setFetchConversationResponse, endpointGet, onFailure, onSuccess);
  };

  useEffect(getData, [shouldFetch]);

  const handleToggle = (value) => () => {
    setSelectedConversation(value);
  };

  const handleSubmit = () => {
    setAnswer(conversations.filter((obj) => obj.CONVERSATION === selectedConversation)[0].RESPONSE);
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
          <InnerHTML html={body.replace(/\\"/g, '"')} />
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
                <List>
                  {conversations.map((value) => {
                    const labelId = `question-${value.CONVERSATION}$`;

                    return (
                      <ListItem
                        alignItems="center"
                        key={value.CONVERSATION}
                        role="listitem"
                        button
                        onClick={handleToggle(value.CONVERSATION)}
                      >
                        <ListItemIcon>
                          <Checkbox
                            color="primary"
                            checked={selectedConversation === value.CONVERSATION}
                          />
                        </ListItemIcon>
                        <ListItemText id={labelId} primary={value.QUESTION} style={{ wordBreak: 'break-word' }} />
                      </ListItem>
                    );
                  })}
                </List>
                <Button
                  align="left"
                  style={{ marginTop: '15px', marginBottom: '25px' }}
                  disabled={selectedConversation === -1}
                  variant="outlined"
                  size="medium"
                  color="primary"
                  onClick={handleSubmit}
                >
                  Select
                </Button>
              </Box>
              <Box fontWeight={500}>
                <Typography variant="h6">
                  Response
                </Typography>
              </Box>
              <Box p={2} className={classes.textBox}>
                {answer}
              </Box>
            </Grid>
          </Grid>
        )
        : null }
      <Grid item style={{ marginLeft: '0rem', marginTop: '1rem', marginBottom: '1rem' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={goToStakeholders}
        >
          Return
        </Button>
      </Grid>
    </div>
  );
}
