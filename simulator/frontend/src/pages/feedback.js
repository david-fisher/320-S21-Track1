import React from "react";
import { withStyles,Typography, Box, Grid, Button} from "@material-ui/core";
import RadarPlot from "./radarPlot.js";
import ScrollableTabsButtonAuto from "./components/feedback_tabs";

const TextTypography = withStyles({
  root: {
    color: "#373a3c"
  }
})(Typography);

function Feedback({pages, setPages, prevPageID, nextPageID, activePage, version_id, setActivePage}) {
  
  function goToPrevPage(){
    if (!pages[prevPageID].visited) {
      setPages(prevPages => {
        let copy = {...prevPages};
        copy[prevPageID].visited = true;
        return copy;
      });
    }
    setActivePage(prevPage => prevPageID)
  }

  function goToNextPage(){
    if (!pages[nextPageID].visited) {
      setPages(prevPages => {
        let copy = {...prevPages};
        copy[nextPageID].visited = true;
        return copy;
      });
    }
    setActivePage(prevPage => nextPageID)
  }

  let Summary_Value = 2.03;
  let Coverage = { Safety: 0.5, Salary: 0.667, Reputation: 1.0, Privacy: 0.8 };

  return (
    <div>
      <Grid container direction="row" justify="center" alignItems="center">
        <Box mt={5}>
          <TextTypography variant="h4" align="center" gutterBottom>
            Coverage of Issues
          </TextTypography>
        </Box>
      </Grid>
      <Grid container direction="row" justify="space-between">
        <Grid item style={{ marginRight: "0rem", marginTop: "-3rem" }}>
          <Button variant="contained" disableElevation onClick={goToPrevPage}>Back</Button>
        </Grid>
        <Grid item style={{ marginRight: "0rem", marginTop: "-3rem" }}>
          <Button variant="contained" disableElevation color="primary" onClick={goToNextPage}>Next</Button>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid lg={12}>
          <Box m="2rem">
            <RadarPlot version_id={version_id} />
          </Box>
          {/* <TextTypography variant="body1">
          </TextTypography> */}
        </Grid>
      </Grid>
      {/* <Grid container spacing={2}>
        <Grid lg={12}>
          <ScrollableTabsButtonAuto/>
        </Grid>
      </Grid> */}
    </div>
  );
}

export default Feedback;