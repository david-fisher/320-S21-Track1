import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Grid } from '@material-ui/core';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
    pageButton: {
        width: '100%',
        minHeight: '50px',
        border: '3px solid',
        borderColor: theme.palette.primary.light,
        textTransform: 'unset',
    },
    deleteButtonContainer: {
        display: 'flex',
        alignItems: 'center',
    },
    deleteButton: {
        minWidth: '40px',
        border: '3px solid',
        borderColor: theme.palette.primary.main,
        backgroundColor: theme.palette.primary.light,
    },
}));

NavSideBarNode.propTypes = {
    onClick: PropTypes.any.isRequired,
    title: PropTypes.string.isRequired,
    page: PropTypes.any.isRequired,
};

export default function NavSideBarNode(props) {
    const classes = useStyles();
    NavSideBarNode.propTypes = props.data;
    const data = props;
    const { onClick, title, page } = data;

    function handleDisplayComponent() {
        onClick(page);
    }

    function pageType(title) {
        return (
            <Grid container direction="row" justify="flex-start">
                <Grid item xs={12}>
                    <Button
                        className={classes.pageButton}
                        variant="contained"
                        color="primary"
                        onClick={handleDisplayComponent}
                    >
                        {title}
                    </Button>
                </Grid>
            </Grid>
        );
    }

    return <div>{pageType(title)}</div>;
}
