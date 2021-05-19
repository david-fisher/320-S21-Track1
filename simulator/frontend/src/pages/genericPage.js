import React, {useContext} from "react";
import {
  withStyles,
  Typography,
  Box,
  Grid,
  Button,
  makeStyles,
} from "@material-ui/core";
import createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import GlobalContext from '../Context/GlobalContext';

const TextTypography = withStyles({
  root: {
    color: "#373a3c",
    whiteSpace: "pre-line",
  },
})(Typography);

const useStyles = makeStyles((theme) => ({
  backButton: {
    marginLeft: "0rem",
    marginRight: "0rem",
    marginTop: "1rem",
  },
  nextButton: {
    marginRight: "0rem",
    marginTop: "1rem"
  }
}));

export default function GenericPage({ isIntro, pageTitle, body, getNextPage, getPrevPage, nextPageEndpoint, prevPageEndpoint }) {  
  const window = (new JSDOM('')).window;
  const DOMPurify = createDOMPurify(window);
  const classes = useStyles();
  let [contextObj, setContextObj] = useContext(GlobalContext);
  body = body.replace(/\\"/g, '"');

  const Buttons = (
    <Grid container direction="row" justify="space-between">
      <Grid
        item
        className={classes.backButton}
      >
        {isIntro ? null: 
          <Button
            variant="contained"
            disableElevation
            color="primary"
            onClick={() => getPrevPage(prevPageEndpoint, contextObj.activeIndex, contextObj.pages)}
          >
            Back
          </Button>
        }
      </Grid>
      <Grid 
        item 
        className={classes.nextButton}
      >
        <Button
          variant="contained"
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
      <Box mt={5}>
        <Grid container direction="row" justify="center" alignItems="center">
          <TextTypography variant="h4" align="center" gutterBottom>
            {pageTitle}
          </TextTypography>
        </Grid>
      </Box>
      <Grid container spacing={2}>
        <Grid item lg={12}>
          { <div dangerouslySetInnerHTML={{ __html: body }} /> }
        </Grid>
      </Grid>
    </div>
  );
}