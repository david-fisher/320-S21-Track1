import React from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import { Link } from 'react-router-dom';
import { DOMAIN } from './constants/config';
import shemptylogo from '../EditorComponents/ConversationEditorComponents/StakeHoldersComponent/shemptylogo.png';

export default function SimpleMenu() {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <IconButton
                aria-controls="simple-menu"
                aria-haspopup="true"
                onClick={handleClick}
            >
                <img src={shemptylogo} height={50} width={50} alt=""></img>
            </IconButton>
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem
                    onClick={() => window.location.href = DOMAIN + ':3006'}
                    component={Link}
                    to={{
                        pathname: '/home',
                    }}
                >
                    Logout
                </MenuItem>
                <MenuItem onClick={handleClose}>Settings</MenuItem>
                <MenuItem onClick={handleClose}>Help</MenuItem>
            </Menu>
        </div>
    );
}
