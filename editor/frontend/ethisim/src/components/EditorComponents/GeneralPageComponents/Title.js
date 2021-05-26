import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, TextField } from '@material-ui/core';
import PropTypes from 'prop-types';
import GlobalUnsavedContext from '../../Context/GlobalUnsavedContext';

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(1),
  },
}));

Title.propTypes = {
  title: PropTypes.string,
};

export default function Title(props) {
  const classes = useStyles();
  Title.propTypes = props.data;
  const { title } = props;
  const { setTitle } = props;
  const { error } = props;
  const { errorMessage } = props;
  const { disabled } = props;
  // eslint-disable-next-line
    const [globalUnsaved, setGlobalUnsaved] = useContext(GlobalUnsavedContext);

  const handleChange = (content) => {
    setTitle(content.target.value);
    setGlobalUnsaved(true);
  };

  return (
    <div className={classes.root}>
      <Typography variant="h4">Page Name</Typography>
      {error ? (
        <TextField
          error
          helperText={errorMessage}
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="title"
          label="Title of component"
          value={title}
          onChange={handleChange}
          name="title"
          disabled={disabled}
        />
      ) : (
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="title"
          label="Title of component"
          value={title}
          onChange={handleChange}
          name="title"
          disabled={disabled}
        />
      )}
    </div>
  );
}
