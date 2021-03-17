import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Button,
    Typography,
    makeStyles,
} from '@material-ui/core';
import AddNewScenarioPageDialogBody from './AddNewScenarioPageDialogBody';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
    dialogWrapper: {
        padding: theme.spacing(2),
        position: 'absolute',
        top: theme.spacing(5),
    },
    exitOutButton: {
        margin: theme.spacing(2),
        marginLeft: 'auto',
        float: 'right',
        border: '3px solid',
        borderColor: theme.palette.primary.light,
    },
}));

AddNewSimulationScenarioPageDialog.propTypes = {
    title: PropTypes.any.isRequired,
    setOpenPopup: PropTypes.any.isRequired,
    addPage: PropTypes.any.isRequired,
    openPopup: PropTypes.any.isRequired,
};

export default function AddNewSimulationScenarioPageDialog(props) {
    const classes = useStyles();
    AddNewSimulationScenarioPageDialog.propTypes = props.data;
    const data = props;
    const { title, setOpenPopup, addPage, openPopup } = data;

    return (
        <div>
            <Dialog
                open={openPopup}
                maxWidth="md"
                classes={{ paper: classes.dialogWrapper }}
            >
                <DialogTitle
                    disableTypography={true}
                    style={{ display: 'flex' }}
                >
                    <Typography
                        variant="h3"
                        align="center"
                        component="div"
                        style={{ display: 'flex' }}
                    >
                        {title}
                    </Typography>
                    <Button
                        className={classes.exitOutButton}
                        variant="contained"
                        color="primary"
                        onClick={() => {
                            setOpenPopup(false);
                        }}
                    >
                        <HighlightOffIcon />
                    </Button>
                </DialogTitle>

                <DialogContent dividers>
                    <AddNewScenarioPageDialogBody
                        addPage={addPage}
                        setOpenPopup={setOpenPopup}
                    ></AddNewScenarioPageDialogBody>
                </DialogContent>
            </Dialog>
        </div>
    );
}
