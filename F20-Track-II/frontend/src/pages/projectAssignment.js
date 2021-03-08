import axios from "axios";
import { BASE_URL, STUDENT_ID, SCENARIO_ID } from "../constants/config";
import React from "react";
import {
  withStyles,
  Typography,
  Box,
  Grid,
  Button,
  makeStyles,
} from "@material-ui/core";
import HTMLRenderer from './components/htmlRenderer';
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

const dataHeading = [
  "My Medical Advisor website user interactions",
  "Users' social media content",
  "Other websites' data",
];

const dataText = [
  [
    "Typing speed",
    "Spelling errors",
    "Rate of typing errors",
    "Incidence of repetitive requests",
    "Reading speed",
  ],
  [
    "Posts by and about the user",
    "Picture and videos",
    "Realtionships: Family, significant other, friends",
    "Hobbies, exercise, and other activities",
  ],
  ["Loyalty card purchases", "Browser histories", "Email"],
];

const mainText =
  "Part of your assignment is to identify specific companies who would be willing to provide data and also make recommendations for further data to collect, in order to refine the above list. Once the data is in hand, you will use it to improve the existing predictive model for cognitive decline, by incorporating new training features as appropriate.";

function ProjectAssignment({ pages, setPages, activePage, setActivePage }) {

  const [task, setTask] = React.useState("");
  const [scenarios, setScenarios] = React.useContext(ScenariosContext);

  React.useEffect(() => {
    axios({
      method: "get",
      url: BASE_URL + "/scenarios/task",
      headers: {
        scenarioID: scenarios.currentScenarioID,
        studentID: STUDENT_ID,
      },
    })
    .then((response) => {
      setTask((text) => response.data[0].body_text);
    })
    .catch((err) => {
      console.log("err", err);
      alert(err);
    });
  }, [scenarios])

  const classes = useStyles();
  function goToIntroduction() {
    if (!pages.introduction.visited) {
      setPages((prevPages) => {
        let copy = { ...prevPages };
        copy.introduction.visited = true;
        return copy;
      });
    }
    setActivePage((prevPage) => "introduction");
  }
  function goToInitialReflection() {
    if (!pages.initialReflection.visited) {
      setPages((prevPages) => {
        let copy = { ...prevPages };
        copy.initialReflection.visited = true;
        return copy;
      });
    }
    setActivePage((prevPage) => "initialReflection");
  }

  function getUpperText(headings, subtext) {
    let text = [];
    for (let i = 0; i < headings.length; i++) {
      let temp = "" + (i + 1) + ". " + headings[i] + "\n";
      text.push(<b>{temp}</b>);
      for (let j = 0; j < subtext[i].length; j++) {
        let temp2 =
          "\t" + String.fromCharCode(97 + j) + ". " + subtext[i][j] + "\n";
        text.push(<TextTypography>{temp2}</TextTypography>);
      }
    }
    let temp3 = "\n";
    text.push(<TextTypography>{temp3}</TextTypography>);
    return text;
  }
  //upperText is the indexed text before mainText
  let upperText = getUpperText(dataHeading, dataText);
  const textList = upperText.map((text) => <>{text}</>);

  return (
    <div>
      <Grid container direction="row" justify="center" alignItems="center">
        <Box mt={5}>
          <TextTypography variant="h4" align="center" gutterBottom>
            Project Task Assignment
          </TextTypography>
        </Box>
      </Grid>
      <Grid container direction="row" justify="space-between">
        <Grid item style={{ marginRight: "0rem", marginTop: "-3rem" }}>
          <Button
            variant="contained"
            disableElevation
            onClick={goToIntroduction}
          >
            Back
          </Button>
        </Grid>
        <Grid item style={{ marginRight: "0rem", marginTop: "-3rem" }}>
          <Button
            variant="contained"
            disableElevation
            color="primary"
            onClick={goToInitialReflection}
          >
            Next
          </Button>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item lg={12}>
          <Box p={2} className={classes.textBox}>
            {/* <TextTypography variant="body1">{upperText}</TextTypography> */}
            {/* <>{textList}</> */}
            <HTMLRenderer html={task}/>
          </Box>
        </Grid>
      </Grid>
    </div>
  );
}

export default ProjectAssignment;
