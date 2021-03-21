import React from "react";
import QA from "./components/q&a";
import {
  withStyles,
  Typography,
  Box,
  Grid,
  Button,
  makeStyles,
} from "@material-ui/core";
import { BASE_URL, STUDENT_ID, SCENARIO_ID }from "../constants/config";
import axios from 'axios';
import { ScenariosContext } from "../Nav";

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
}));

function Reflection({ pages, setPages, activePage, setActivePage,
  content_url, res_url, nextPageID, prevPageID , title}) {

  function goToPage(pageID) {
    if (pages[pageID].completed) {
      if (!pages[pageID].visited) {
        setPages((prevPages) => {
          let copy = { ...prevPages };
          copy[pageID].visited = true;
          return copy;
        });
      }
      setActivePage((prevPage) => pageID);
    }
  }

  const classes = useStyles();

  const [bodyText, setBodyText] = React.useState('');
  const [prompts, setPrompts] = React.useState([]);
  const [promptResponses, setPromptResponses] = React.useState({});
  const [scenarios, setScenarios] = React.useContext(ScenariosContext);

  React.useEffect(() => {
    (async () => {
      await axios({
        method: 'get',
        url: BASE_URL + content_url,
        headers: {
          scenarioID: scenarios.currentScenarioID
        }
      }).then(response => {
        setBodyText(response.data.body_text);
        setPrompts(prev => response.data.prompts);
      }).catch(err => {
        console.log(err);
        alert(err);
      });

      axios({
        method: 'get',
        url: BASE_URL + res_url,
        headers: {
          scenarioID: scenarios.currentScenarioID,
          studentID: STUDENT_ID
        }
      }).then(response => {
        setPromptResponses(response.data.reduce((prev, curr) => {
          prev[curr.prompt_num] = curr.response;
          return prev;
        }, {}));
      }).catch(err => {
        console.log(err);
      });
    })();
  }, [scenarios, activePage]);

  async function handleResponse(data) {
    await axios({
      url: BASE_URL + content_url,
      method: 'put',
      data: {
        scenarioID: scenarios.currentScenarioID,
        studentID: STUDENT_ID,
        data: data
      }
    });
  }

  return (
    <div>
      <Grid container direction="row" justify="center" alignItems="center">
        <Box mt={5}>
          <TextTypography variant="h4" align="center" gutterBottom>
            {title}
          </TextTypography>
        </Box>
      </Grid>
      <Grid container direction="row" justify="space-between">
        <Grid item style={{ marginRight: "0rem", marginTop: "-3rem" }}>
          <Button
            variant="contained"
            disableElevation
            onClick={() => goToPage(prevPageID)}
          >
            Back
          </Button>
        </Grid>
        <Grid item style={{ marginRight: "0rem", marginTop: "-3rem" }}>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item lg={12}>
          <Box m="2rem">
          </Box>
            <QA header={bodyText} questions={prompts} handleResponse={handleResponse}
              nextPage={() => goToPage(nextPageID)} pages={pages} nextPageName={nextPageID}
              prevResponses={promptResponses}/>
        </Grid>
      </Grid>
    </div>
  );
}

export default Reflection;
