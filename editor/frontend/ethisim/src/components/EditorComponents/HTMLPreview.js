import React, { useState } from 'react';
import {
  Typography,
  Box,
  Grid,
  Button,
  makeStyles,
  Dialog,
  DialogTitle,
  DialogActions,
  TextField,
} from '@material-ui/core';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import Slide from '@material-ui/core/Slide';
import PropTypes from 'prop-types';
import OpenWithIcon from '@material-ui/icons/OpenWith';

const Transition = React.forwardRef((props, ref) => (
  <Slide direction="up" ref={ref} {...props} />
));

const useStyles = makeStyles((theme) => ({
  textBox: {
    overflowY: 'auto',
    maxHeight: window.innerHeight * 0.6,
    marginTop: theme.spacing(4),
    borderRadius: '5px',
    boxShadow: '0px 0px 2px',
  },
  button: {
    margin: theme.spacing(0.5),
    textTransform: 'unset',
  },
  exitOutButton: {
    marginLeft: 'auto',
    float: 'right',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  buttonChoice: {
    width: '100%',
    textTransform: 'unset',
  },
}));

HTMLPreview.propTypes = {
  body: PropTypes.string.isRequired,
  title: PropTypes.string,
  questions: PropTypes.array,
  choices: PropTypes.array,
  dialogTitle: PropTypes.string,
};

export default function HTMLPreview(props) {
  HTMLPreview.propTypes = props.data;
  const classes = useStyles();
  const data = props;
  // func is the function that occurs when user wants to leave without saving changes
  const {
    body, title, questions, choices, dialogTitle, isFlowDiagram,
  } = data;
  const [open, setOpen] = useState(false);

  // Func that closes the popup window
  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <div className={classes.container}>
      { isFlowDiagram ? (
        <Button
          id="button"
          variant="contained"
          color="primary"
          onClick={handleOpen}
          className={classes.button}
        >
          <OpenWithIcon />
        </Button>
      )
        : (
          <Button
            className={classes.button}
            variant="contained"
            color="primary"
            onClick={handleOpen}
          >
            {dialogTitle || 'Page Preview'}
          </Button>
        )}
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
        fullWidth
        maxWidth="lg"
      >
        <DialogTitle disableTypography style={{ display: 'flex' }}>
          <Typography
            variant="h5"
            align="center"
            component="div"
            style={{ display: 'flex' }}
          >
            Page Preview
          </Typography>
          <Button
            className={classes.exitOutButton}
            variant="contained"
            color="primary"
            onClick={handleClose}
          >
            <HighlightOffIcon />
          </Button>
        </DialogTitle>
        {title
          ? (
            <Box mt={5}>
              <Grid container direction="row" justify="center" alignItems="center">
                <Typography variant="h4" align="center" gutterBottom>
                  {title}
                </Typography>
              </Grid>
            </Box>
          )
          : null}
        <Grid container spacing={2} style={{ width: '100%' }}>
          <Grid item style={{ width: '100%', margin: '2%' }}>
            <div dangerouslySetInnerHTML={{ __html: body.replace(/\\"/g, '"') }} />
          </Grid>
        </Grid>
        <Grid item style={{ width: '100%' }}>
          {questions ? questions.map((q) => (
            <Box m="2rem" p={1} className={classes.textBox} key={q.RQ_ID}>
              <p>{q.REFLECTION_QUESTION}</p>
              <TextField
                style={{ width: '100%' }}
                id="outlined-multiline-static"
                label="Answer"
                multiline
                variant="outlined"
              />
            </Box>
          )) : null}
        </Grid>
        {choices
          ? (
            <Box mx="auto" style={{ width: '100%' }}>
              {choices.map((choice) => (
                <Box p={3} key={choice.APC_ID}>
                  <Button
                    variant="outlined"
                    color="primary"
                    className={classes.buttonChoice}
                    size="large"
                  >
                    {choice.CHOICE}
                  </Button>
                </Box>
              ))}
            </Box>
          ) : null}
        <DialogActions>
          <Button onClick={handleClose} color="primary" style={{ textTransform: 'unset' }}>
            <Typography variant="h6">
              Exit
            </Typography>
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
