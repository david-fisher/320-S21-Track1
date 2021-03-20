import React from 'react';
import Typography from '@material-ui/core/Typography';
import Body from './GeneralPageComponents/Body';
import Title from './GeneralPageComponents/Title';
import InformationItemList from './InformationItemList';
import Button from '@material-ui/core/Button';

export default function GenericComponent() {
    return (
        <div>
            <Typography align="center" variant="h2">
                Generic Component
            </Typography>
            <Title />
            <Body />
            <InformationItemList />
            <Button variant="contained" color="grey">
                Save Generic Component
            </Button>
            <Button variant="contained" color="primary">
                Delete Generic Component
            </Button>
        </div>
    );
}
