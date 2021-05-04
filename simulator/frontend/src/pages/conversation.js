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
  TextField
} from "@material-ui/core";
import { BACK_URL, STUDENT_ID, SCENARIO_ID } from "../constants/config";
import axios from 'axios';
import HTMLRenderer from "./components/htmlRenderer";
import { ScenariosContext } from "../Nav";
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

function Conversation({ showStakeholders, setShowStakeholders, stakeholder }) {
    function goToStakeholders() {
        setShowStakeholders(true);
    }

    const [answer, setAnswer] = React.useState('');
    const [questionAnswered, setQuestionAnswered] = React.useState(false);
    const [conversations, setConversations] = React.useState([]);
    const [selectedConversation, setSelectedConversation] = React.useState(-1);
    const [scenarios, setScenarios] = React.useContext(ScenariosContext);

    const endpointGet = "/scenarios/conversation/page?versionId=" + SCENARIO_ID + "&scenarioId="  + SCENARIO_ID + "&stakeholderId=" + stakeholder.id;

    const [fetchConversationResponse, setFetchConversationResponse] = useState({
      data: null,
      loading: false,
      error: null,
    });
    const [shouldFetch, setShouldFetch] = useState(0);

    let getData = () => {

     

      function onSuccess(response){
        setConversations(response.data.result[1])
      };
  
      function onFailure(err){
        console.log('Error');
      };
      get(setFetchConversationResponse, (endpointGet), onFailure, onSuccess);
    };

    let checkQuestionAnswered = () => {
      let endpoint = "/scenarios/conversation/had?versionId=" + SCENARIO_ID + "&stakeholderId=" + stakeholder.id + "&userId=1";
      
      function onSuccess(response){
        if(response.data.message === "succes"){ // Yes, there is a typo in the endpoint.
          setQuestionAnswered(true);
          setSelectedConversation(response.data.result[0].conversation_id);
          setAnswer(response.data.result[0].conversation_response);
        }
      }

      function onFailure(err){
        console.log('Error')
      }

      get(setFetchConversationResponse, (endpoint), onFailure, onSuccess);
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

      let endpointPost = "/scenarios/conversation?versionId=" + SCENARIO_ID + "&scenarioId=" + SCENARIO_ID + "&stakeholderId=" + stakeholder.id + "&conversationId=" + selectedConversation + "&courseId=1&sessionId=1";


      
      post(setFetchConversationResponse,(endpointPost), onFailure, onSuccess, {
        already_exist: true
      })
      setSelectedConversation(-1)
    }
    
    const handleToggle = (value) => () => {
      setSelectedConversation(value);
    };
    
    const handleSubmit = () => {
      postData();
      setQuestionAnswered(true);
    };

    const handleChange = (e) => {
      console.log(e)
      setAnswer(e.target.value);
    }
    const classes = useStyles();
    return (
      <div>
        <Box mt={5}>
          <Grid container direction="column" justify="center" alignItems="center">
   
            <Avatar style={{height:"100px", width:"100px"}} alt="Stakeholder Photo" size src={stakeholder.photo}/>

            <TextTypography variant="h4" align="center" gutterBottom>
              {stakeholder.name}
            </TextTypography>
            <TextTypography variant="h5" align="center" gutterBottom>
              {stakeholder.job}
            </TextTypography>
          </Grid>
        </Box>
        <Grid item style={{ marginLeft: "0rem", marginTop: "-3rem" }}>
            <Button
              variant="contained"
              disableElevation
              color="primary"
              onClick={goToStakeholders}
            >
              Return
            </Button>
          </Grid>
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
              Select a Question to Answer:
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
      </div>
    );
  }
  
export default Conversation;