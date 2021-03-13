import React, { useState } from "react";
import { Button, Grid } from "@material-ui/core";
import Radar from "./chart/chart";

function RadarTest(props) {
  const [input, setInput] = useState(0);
  const [testInput1, setTestInput1] = useState(0);
  const [testInput2, setTestInput2] = useState(0);
  const [testInput3, setTestInput3] = useState(0);


  const scenarioScoringMatrix = {

    Tim: {
      issue1: 1,
      issue2: 4,
      issue3: 2,
    },
    Song: {
      issue1: 0,
      issue2: 2,
      issue3: 3,
    },
  };

  function totalEmphasisF(scenarioScoringMatrix) {
    const totalEmphasis = {};
    for (let conversant in scenarioScoringMatrix) {
      for (let issue in scenarioScoringMatrix[conversant]) {
        totalEmphasis[issue] = scenarioScoringMatrix[conversant][issue] +(
              totalEmphasis[issue]??0);
      }
      return totalEmphasis;
    }
  }
  const totalEmphasis = totalEmphasisF(scenarioScoringMatrix);
  // a perfect student

  function studentEmphasisF(scenarioScoringMatrix) {
    let studentEmphasis = {};
    if (testInput1 === 0 && testInput2 === 0 && testInput3 === 0) {
      for (let conversant in scenarioScoringMatrix) {
        for (let issue in scenarioScoringMatrix[conversant]) {
          studentEmphasis[issue] = scenarioScoringMatrix[conversant][issue] +
                (studentEmphasis[issue]??0);
        }
      }
    } else {
      studentEmphasis = {
        issue1: testInput1,
        issue2: testInput2,
        issue3: testInput3,
      };
    }
    return studentEmphasis;
  }
  let studentEmphasis = studentEmphasisF(scenarioScoringMatrix);

  function coverageF(totalEmphasis, studentEmphasis) {
    const coverage = {};
    for (let issue in totalEmphasis) {
      coverage[issue] = studentEmphasis[issue] / totalEmphasis[issue];
    }
    return coverage;
  }
  let coverage = coverageF(totalEmphasis, studentEmphasis);
  const ethcicalImportance = {
    issue1: 0.5,
    issue2: 0.9,
    issue3: 0.8,
  };

  function summaryValueF(totalEmphasis, ethcicalImportance, coverage) {
    let summaryValue = 0;
    for (let issue in totalEmphasis) {
      summaryValue += ethcicalImportance[issue] * coverage[issue];
    }
    return summaryValue;
  }

  let summaryValue = summaryValueF(
    totalEmphasis,
    ethcicalImportance,
    coverage
  );

  return (
    <div>
      <Grid container>
        <Grid container direction="row" justify="center">
          <h3>Coverage Of Issues</h3>
        </Grid>
        <Grid container direction="row" justify="space-around">
          <Button
            variant="contained"
            disableElevation
            onClick={(e) => {
              e.preventDefault();
              setInput(input + 1);
            }}
          >
            Back
          </Button>
          <Button variant="contained" color="primary" disableElevation>
            Next
          </Button>
        </Grid>
        <Grid container direction="row" justify="center">
          <Radar
            key={testInput1 + testInput2 + testInput3 + ""}
            coverage={coverage}
            summary={summaryValue}

          />
        </Grid>
        <br />
        {/* { <form> */}
        <label>
          Student Issue 1:
          <input
            type="text"
            value={testInput1}
            onChange={(event) => {
              setTestInput1(event.target.value);
            }}
          />
        </label>
        <label>
          Student Issue 2:
          <input
            type="text"
            value={testInput2}
            onChange={(event) => {
              setTestInput2(event.target.value);
            }}
          />
        </label>
        <label>
          Student Issue 3:
          <input
            type="text"
            value={testInput3}
            onChange={(event) => {
              setTestInput3(event.target.value);
            }}
          />
        </label>

        {/* </form> } */}
      </Grid>
    </div>
  );
}

export default RadarTest;
