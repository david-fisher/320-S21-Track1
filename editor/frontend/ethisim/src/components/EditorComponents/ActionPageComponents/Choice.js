import React, { useState, useContext } from 'react';
import TextField from '@material-ui/core/TextField';
import { Button } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import PropTypes from 'prop-types';
import GenericDeleteWarning from '../../WarningDialogs/GenericDeleteWarning';
import GlobalUnsavedContext from '../../Context/GlobalUnsavedContext';

QuestionField.propTypes = {
  removeChoice: PropTypes.any,
  choice: PropTypes.any,
  id: PropTypes.number,
  choices: PropTypes.any,
  setChoices: PropTypes.any,
  index: PropTypes.number,
};

export default function QuestionField({
  id,
  choice,
  choices,
  setChoices,
  removeChoice,
  index,
}) {
  const [choiceValue, setQuestionValue] = useState(choice);
  // eslint-disable-next-line
    const [globalUnsaved, setGlobalUnsaved] = useContext(GlobalUnsavedContext);

  const onChangeChoice = (event) => {
    setGlobalUnsaved(true);
    setQuestionValue(event.target.value);
    const choicesArr = [...choices];
    for (let i = 0; i < choicesArr.length; i++) {
      if (choicesArr[i].APC_ID === id) {
        choicesArr[i].CHOICE = event.target.value;
      }
    }
    setChoices(choicesArr);
  };

  // Warning to Delete a choice component
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  return (
    <div>
      <Box display="flex" flexDirection="row" p={1} m={1}>
        <Box p={1} style={{ width: '80%' }}>
          <TextField
            style={{ width: '100%' }}
            label={`Choice ${index}`}
            multiline
            rows={2}
            variant="outlined"
            value={choiceValue}
            onChange={onChangeChoice}
          />
        </Box>
        <Box p={1} style={{ width: '20%' }}>
          <div>
            <Button
              variant="contained"
              color="primary"
              onClick={handleClickOpen}
              style={{ textTransform: 'unset' }}
            >
              Delete
            </Button>
            <GenericDeleteWarning
              remove={() => removeChoice(id)}
              setOpen={setOpen}
              open={open}
            />
          </div>
        </Box>
      </Box>
    </div>
  );
}
