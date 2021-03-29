import React, { useState } from 'react';
import {
    Select,
    MenuItem,
    Grid,
    Button,
    TextField,
    Typography,
    makeStyles,
} from '@material-ui/core';
import EditedSunEditor from '../../components/EditedSunEditor';
import AddIcon from '@material-ui/icons/Add';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
    menuButton: {
        margin: theme.spacing(2),
    },
    addButton: {
        margin: theme.spacing(2),
        float: 'right',
        textTransform: 'unset',
    },
    selectMenu: {
        minWidth: 200,
        magin: theme.spacing(5),
    },
}));

AddNewScenarioPageDialogBody.propTypes = {
    setOpenPopup: PropTypes.any.isRequired,
    addPage: PropTypes.any.isRequired,
};

export default function AddNewScenarioPageDialogBody(props) {
    const classes = useStyles();
    AddNewScenarioPageDialogBody.propTypes = props.data;
    const data = props;
    const { addPage, setOpenPopup } = data;

    // eslint-disable-next-line
    const [anchorEl, setAnchorEl] = useState(null);
    const [pageType, setPageType] = useState('Generic');
    const [pageName, setPageName] = useState('');
    const [pageBody, setPageBody] = useState('');

    const [errorName, setErrorName] = useState(false);
    const [errorNameText, setErrorNameText] = useState('');
    const [errorBody, setErrorBody] = useState(false);

    // eslint-disable-next-line
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleChange = (event) => {
        setPageType(event.target.value);
    };

    const createNewPage = () => {
        let validInput = true;

        if (!pageName || !pageName.trim()) {
            setErrorName(true);
            setErrorNameText('Scenario name cannot be empty');
            validInput = false;
        } else if (pageName.length >= 1000) {
            setErrorName(true);
            setErrorNameText(
                'Scenario name must have less than 1000 characters'
            );
            validInput = false;
        } else {
            setErrorName(false);
        }

        if (!pageBody || !pageBody.trim()) {
            setErrorBody(true);
            validInput = false;
        } else {
            setErrorBody(false);
        }

        if (validInput) {
            addPage(pageType, pageName, pageBody);
            setOpenPopup(false);
        }
    };

    return (
        <div>
            <Grid container direction="row" justify="flex-start">
                <Grid item xs={4}>
                    <Typography variant="h6">Page Type</Typography>
                    <Select
                        className={classes.selectMenu}
                        id="Scenario-Page-Type-Menu"
                        labelId="Scenario-Page-Type-Menu"
                        value={pageType}
                        onChange={handleChange}
                    >
                        <MenuItem value={'Generic'} onClick={handleClose}>
                            Generic Component
                        </MenuItem>
                        <MenuItem value={'Action'} onClick={handleClose}>
                            Action Component
                        </MenuItem>
                        <MenuItem value={'Reflection'} onClick={handleClose}>
                            Reflection Component
                        </MenuItem>
                    </Select>
                </Grid>
                <Grid item xs={8}>
                    {errorName ? (
                        <TextField
                            error
                            helperText={errorNameText}
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="New Scenario Page Name"
                            label="Scenario Page Name"
                            id="scenariopageAdder"
                            onChange={(e) => setPageName(e.target.value)}
                        ></TextField>
                    ) : (
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="New Scenario Page Name"
                            label="Scenario Page Name"
                            id="scenariopageAdder"
                            onChange={(e) => setPageName(e.target.value)}
                        ></TextField>
                    )}
                    <EditedSunEditor
                        text={pageBody}
                        setText={setPageBody}
                    ></EditedSunEditor>
                    {errorBody ? (
                        <Typography
                            style={{ marginLeft: 15 }}
                            variant="caption"
                            display="block"
                            color="error"
                        >
                            Page body cannot be empty.
                        </Typography>
                    ) : null}
                    <Button
                        className={classes.addButton}
                        variant="contained"
                        color="primary"
                        onClick={createNewPage}
                    >
                        <AddIcon />
                        Add Scenario Page
                    </Button>
                </Grid>
            </Grid>
        </div>
    );
}
