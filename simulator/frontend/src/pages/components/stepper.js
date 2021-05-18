import React from "react";
import {
  makeStyles,
  Typography,
  Paper,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  Box,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  actionsContainer: {
    marginBottom: theme.spacing(2),
  },
  resetContainer: {
    padding: theme.spacing(3),
  },
  step: {
    "&$completed": {
      color: "#881C1C",
    },
    "&$active": {
      color: "#881C1C",
    },
    "&$disabled": {
      color: "#444e58",
    },
  },
  active: {},
  completed: {},
  disabled: {},
}));

function getSteps(pages, navigatePageFunc) {
  let stepArr = [];
  let keys = Object.keys(pages);

  for (let i = 0; i < keys.length; i++) {
    let buttonName = pages[keys[i]].title;
    if (pages[keys[i]].visited === false) {
      stepArr.push(<Button disabled>{buttonName}</Button>);
    } else {
      stepArr.push(<Button style={{ color: "#881c1c" }} onClick={() => navigatePageFunc(keys[i])} >{buttonName}</Button>);
    }
  }
  return stepArr;
}

function getStepContent(step) {
  switch (step) {
    case 0:
      return ``;
    case 1:
      return "";
    case 2:
      return ``;
    default:
      return "";
  }
}

export default function VerticalLinearStepper(props) {
  // <Stepper activePage={activePage} pages={pages} />
  const classes = useStyles();
  // eslint-disable-next-line
  const [activeStep, setActiveStep] = React.useState(props.pages[props.activePage].pageNumber);
  
  function navigatePage(pageID){
    //if(props.pages[pageID].completed){
      if (!props.pages[pageID].visited) {
        props.setPages(prevPages => {
          let copy = {...prevPages};
          copy[pageID].visited = true;
          return copy;
        });
      }
      props.setActivePage(pageID)
    //}
  }

  const steps = getSteps(props.pages, navigatePage);
  return (
    <div className={classes.root}>
      <Box mt={3} ml={1}>
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((label, index) => (
            <Step key={label}
              classes={{
                root: classes.step,
                completed: classes.completed,
                active: classes.active,
              }}
            >
              <StepLabel
                StepIconProps={{
                  classes: {
                    root: classes.step,
                    completed: classes.completed,
                    active: classes.active,
                  },
                }}
              >
                {label}
              </StepLabel>
              <StepContent>
                <Typography>{}</Typography>
                <div className={classes.actionsContainer}>
                  <div></div>
                </div>
              </StepContent>
            </Step>
          ))}
        </Stepper>
        {activeStep === steps.length && (
          <Paper square elevation={0} className={classes.resetContainer}>
            <Typography>All steps completed - you&apos;re finished</Typography>
          </Paper>
        )}
      </Box>
    </div>
  );
}
