import React, {useState, useEffect } from "react";
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
} from "@material-ui/core";
import { STUDENT_ID } from "../constants/config";
import get from '../universalHTTPRequests/get';
import post from '../universalHTTPRequests/post';

const TextTypography = withStyles({
  root: {
    color: "#373a3c",
    whiteSpace: "pre-line",
  },
})(Typography);

const useStyles = makeStyles((theme) => ({
  textBox: {
    overflowY: "auto",
    marginTop:'3px',
    maxHeight: window.innerHeight * 0.6,
    borderRadius: "5px",
    boxShadow: "0px 0px 2px",
  },
}));

export default function Conversation({ sessionID, showStakeholders, setShowStakeholders, stakeholder, versionID}) {
    const classes = useStyles();;
    const body = stakeholder.introduction.replace(/\\"/g, '"');
    console.log(stakeholder);

    function goToStakeholders() {
        setShowStakeholders(true);
    }

    const [answer, setAnswer] = React.useState('');
    const [questionAnswered, setQuestionAnswered] = React.useState(false);
    const [conversations, setConversations] = React.useState([]);
    const [selectedConversation, setSelectedConversation] = React.useState(-1);

    const endpointGet = "/scenarios/conversation/page?versionId=" + versionID + "&scenarioId="  + versionID + "&stakeholderId=" + stakeholder.id;
    //eslint-disable-next-line
    const [fetchConversationResponse, setFetchConversationResponse] = useState({
      data: null,
      loading: false,
      error: null,
    });
    //eslint-disable-next-line
    const [shouldFetch, setShouldFetch] = useState(0);

    let getData = () => {
      function onSuccess(response){
        setConversations(response.data.result[1])
      };
  
      function onFailure(err){
        console.log('Error');
      };
      get(setFetchConversationResponse, endpointGet, onFailure, onSuccess);
    };

    let checkQuestionAnswered = () => {
      let endpoint = "/scenarios/conversation/had?versionId=" + versionID + "&stakeholderId=" + stakeholder.id + "&userId=" + STUDENT_ID;
      
      function onSuccess(response){
        if(response.data.message === "succes"){ // Yes, there is a typo in the endpoint.
          setQuestionAnswered(true);
          setSelectedConversation(response.data.result[0].conversation_id);
          setAnswer(response.data.result[0].conversation_response);
        }
      }

      function onFailure(err){
        console.log('Error');
      }

      get(setFetchConversationResponse, endpoint, onFailure, onSuccess);
    } 

    useEffect(getData, [shouldFetch]);
    useEffect(checkQuestionAnswered, [shouldFetch]);

    let postData = () => {

      function onSuccess(response){
        setAnswer(response.data.result.conversation_response)
      };
  
      function onFailure(err){
        console.log('Error');
      };

      let endpointPost = "/scenarios/conversation?versionId=" + versionID + "&scenarioId=" + versionID + "&stakeholderId=" + stakeholder.id + "&conversationId=" + selectedConversation + "&sessionId=" + sessionID;

      post(setFetchConversationResponse,(endpointPost), onFailure, onSuccess, {
        already_exist: true
      })
      setSelectedConversation(-1);
    }
    
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
            <Avatar style={{height:"100px", width:"100px"}} alt="Stakeholder Photo" size src={stakeholder.photo}/>
            <TextTypography variant="h5" align="center" gutterBottom>
              {stakeholder.name}
            </TextTypography>
            <TextTypography variant="h6" align="center" gutterBottom>
              {stakeholder.job}
            </TextTypography>
            { <div dangerouslySetInnerHTML={{ __html: body }} /> }
          </Grid>
        </Box>
        <Grid container direction="row" justify="space-between">
          <Grid
            item
            style={{
              marginLeft: "0rem",
              marginRight: "0rem",
              marginTop: "-3rem",
            }}
          >
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item lg={12}>
            <Divider style={{ marginTop: '10px', marginBottom: '30px', height:'2px', backgroundColor:'black'}}/>
            <Box align="left">
              Select one Question to Ask:
              <List>
                {conversations.map((value) => {
                  const labelId = `question-${value.conversation_id}$`;
                
                  return (
                    <ListItem alignItems='center' key={value.conversation_id} role="listitem" disabled={questionAnswered} button onClick={handleToggle(value.conversation_id)}>
                      <ListItemIcon>
                        <Checkbox
                          color='primary'
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
                style={{marginTop: '15px', marginBottom:'25px'}} 
                disabled={selectedConversation === -1 || questionAnswered}
                variant='outlined' 
                size='medium' 
                color='primary'
                onClick={handleSubmit}>
                Select
              </Button>
            </Box>
            
          <Box fontWeight={500}>Response</Box>
          <Box p={2} className={classes.textBox}>
            {answer}
          </Box>
    
          </Grid>
        </Grid>
        <Grid item style={{ marginLeft: "0rem", marginTop: "1rem" }}>
            {!questionAnswered ? (
            <Typography display="block" variant="subtitle" color="error">
                You must select one question to ask the stakeholder before you can return.
            </Typography>
          ) : null}
          <Button
            variant="contained"
            color="primary"
            disabled={!questionAnswered}
            onClick={goToStakeholders}
          >
            Return
          </Button>
        </Grid>
      </div>
    );
  }
  