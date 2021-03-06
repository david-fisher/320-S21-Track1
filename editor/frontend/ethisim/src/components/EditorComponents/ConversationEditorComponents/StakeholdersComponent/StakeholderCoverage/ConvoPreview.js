import React, { useState, useEffect } from 'react';
import {
  withStyles,
  Typography,
  Box,
  Grid,
  Button,
  makeStyles,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Checkbox,
} from '@material-ui/core';
import InnerHTML from 'dangerously-set-html-content';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import Slide from '@material-ui/core/Slide';
import PropTypes from 'prop-types';
import ErrorBanner from '../../../../Banners/ErrorBanner';
import get from '../../../../../universalHTTPRequests/get';

const TextTypography = withStyles({
  root: {
    color: '#373a3c',
    whiteSpace: 'pre-line',
  },
})(Typography);

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
  card: {
    width: 600,
    height: 125,
    wordBreak: 'break-word',
    display: 'flex',
    borderRadius: '35px',
    '&:hover': {
      backgroundColor: '#f3e4e3',
    },
  },
  name: {
    color: '#000000',
    fontWeight: 'fontWeightBold',
  },
  selected: {
    borderRight: '6px solid lime',
  },
  background: {
    color: '#000000',
  },
  job: {
    color: '#881c1c',
    marginBottom: '10px',
  },
  disabled: {
    backgroundColor: '#f9f9f9',
    color: '#c2c2c2',
  },
  shdialog: {
    backgroundColor: 'black',
    borderRadius: '35px',
  },
  dialogName: {
    color: '#000000',
    marginTop: '10px',
    marginBottom: '2px',
    wordBreak: 'break-word',
  },
  dialogJob: {
    color: '#881c1c',
    marginBottom: '15px',
    wordBreak: 'break-word',
  },
  stakeholderContainer: {
    width: '125px',
    marginRight: '20px',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stakeholderImg: {
    height: '90px',
    width: '90px',
    left: '20px',
  },
  infoContainer: {
    paddingTop: '10px',
    marginLeft: '10px',
    maxWidth: '400px',
  },
}));

HTMLPreview.propTypes = {
  name: PropTypes.string.isRequired,
  job: PropTypes.string,
  bio: PropTypes.string,
  mainConvo: PropTypes.string,
  photo: PropTypes.string,
};

export default function HTMLPreview(props) {
  HTMLPreview.propTypes = props.data;
  const classes = useStyles();
  const data = props;
  // func is the function that occurs when user wants to leave without saving changes
  const {
    id, name, job, mainConvo, photo,
  } = data;
  const [open, setOpen] = useState(false);
  const [answer, setAnswer] = useState('');
  const [selectedConversation, setSelectedConversation] = useState(-1);

  // eslint-disable-next-line
  const [getQRsObj, setGetQRsObj] = useState({
    data: null,
    loading: false,
    error: null,
  });

  function getQRs() {
    const getEndpointQRs = `/api/conversations/?STAKEHOLDER=${id}`;
    function onError(resp) {
      setErrorBannerMessage(
        'Failed to get stakeholder questions and answers! Please try again.',
      );
      setErrorBannerFade(true);
    }
    get(setGetQRsObj, getEndpointQRs, onError);
  }
  useEffect(getQRs, []);

  const [errorBannerMessage, setErrorBannerMessage] = useState('');
  const [errorBannerFade, setErrorBannerFade] = useState(false);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setErrorBannerFade(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [errorBannerFade]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedConversation(-1);
  };

  const handleToggle = (value) => () => {
    setSelectedConversation(value);
  };

  const handleSubmit = () => {
    setAnswer(getQRsObj.data.filter((obj) => obj.CONVERSATION === selectedConversation)[0].RESPONSE);
  };

  return (
    <div className={classes.container}>
      <ErrorBanner
        errorMessage={errorBannerMessage}
        fade={errorBannerFade}
      />
      <Button
        className={classes.button}
        variant="contained"
        color="primary"
        onClick={handleOpen}
      >
        Stakeholder Conversation
      </Button>
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
            Stakeholder Preview
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
        <DialogContent>
          <div>
            <Box mt={5}>
              <Grid container direction="column" justify="center" alignItems="center">
                <TextTypography variant="h4" align="center" gutterBottom>
                  Conversation
                </TextTypography>
                <Avatar
                  style={{ height: '100px', width: '100px' }}
                  alt="Stakeholder Photo"
                  src={photo}
                />
                <TextTypography variant="h4" align="center" gutterBottom>
                  {name}
                </TextTypography>
                <TextTypography variant="h5" align="center" gutterBottom>
                  {job}
                </TextTypography>
                <InnerHTML html={mainConvo.replace(/\\"/g, '"')} />
              </Grid>
            </Box>
            <Grid container direction="row" justify="space-between">
              <Grid
                item
                style={{
                  marginLeft: '0rem',
                  marginRight: '0rem',
                  marginTop: '-3rem',
                }}
              />
            </Grid>
            {getQRsObj.data && getQRsObj.data.length > 0
              ? (
                <Grid container spacing={2} style={{ width: '100%' }}>
                  <Grid item lg={12} style={{ width: '100%' }}>
                    <Divider
                      style={{
                        marginTop: '10px',
                        marginBottom: '30px',
                        height: '2px',
                        backgroundColor: 'black',
                      }}
                    />
                    <Box align="left" style={{ width: '100%' }}>
                      <List>
                        {getQRsObj.data.map((value) => {
                          const labelId = `question-${value.CONVERSATION}$`;
                          return (
                            <ListItem
                              alignItems="center"
                              key={value.CONVERSATION}
                              role="listitem"
                              button
                              onClick={handleToggle(value.CONVERSATION)}
                            >
                              <ListItemIcon>
                                <Checkbox
                                  color="primary"
                                  checked={selectedConversation === value.CONVERSATION}
                                />
                              </ListItemIcon>
                              <ListItemText id={labelId} primary={value.QUESTION} style={{ wordBreak: 'break-word' }} />
                            </ListItem>
                          );
                        })}
                      </List>
                      <Button
                        align="left"
                        style={{ marginTop: '15px', marginBottom: '25px' }}
                        variant="outlined"
                        size="medium"
                        color="primary"
                        onClick={handleSubmit}
                        disabled={selectedConversation === -1}
                      >
                        Select
                      </Button>
                    </Box>
                    <Box fontWeight={500}>
                      <Typography variant="h6">
                        Response
                      </Typography>
                    </Box>
                    <Box p={2} className={classes.textBox}>
                      {answer}
                    </Box>
                  </Grid>
                </Grid>
              )
              : null }
            <Grid item style={{ marginLeft: '0rem', marginTop: '1rem', marginBottom: '1rem' }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleClose}
              >
                Return
              </Button>
            </Grid>
          </div>
        </DialogContent>
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
