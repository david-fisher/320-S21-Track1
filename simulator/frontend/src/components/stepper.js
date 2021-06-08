import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import {
  makeStyles,
  Typography,
  Paper,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  StepConnector,
  Button,
  Box,
} from '@material-ui/core';
import GlobalContext from '../Context/GlobalContext';
import useWindowDimensions from './windowDimension';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
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
    '&$completed': {
      color: '#881C1C',
    },
    '&$active': {
      color: '#881C1C',
    },
    '&$disabled': {
      color: '#444e58',
    },
  },
}));

function getSteps(pages, navigatePageFunc) {
  const stepArr = [];
  // console.log(pages);
  for (let i = 0; i < pages.length; i++) {
    const buttonName = pages[i].title;
    stepArr.push(
      <Button
        style={{ color: '#881c1c' }}
        onClick={() => navigatePageFunc(i)}
      >
        {buttonName}
      </Button>,
    );
  }
  return stepArr;
}
// eslint-disable-next-line
function getStepContent(step) {
  switch (step) {
    case 0:
      return '';
    case 1:
      return '';
    case 2:
      return '';
    default:
      return '';
  }
}

VerticalLinearStepper.propTypes = {
  setActivePage: PropTypes.func.isRequired,
};
export default function VerticalLinearStepper({ setActivePage }) {
  // <Stepper activePage={activePage} pages={pages} />
  const classes = useStyles();
  const { width } = useWindowDimensions();
  // eslint-disable-next-line
  let [contextObj, setContextObj] = useContext(GlobalContext);
  const { pages, activeIndex } = contextObj;
  function navigatePage(index) {
    setActivePage(index);
  }

  const steps = getSteps(pages, navigatePage);
  return (
    <div className={classes.root}>
      <Box mt={3} ml={1}>
        <Stepper activeStep={activeIndex} connector={width > 800 && <StepConnector />} orientation={width > 800 ? 'vertical' : 'horizontal'}>
          {steps.map((label, index) => (
            <Step
              key={index}
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
              {width > 800 && (
              <StepContent>
                <Typography>{}</Typography>
                <div className={classes.actionsContainer}>
                  <div />
                </div>
              </StepContent>
              )}
            </Step>
          ))}
        </Stepper>
        {activeIndex !== 0 && activeIndex === steps.length && (
          <Paper square elevation={0} className={classes.resetContainer}>
            <Typography>All steps completed - you&apos;re finished</Typography>
          </Paper>
        )}
      </Box>
    </div>
  );
}
