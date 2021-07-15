import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import {
  withStyles,
  Typography,
  Box,
  Grid,
  Button,
  makeStyles,
} from '@material-ui/core';
import InnerHTML from 'dangerously-set-html-content';
import GlobalContext from '../../Context/GlobalContext';
import { Link } from 'react-router-dom';

const TextTypography = withStyles({
  root: {
    color: '#373a3c',
    whiteSpace: 'pre-line',
  },
})(Typography);

const useStyles = makeStyles((theme) => ({
  backButton: {
    marginLeft: '0rem',
    marginRight: '0rem',
    marginTop: '1rem',
  },
  nextButton: {
    marginRight: '0rem',
    marginTop: '1rem',
  },
}));

GenericPage.propTypes = {
  isIntro: PropTypes.bool.isRequired,
  pageTitle: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  getNextPage: PropTypes.func,
  getPrevPage: PropTypes.func,
  nextPageEndpoint: PropTypes.string.isRequired,
  prevPageEndpoint: PropTypes.string,
};
export default function GenericPage({
  isIntro,
  pageTitle,
  body,
  getNextPage,
  getPrevPage,
  nextPageEndpoint,
  prevPageEndpoint,
}) {
  const classes = useStyles();
  // eslint-disable-next-line
  let [contextObj, setContextObj] = useContext(GlobalContext);


  const Buttons = (
    <Grid container direction="row" justify="space-between">
      <Grid item className={classes.backButton}>
        {isIntro ? null : (
          <Button
            variant="contained"
            disableElevation
            color="primary"
            onClick={() => getPrevPage(contextObj.activeIndex - 1)}
          >
            Back
          </Button>
        )}
      </Grid>
      
      <Grid item className={classes.nextButton}>
      {nextPageEndpoint ? (
        <Button
          variant="contained"
          disableElevation
          color="primary"
          onClick={() => getNextPage(
            nextPageEndpoint,
            contextObj.activeIndex,
            contextObj.pages,
            contextObj.sessionID,
          )}
        >
          Next
        </Button>
        ) : (
        <Button
          variant="contained"
          disableElevation
          color="primary"
          component={Link}
          to={{
            pathname: '/dashboard',
          }}
        >
          Exit
        </Button> )}
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
      <Grid container spacing={2} style={{ width: '100%' }}>
        <Grid item style={{ width: '100%' }}>
          <InnerHTML html={body.replace(/\\"/g, '"')} />
        </Grid>
      </Grid>
    </div>
  );
}
