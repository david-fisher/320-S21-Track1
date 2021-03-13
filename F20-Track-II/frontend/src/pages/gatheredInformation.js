import React from "react";
import { withStyles, Typography, Box, Button, Grid } from "@material-ui/core";

const TextTypography = withStyles({
  root: {
    color: "#373a3c"
  }
})(Typography);

const introText = "You've chosen to delay starting the project in order to get more information. You realize that there are a number of stakeholders with whom you could have a face-to-face conversation with.\n\nThere is just enough time for you to hear from a select few different people and still complete your task assignment within the deadline. You should hear from at least one person.\n\nIn the following screen, you will be presented with several possible stakeholders. Each stakeholder that you choose to hear from will share their professional knowledge and opinions based on their individual perspective. Time is short, so be mindful of who is best positioned to fill in your understanding of the project and who will help you think critically about your assigned task.\n\nMake your selected on the next screen.";


function GatheredInformation({pages, setPages, activePage, setActivePage}) {
  let goToInitialAction = ()=>{
    if(pages.initialAction.completed){
      if(!pages.initialAction.visited) {
          setPages(prevPages => {
            let copy = {...prevPages};
            copy.initialAction.visited = true;
            return copy;
          });
        }
        setActivePage(prevPage => 'initialAction')
    }
  }
  function goToStakeholders(){
    if (!pages.stakeholders.visited) {
      setPages(prevPages => {
        let copy = {...prevPages};
        copy.stakeholders.visited = true;
        return copy;
      });
    }
    setActivePage(prevPage => 'stakeholders')
  }

  return (
    <div>
      <Grid container direction="row" justify="center" alignItems="center">
        <Box mt = {5}>
          <TextTypography variant="h4" align="center" gutterBottom>
            Gathered Information
          </TextTypography>
        </Box>
      </Grid>
      <Grid container direction="row" justify="space-between">
        <Grid item style={{ marginRight: "0rem", marginTop: "-3rem" }}>
          <Button variant="contained" disableElevation onClick={goToInitialAction}>Back</Button>
        </Grid>
        <Grid item style={{ marginRight: "0rem", marginTop: "-3rem" }}>
          <Button variant="contained" disableElevation color="primary" onClick={goToStakeholders} >Next</Button>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item lg={12}>
          <Box p={2}>
            <TextTypography variant="body1" style={{whiteSpace: 'pre-wrap'}}>{introText}</TextTypography>
          </Box>
        </Grid>
      </Grid>
    </div>
  );
}

export default GatheredInformation;