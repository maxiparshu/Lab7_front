
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import MenuItem from '@mui/material/MenuItem';
import {Typography} from "@mui/material";

export default function Appbar({onAction}) {

    const handleCRUDCities = () => {
        onAction("CRUD_CITY");
    }

    const handleCRUDCountries = () => {
        onAction("CRUD_COUNTRY");
    }

    const handleCRUDLanguages = () => {
        onAction("CRUD_LANGUAGE");
    }



    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="fixed">
                <Toolbar variant="fixed">
                    <MenuItem onClick={handleCRUDCountries}>Countries</MenuItem>
                    <MenuItem onClick={handleCRUDCities}>Cities</MenuItem>
                    <MenuItem onClick={handleCRUDLanguages}>Languages</MenuItem>
                    <Typography variant="h5" color="inherit" component="div" sx={{ flexGrow: 2, textAlign: 'center' }}>
                        GeoData
                    </Typography>
                </Toolbar>
            </AppBar>
            {}
        </Box>
    );
}
