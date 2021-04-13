import React, { useState } from "react";
import { Box, Grid, Typography , withStyles, Button, FormHelperText } from '@material-ui/core';
import HTMLRenderer from "./htmlRenderer";

const alignMiddle = {
  position: 'fixed',
  left: '50%',
  top: '50%',
  transform: 'translate(-50%, -50%)',
}

const TextTypography = withStyles({
  root: {
    color: "#373a3c",
    whiteSpace: "pre-line",
    textAlign: 'left'
  },
})(Typography);

// onChange={(event) => {
//   setTestInput3(event.target.value);

function getQuestions(questionArr, responses, setResponses, previouslyResponded) {
  let arr = [];
  for (let i = 0; i < questionArr.length; i++) {
    const question = questionArr[i];
    arr.push(
      <div>
        <p><b>{question.text}</b></p>
        <textarea disabled={previouslyResponded} id={question.id} value={responses[question.id]} onChange={event => {
          const target = event.target
          setResponses((reses) => {
            let newObj = {...reses};
            newObj[target.id] = target.value;
            return newObj;
          });
        }}
          rows="4" cols="90" style={{ resize: "none" }}></textarea>
      </div>
    )
  }
  return arr;
}

export default function StateTextFields(props) {

  const previouslyResponded = Object.keys(props.prevResponses).length > 0;

  const [responses, setResponses] = React.useState({});
  const [error, setError] = React.useState(false);
  let header = props.header;
  const [helperText, setHelperText] = React.useState('');

  React.useEffect(() => {
    setResponses(props.questions.reduce((prev, question) => {
      prev[question.id] = (previouslyResponded && props.prevResponses[question.id] !== undefined) 
        ? props.prevResponses[question.id] : '';
      return prev;
    }, {}));
  }, [props.prevResponses])

  let qAndA = getQuestions(props.questions, responses, setResponses, previouslyResponded);

  const handleSubmit = (event) => {
    event.preventDefault();
    if(!Object.values(responses).includes('') && Object.keys(responses).length === props.questions.length){
      props.handleResponse(responses).then(res => {
        if(props.nextPageName !== 'home'){
          props.pages[props.nextPageName].completed = true;
        }
        props.nextPage();
      }).catch(err => alert(err));
    }else{
      setError(true);
      setHelperText('Please provide a response.');
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item lg={12}>
          {/* <TextTypography variant="body1" align="center">
            {header}
          </TextTypography> */}
          <HTMLRenderer html={header}/>
        </Grid>
        <Grid item lg={12}>
          <TextTypography variant="body1" align="center">
            {qAndA}
          </TextTypography>
        </Grid>
        <Grid item lg={12}>
        <FormHelperText>{helperText}</FormHelperText>
          <Button type="submit" variant="outlined" color="primary">
            Submit
          </Button>
        </Grid>
      </Grid>
    </form>


  );
}
