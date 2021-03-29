import React from 'react';
import Typography from '@material-ui/core/Typography';

export default function Copyright() {
    return (
        <Typography align="center">
            Copyright © Ethisim {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}
