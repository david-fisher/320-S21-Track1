import axios from "axios";
import { BACK_URL, STUDENT_ID, SCENARIO_ID } from "../constants/config";
import get from '../universalHTTPRequests/get';
import React,{useEffect,useState} from "react";
import {
  withStyles,
  Typography,
  Box,
  Grid,
  Button,
  makeStyles,
} from "@material-ui/core";
import HTMLRenderer from './components/htmlRenderer';
import RefreshIcon from '@material-ui/icons/Refresh';
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
  errorContainer: {
    marginTop: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  }
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

function ProjectAssignment({ pages, setPages, prevPageID, activePage, setActivePage, version_id, nid }) {

  const [task, setTask] = React.useState("");
  const [scenarios, setScenarios] = React.useContext(ScenariosContext);
  const [value, setValue] = useState(activePage);


  const classes = useStyles();
  function goToPrevPage() {
    if (!pages[prevPageID].visited) {
      setPages((prevPages) => {
        let copy = { ...prevPages };
        copy[prevPageID].visited = true;
        return copy;
      });
    }
    setActivePage((prevPage) => prevPageID);
  }
  function goToInitialReflection() {
    if (!pages[project.project_page[0].next].visited) {
      setPages((prevPages) => {
        let copy = { ...prevPages };
        copy[activePage].completed = true;
        copy[project.project_page[0].next].visited = true;
        return copy;
      });
    }
    setActivePage((prevPage) => project.project_page[0].next);
    setValue(project.project_page[0].next);
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


  // MAKE API CALL
  let pageId = pages[activePage].pid
  const endpointGet = '/scenarios/task?versionId='+version_id+'&pageId='+(activePage)

  const [project, setIntro] = useState({     //temporary array of intro
    project_page: [{
      title: " ",
      body: " ",
      next: 2,
    }]
  });

  const [fetchScenariosResponse, setFetchScenariosResponse] = useState({
    data: null,
    loading: false,
    error: false,
  });
  const [shouldFetch, setShouldFetch] = useState(0);

  //Get PJ assignment Page
  let getData = () => {
    function onSuccess(response) {
      //pages["initialReflection"].pid = response.data.result.map((data)=> data.next_page)
      let ppage = response.data.result.map((data) => (
        {
          title: data.page_title,
          body: data.body,
          next: data.next_page,
        }
      ));
      let pp = {
        project_page: ppage,
      }
      setIntro(pp);
      debugger;
    }

    function onFailure() {
      //setErrorBannerMessage('Failed to get scenarios! Please try again.');
      //setErrorBannerFade(true);
    }
    get(setFetchScenariosResponse, (endpointGet), onFailure, onSuccess);
  };


  useEffect(getData, [shouldFetch]);

  if (fetchScenariosResponse.error) {
    return (
      <div className={classes.errorContainer}>
        <Box mt={5}>
          <Grid container direction="row" justify="center" alignItems="center">
            <TextTypography variant="h4" align="center" gutterBottom>
              Error fetching scenario data.
            </TextTypography>
          </Grid>
        </Box>
        <Button
          variant="contained"
          color="primary"
          onClick={getData}
        >
          <RefreshIcon className={classes.iconRefreshLarge} />
        </Button>
      </div>)
  }

  return (
    <div>
      <Grid container direction="row" justify="center" alignItems="center">
        <Box mt={5}>
          <TextTypography variant="h4" align="center" gutterBottom>
            {project.project_page[0].title}
          </TextTypography>
        </Box>
      </Grid>
      <Grid container direction="row" justify="space-between">
        <Grid item style={{ marginRight: "0rem", marginTop: "-3rem" }}>
          <Button
            variant="contained"
            disableElevation
            onClick={goToPrevPage}
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
          {project.project_page.map(page => (
            <Box p={2} className={classes.textBox}>
              {/* <TextTypography variant="body1">{upperText}</TextTypography> */}
              {/* <>{textList}</> */}
              {/* <HTMLRenderer html={task}/> */}
              <p>{page.body}</p>
            </Box>
          ))}
        </Grid>
      </Grid>
    </div>
  );
}

export default ProjectAssignment;
