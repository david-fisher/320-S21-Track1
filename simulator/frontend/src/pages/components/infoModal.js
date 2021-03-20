import React, {useState} from 'react';
import {Dialog, IconButton, Button, Typography, withStyles} from '@material-ui/core';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import CloseIcon from '@material-ui/icons/Close';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/core/styles';

const styles = (theme) => ({
    root: {
      margin: 0,
      padding: theme.spacing(2),
    },
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: '#444e58',
    }
  });
  
  const font = createMuiTheme({
    palette: {
      primary: {
        main: '#5b7f95'
      }
    }
    });

  const DialogTitle = withStyles(styles)((props) => {
    const { children, classes, onClose, ...other } = props;
    return (
      <MuiDialogTitle disableTypography className={classes.root} {...other}>
        <Typography variant="h6">{children}</Typography>
        {onClose ? (
          <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
            <CloseIcon />
          </IconButton>
        ) : null}
      </MuiDialogTitle>
    );
  });

  const DialogContent = withStyles((theme) => ({
    root: {
      padding: theme.spacing(2),
    },
  }))(MuiDialogContent);
  
  const DialogActions = withStyles((theme) => ({
    root: {
      margin: 0,
      padding: theme.spacing(1),
    },
  }))(MuiDialogActions);

  // const modalTitle = "Introduction";
//   const inputText = "Some paragraph";


export default function InfoModal({getContent, info}) {
    const [open, setOpen] = React.useState(false);

    const modalTitle = info.name;
    const [content, setContent] = React.useState((<Typography>test</Typography>));

    const handleClickOpen = () => {
      getContent(info).then(res => {
        setContent(content => res);
        setOpen(true);
      });
    };
    const handleClose = () => {
      setOpen(false);
    };
      
    return (
        <div>
            <ThemeProvider theme = {font}>
                <Button color="primary" onClick={handleClickOpen}>
                        {modalTitle}
                </Button>
            </ThemeProvider>
            <Dialog fullWidth = {true} onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
                <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                    {modalTitle}
                </DialogTitle>
                <DialogContent dividers>
                    {content}
                </DialogContent>
            </Dialog>
        </div>
    );
}