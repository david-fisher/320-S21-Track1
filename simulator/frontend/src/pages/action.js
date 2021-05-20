import React, { useState, useContext } from "react";
import { makeStyles, withStyles, Typography, Box, Button, Grid } from "@material-ui/core";
import { STUDENT_ID} from "../constants/config";
import post from '../universalHTTPRequests/post';
import GlobalContext from '../Context/GlobalContext';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    color: "#5b7f95"
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
  },
  button: {
    width: '100%',
    textTransform: 'unset',
  }
}));

const TextTypography = withStyles({
  root: {
    color: "#373a3c"
  }
})(Typography);

export default function Action({ versionID, pageID, pageTitle, body, choices, choiceChosen, getNextPage, getPrevPage, prevPageEndpoint }) {
  // eslint-disable-next-line
  let [contextObj, setContextObj] = useContext(GlobalContext);
  body = body.replace(/\\"/g, '"');
  choices = [
    {
     "choices_id": 1000, 
     "choice_text": "Approve project assignment and work on it immediately to save time.",
     "next_page": 9000
    }, 
    {
      "choices_id": 2000, 
      "choice_text": "Postpone and ask questions from stakeholders.",
      "next_page": 6000
    },
  ]
  // eslint-disable-next-line
  const [chosenAction, setChosenAction] = React.useState(-1);
  // eslint-disable-next-line
  const [fetchActionResponse, setFetchActionResponse] = useState({
     data: null,
     loading: false,
     error: false,
   });
   // MAKE API CALL
   // let pageId = activePage
   // const endpointGet = '/scenarios/action/prompt?versionId='+version_id+'&pageId='+(activePage)// version id hardcoded
   // const endpointGet2 = '/scenarios/action?versionId='+version_id+'&pageId='+(activePage)+'&userId='+STUDENT_ID
  // eslint-disable-next-line
   const endpointPost = '/scenarios/action?versionId='+versionID+'&pageId='+(pageID)
   const endpointSess = `/scenarios/session/start?userId=${STUDENT_ID}&versionId=${versionID}`
 
   const getAction = (selectedAction, nextPageID) => {
     console.log(pageID);
    function startSess(response) {
      // do nothing
    }
    // eslint-disable-next-line
    function onSuccess(response) {
      // Right now hardcoded for middle reflection
      // pages["middleReflection"].pid = parseInt(pages[activePage].pid)+4 // Set next page id
      // eslint-disable-next-line
      let body = ({
         response_id: response.data.result.response_id,
         choice: response.data.result.choice,
         choice_text: response.data.result.choice_text,
         next: response.data.result.next_page,
      })
      console.log(response);
      setChosenAction((cur) => selectedAction);
    }
    function onFailure() {
      // setErrorBannerMessage('Failed to get scenarios! Please try again.');
      // setErrorBannerFade(true);
    }
    if(!choiceChosen) {
      post(setFetchActionResponse, endpointSess, onFailure, startSess)
      // TODO Remove once post request finishes
      getNextPage(`/scenarios/task?versionId=${versionID}&pageId=${nextPageID}`, contextObj.activeIndex, contextObj.pages);
      // eslint-disable-next-line
      let body = {"choice_id" : selectedAction, "user_id" : STUDENT_ID};
      // TODO post(setFetchActionResponse, endpointPost, onFailure, onSuccess, JSON.stringify(body));
    }
   }
 
  const classes = useStyles();

  const Buttons = (
    <Grid container direction="row" justify="space-between">
      <Grid
        item
        className={classes.backButton}
      >
        <Button
          variant="contained"
          disableElevation
          color="primary"
          onClick={() => getPrevPage(prevPageEndpoint, contextObj.pages)}
        >
          Back
        </Button>
      </Grid>
      <Grid 
        item 
        className={classes.nextButton}
      >
        <Button
          variant="contained"
          disableElevation
          color="primary"
          disabled={!choiceChosen}
          onClick={() => getNextPage(`/scenarios/task?versionId=${versionID}&pageId=${choiceChosen}`, contextObj.activeIndex, contextObj.pages)}
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
      <Grid container spacing={2}>
        <Grid item style={{width:'100%'}}>
          <Grid item style={{width:'100%'}}>
            <div dangerouslySetInnerHTML={{ __html: body }} />
          </Grid>
            <Box mx="auto">
            {choices.map((choice) => (
              <Box p={3} key={choice.choices_id}>
                <Button
                  variant="outlined"
                  color="primary"
                  disabled={choice.choices_id === choiceChosen}
                  className={classes.button}
                  size="large"
                  onClick={() => getAction(choice.choices_id, choice.next_page)} // save choice and do something According to this choice
                >
                  {choice.choice_text}
                </Button> 
              </Box>
            ))}
            </Box>
        </Grid>
      </Grid>
    </div>
  );
}
