import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Typography,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    IconButton,
    Grid,
} from '@material-ui/core';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import CloseIcon from '@material-ui/icons/Close';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(1),
        textAlign: 'center',
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
    dialogTitle: {
        textAlign: 'center',
    },
    versionHistoryDescription: {
        borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
        paddingBottom: '6px',
        marginBottom: '6px',
    },
    historyPanel: {
        width: '100%',
        margin: theme.spacing(1),
        textTransform: 'unset',
        display: 'block',
    },
    historyPanelSelected: {
        backgroundColor: theme.palette.primary.light,
        width: '100%',
        margin: theme.spacing(1),
        textTransform: 'unset',
        display: 'block',
    },
}));

HistoryPanel.propTypes = {
    data: PropTypes.any.isRequired,
    selectedVersion: PropTypes.any,
    setSelectedVersion: PropTypes.any.isRequired,
    setSelectedVersionData: PropTypes.any.isRequired,
};

function HistoryPanel(props) {
    const classes = useStyles();
    const {
        data,
        selectedVersion,
        setSelectedVersion,
        setSelectedVersionData,
    } = props;
    const { author, date, id } = data;

    let buttonCSS =
        selectedVersion != null && id === selectedVersion
            ? classes.historyPanelSelected
            : classes.historyPanel;

    const handleSelectVersion = () => {
        //HistoryPanel is already selected
        if (selectedVersion != null && id === selectedVersion) {
            setSelectedVersion(null);
            setSelectedVersionData(null);
        } else {
            setSelectedVersion(id);
            setSelectedVersionData(data);
        }
    };

    return (
        <div>
            <Grid container>
                <Button
                    className={buttonCSS}
                    variant="outlined"
                    color="primary"
                    onClick={handleSelectVersion}
                >
                    <Typography variant="subtitle1" noWrap>
                        Date Saved: {new Date(date).toLocaleString()}
                    </Typography>
                    <Typography variant="subtitle1">
                        Author: {author}
                    </Typography>
                </Button>
            </Grid>
        </div>
    );
}

DialogTitle.propTypes = {
    onClose: PropTypes.any.isRequired,
};

function DialogTitle(props) {
    const classes = useStyles();
    const { onClose } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root}>
            <Typography variant="h6">History</Typography>
            {onClose ? (
                <IconButton
                    aria-label="close"
                    className={classes.closeButton}
                    onClick={onClose}
                >
                    <CloseIcon />
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
}

VersionControlDialog.propTypes = {
    type: PropTypes.string,
    history: PropTypes.array,
    setIssueEntryFieldList: PropTypes.any,
    setTitle: PropTypes.any,
    setBody: PropTypes.any,
    setOption1: PropTypes.any,
    setOption2: PropTypes.any,
    setQuestions: PropTypes.any,
    setStakeHolders: PropTypes.any,
};

export default function VersionControlDialog({
    type,
    history,
    setIssueEntryFieldList,
    setTitle,
    setBody,
    setOption1,
    setOption2,
    setQuestions,
    setStakeHolders,
}) {
    const classes = useStyles();

    const [open, setOpen] = useState(false);
    const [selectedVersion, setSelectedVersion] = useState(null);
    const [selectedVersionData, setSelectedVersionData] = useState(null);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSelectVersion = () => {
        if (selectedVersion !== null) {
            switch (type) {
                case 'Issues':
                    setIssueEntryFieldList({
                        data: selectedVersionData.issues,
                    });
                    break;
                case 'Conversation Editor':
                    setStakeHolders(selectedVersionData.stakeholders);
                    break;
                case 'Generic':
                    setTitle(selectedVersionData.title);
                    setBody(selectedVersionData.body);
                    break;
                case 'Reflection':
                    setTitle(selectedVersionData.title);
                    setBody(selectedVersionData.body);
                    setQuestions(selectedVersionData.questions);
                    break;
                case 'Action':
                    setTitle(selectedVersionData.title);
                    setBody(selectedVersionData.body);
                    setOption1(selectedVersionData.option1);
                    setOption2(selectedVersionData.option2);
                    break;
                default:
                    break;
            }
        }
        setOpen(false);
        setSelectedVersion(null);
        setSelectedVersionData(null);
    };

    let historyPanels = history.map((data) => (
        <HistoryPanel
            data={data}
            key={data.id}
            selectedVersion={selectedVersion}
            setSelectedVersion={setSelectedVersion}
            selectedVersionData={selectedVersionData}
            setSelectedVersionData={setSelectedVersionData}
        />
    ));

    return (
        <div>
            <Button
                variant="outlined"
                color="primary"
                onClick={handleClickOpen}
            >
                Version History
            </Button>
            <Dialog
                fullWidth={true}
                maxWidth="sm"
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
            >
                <DialogTitle onClose={handleClose}></DialogTitle>
                <DialogContent dividers>
                    <Typography className={classes.versionHistoryDescription}>
                        Selecting a version will autofill the component with its
                        past data. You can undo this change by selecting the
                        Revert button.
                    </Typography>
                    {historyPanels}
                </DialogContent>
                <DialogActions>
                    <Button
                        autoFocus
                        onClick={handleSelectVersion}
                        color="primary"
                    >
                        Select Version
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
