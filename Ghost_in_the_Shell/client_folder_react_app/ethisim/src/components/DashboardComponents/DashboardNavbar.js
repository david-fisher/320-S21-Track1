import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { Box, Typography } from '@material-ui/core';
import SimpleMenu from './DropdownMenu';

export default function DashboardNavbar() {
    return (
        <div>
            <CssBaseline />
            <AppBar position="fixed">
                <Toolbar>
                    <Box display="flex" flexGrow={1}>
                        <Typography variant="h4" noWrap>
                            Ethisim Dashboard
                        </Typography>
                    </Box>
                    <SimpleMenu />
                </Toolbar>
            </AppBar>
        </div>
    );
}
