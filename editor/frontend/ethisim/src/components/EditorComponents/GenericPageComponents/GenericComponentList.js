import React, { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import GenericComponent from './GenericComponent.js';

export default function GenericComponentList() {
    const [components, setComponent] = useState([<GenericComponent key={1} />]);

    const addComponent = (event) => {
        setComponent(components.concat(<GenericComponent key={key + 1} />));
        event.preventDefault();
    };

    return (
        <div>
            <Typography align="center" variant="h2">
                Generic Component List
            </Typography>
            {components}
            <Button variant="contained" onClick={addComponent}>
                Add Generic Component
            </Button>
        </div>
    );
}
