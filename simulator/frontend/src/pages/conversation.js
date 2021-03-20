import React from "react";
import {
  withStyles,
  Typography,
  Box,
  Grid,
  Button,
  makeStyles,
} from "@material-ui/core";
import { BASE_URL, STUDENT_ID, SCENARIO_ID } from "../constants/config";
import axios from 'axios';
import HTMLRenderer from "./components/htmlRenderer";
import { ScenariosContext } from "../Nav";

const TextTypography = withStyles({
  root: {
    color: "#373a3c",
    whiteSpace: "pre-line",
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

function Conversation({ showStakeholders, setShowStakeholders, stakeholder }) {
    function goToStakeholders() {
        setShowStakeholders(true);
    }

    const [monologue, setMonologue] = React.useState('');
    const [scenarios, setScenarios] = React.useContext(ScenariosContext);

    React.useEffect(() => {
      axios({
        method: "get",
        url: BASE_URL + "/scenarios/stakeholders/conversation",
        headers: {
          scenarioID: scenarios.currentScenarioID,
          studentID: STUDENT_ID,
          stakeholderID: stakeholder.id
        },
      })
      .then((response) => {
        console.log(response.data[0].conversation_text)
        setMonologue(prev => response.data[0].conversation_text);
        console.log(monologue)
      })
      .catch((err) => {
        console.log("err", err);
        alert(err);
      });
    }, [scenarios]);
  
    const classes = useStyles();
  
    return (
      <div>
        <Box mt={5}>
          <Grid container direction="row" justify="center" alignItems="center">
            <TextTypography variant="h4" align="center" gutterBottom>
              {stakeholder.name}
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
            <Box p={2} className={classes.textBox}>
              <HTMLRenderer html={monologue}/>
            </Box>
          </Grid>
        </Grid>
      </div>
    );
  }
  
export default Conversation;