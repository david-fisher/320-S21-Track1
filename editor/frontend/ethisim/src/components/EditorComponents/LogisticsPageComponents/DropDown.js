import React from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import Checkbox from '@material-ui/core/Checkbox';
import PropTypes from 'prop-types';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" color="primary" />;

const useStyles = makeStyles((theme) => ({
  root: {
    width: 500,
    '& > * + *': {
      marginTop: theme.spacing(3),
    },
  },
}));

Tags.propTypes = {
  update: PropTypes.func,
  courses: PropTypes.array,
  current: PropTypes.array,
};

export default function Tags(props) {
  const classes = useStyles();

  const onTagsChange = (event, values) => {
    props.update(values);
  };

  return (
    <div className={classes.root}>
      <Autocomplete
        multiple
        id="checkboxes-tags-demo"
        options={props.courses.sort((a, b) => a.COURSE.toString().localeCompare(b.COURSE.toString()))}
        disableCloseOnSelect
        getOptionLabel={(option) => option.NAME}
        getOptionSelected={(option, value) => option.COURSE === value.COURSE}
        onChange={onTagsChange}
        value={props.current}
        renderOption={(option, { selected, inputValue }) => (
          <>
            <Checkbox
              icon={icon}
              checkedIcon={checkedIcon}
              style={{ marginRight: 8 }}
              checked={selected}
            />
            {option.NAME}
          </>
        )}
        style={{ width: 500 }}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            placeholder="Courses"
            fullWidth
          />
        )}
      />
    </div>
  );
}
