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
  textBox:{
    marginTop: theme.spacing(3),
  },
  oldTextBox: {
    overflowY: "auto",
    maxHeight: window.innerHeight * 0.6,
    marginTop: theme.spacing(4),
    borderRadius: "5px",
    boxShadow: "0px 0px 2px",
  },
}));

function Conversation({ showStakeholders, setShowStakeholders, stakeholder }) {
    function goToStakeholders() {
        setShowStakeholders(true);
    }

    const [answer, setAnswer] = React.useState('');
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

    useEffect(getData, [shouldFetch]);

    let postData = () => {
      function onSuccess(response){
        console.log(response)
      };
  
      function onFailure(err){
        console.log('Error');
      };

      let endpointPost = "/scenarios/conversation?versionId=" + SCENARIO_ID + "&scenarioId=" + SCENARIO_ID + "&stakeholderId=" + stakeholder.id + "&conversationId=" + selectedConversation + "&courseId=1&sessionId=1";


      
      post(setFetchConversationResponse,(endpointPost), onFailure, onSuccess, {
        response_id: answer
      })
    }
    
    const handleToggle = (value) => () => {
      setSelectedConversation(value);
    };
    
    const handleSubmit = () => {
      postData();
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
            <Box align="center">
              Select a Question to Answer
              <List>
                {conversations.map((value) => {
                  const labelId = `question-${value.conversation_id}$`;
                
                  return (
                    <ListItem alignItems='center' key={value.conversation_id} role="listitem" button onClick={handleToggle(value.conversation_id)}>
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
            </Box>
            <TextField
              className={classes.textBox}
              disabled={selectedConversation === -1}
              id='text-box'
              label='Response'
              fullWidth
              multiline
              onChange={handleChange}
              variant="outlined"
            />

            <Button 
              style={{marginTop: '20px'}} 
              disabled={selectedConversation === -1}
              variant='outlined' 
              size='medium' 
              color='primary'
              onClick={handleSubmit}>
              Submit
            </Button>
          </Grid>
        </Grid>
      </div>
    );
  }
  
export default Conversation;