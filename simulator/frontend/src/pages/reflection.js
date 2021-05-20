import React,{ useState, useContext } from "react";
import {
  withStyles,
  Typography,
  Box,
  Grid,
  Button,
  makeStyles,
} from "@material-ui/core";
import { STUDENT_ID }from "../constants/config";
import TextField from '@material-ui/core/TextField';
import GlobalContext from '../Context/GlobalContext';

const TextTypography = withStyles({
  root: {
    color: "#373a3c",
    whiteSpace: "pre-wrap",
  },
})(Typography);

const useStyles = makeStyles((theme) => ({
  textBox: {
    overflowY: "auto",
    maxHeight: window.innerHeight * 0.6,
    marginTop: theme.spacing(4),
    borderRadius: "5px",
    boxShadow: "0px 0px 2px",
  },
  errorContainer: {
    marginTop: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  backButton: {
    marginLeft: "0rem",
    marginRight: "0rem",
    marginTop: "1rem",
  },
  nextButton: {
    marginRight: "0rem",
    marginTop: "1rem",
  }
}));

export default function Reflection({ pageTitle, body, questions, getNextPage, getPrevPage, nextPageEndpoint, prevPageEndpoint, versionID, pageID }) {
  body = body.replace(/\\"/g, '"');
  //eslint-disable-next-line
  let [contextObj, setContextObj] = useContext(GlobalContext);

  questions = [
    {
      id: 1,
      page: 1,
      reflection_question: "What are your initial thoughts on autonomous cars?",
      response: "",
    },
    {
      id: 2,
      page: 1,
      reflection_question: "What are the ethical conundrums that comes to mind right away for you when you hear about autonomous cars?",
      response: "",
    }
  ]
  const classes = useStyles();

  const [savedAnswers, setSavedAnswers] = React.useState(false);

  // MAKE API CALL
  const [reflection, setReflection] = useState(questions);
  

  //eslint-disable-next-line
  const endpointPost = '/scenarios/reflection?versionId=' + versionID + '&pageId=' + pageID + '&userId=' + STUDENT_ID;
  let postData = () => {
    //eslint-disable-next-line
    function onSuccess(response) {
      console.log(response);
    }
    //eslint-disable-next-line
    function onFailure() {
      console.log('Error')
    }
    //eslint-disable-next-line
    let data = {
      body: reflection.prompts
    }

    //TODO post(setFetchScenariosResponse, (endpointPost), onFailure, onSuccess, data)
    setSavedAnswers(true);
  }

  console.log(savedAnswers);
  console.log(reflection);

  let updateResponse = (e,id) => {  
    setReflection(prev => {
    for(let i = 0; i < questions.length; ++i){ 
      if(questions[i].id === id){
        questions[i].response = e.target.value;
        break;
      }
    }
    return prev;
    })
  }

  const Buttons = (
    <Grid container direction="row" justify="space-between">
      <Grid item className={classes.backButton}>
        <Button
          variant="contained"
          color="primary"
          disableElevation
          onClick={() => getPrevPage(prevPageEndpoint, contextObj.pages)}
        >
          Back
        </Button>
      </Grid>
      <Grid item className={classes.nextButton}>
        <Button
          variant="contained"
          disabled={!savedAnswers}
          disableElevation
          color="primary"
          onClick={() => getNextPage(nextPageEndpoint, contextObj.activeIndex, contextObj.pages)}
        >
          Next
        </Button>
      </Grid>
    </Grid>
  );
  return (
    <div>
      {Buttons}
      <Grid container direction="row" justify="center" alignItems="center">
        <Box mt={5}>
          <TextTypography variant="h4" align="center" gutterBottom>
            {pageTitle}
          </TextTypography>
        </Box>
      </Grid>
      <Grid containerstyle={{width:'100%'}}>
        <Grid item style={{width:'100%'}}>
          { <div dangerouslySetInnerHTML={{ __html: body }} /> }
        </Grid>
      </Grid>

      <Grid container style={{width:'100%'}}>
        <Grid item style={{width:'100%'}}>         
          {questions.map(prompt => (
            <Box m="2rem" p={1} className={classes.textBox} key={prompt.id}>
              <p>{prompt.reflection_question}</p>
              <TextField
                style={{ width: '100%' }}
                id="outlined-multiline-static"
                label="Answer"
                multiline
                defaultValue={prompt.response}
                variant="outlined"
                onChange={(e) => {updateResponse(e, prompt.id)}}
              />
            </Box>
          ))}
          <Grid container justify="center" alignItems="center" >
            <Button
              variant="contained"
              color='primary'
              justify='right'
              disabled={savedAnswers}
              onClick={postData} 
            >
              Submit Answers
            </Button> 
          </Grid>  
        </Grid>
      </Grid>
    </div>
  );
}
