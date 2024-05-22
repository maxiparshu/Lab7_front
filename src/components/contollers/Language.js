import * as React from 'react';
import './buttons.css'
import TextField from '@mui/material/TextField';
import {
    Button, Container, Grid,
    Paper, TableContainer, Table, TableCell,
    TableBody, TableRow, TableHead
} from "@mui/material";
import {useEffect, useState} from "react";
import IconButton from "@mui/material/IconButton";
import {ArrowBack, ArrowForward} from "@mui/icons-material";

export default function Language() {


    useEffect(() => {
        fetch("https://labsjava4sem-production.up.railway.app/api/languages/all")
            .then(res => res.json())
            .then((result) => {
                    setLanguages(result);
                }
            );
    }, [])

    const update = (() => {
        fetch("https://labsjava4sem-production.up.railway.app/api/languages/all")
            .then(res => res.json())
            .then((result) => {
                    setLanguages(result);
                }
            )
    })

    const [searchTerm, setSearchTerm] = useState("");
    const [startIndex, setStartIndex] = useState(0);


    const handleNextPage = () => {
        setStartIndex(startIndex + 4);
    };

    const handlePreviousPage = () => {
        setStartIndex(startIndex - 4);
    };

    const paperStyle = {padding:'50px 20px', width:600, margin:"20px auto"};
    const [languages, setLanguages] = useState([]);
    const handleClick = (id) => {
        fetch("https://labsjava4sem-production.up.railway.app/api/languages/delete?id=" + id, {
            method: "DELETE",
            headers: {"Content-Type": "application/json"},
        }).then(update)
    };

    const [editing, setEditing] = useState(null);
    const [tempName, setTempName] = useState("");

    const [newName, setNewName] = useState("");

    const handleCreate = (e) => {
        e.preventDefault();
        let name = newName;
        const language = {name};
        fetch("https://labsjava4sem-production.up.railway.app/api/languages/create", {
            method:"POST",
            headers: {"Content-Type":"application/json"},
            body:JSON.stringify(language)
        }).then(() => update())
    }

    const handleEdit = (language) => {
        setEditing(language.id);
        setTempName(language.name);
    };

    const handleAccept = (e) => {
        e.preventDefault();
        let id = editing;
        let name = tempName;
        const language = {id, name};
        fetch("https://labsjava4sem-production.up.railway.app/api/languages/update", {
            method:"PUT",
            headers: {"Content-Type":"application/json"},
            body:JSON.stringify(language)
        }).then(() => update())
        setEditing(null);
    };

    const handleCancel = () => {
        setEditing(null);
    };


    // Функция для закрытия модального окна


    return (
        <Container>
            <TableContainer component={Paper} elevation={3} style={paperStyle}>
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <TextField
                            label="Search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            variant="outlined"
                            style={{marginBottom: '10px'}}
                            fullWidth={true}
                        />
                    </Grid>
                    <Grid item xs={2} style={{display: 'flex'}}>
                        <TextField
                            label="Name"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            variant="outlined"
                            style={{marginBottom: '10px', width: '100%'}}
                        />
                    </Grid>
                    <Grid item xs={2} style={{display: 'flex', alignItems: 'center'}}>
                        <Button variant="contained" color="success" style={{marginTop: '-10px'}}
                                onClick={handleCreate}>
                            Create
                        </Button>
                    </Grid>
                </Grid>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Id</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Remove</TableCell>
                            <TableCell>Change</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {languages
                            .filter(language => language.name.toLowerCase().startsWith(searchTerm.toLowerCase()))
                            .slice(startIndex, startIndex + 4)
                            .map(language => (
                                <TableRow key={language.id}>
                                    <TableCell>{language.id}</TableCell>
                                    <TableCell>
                                        {editing === language.id ? (
                                            <TextField
                                                label = "Name"
                                                value = {tempName}
                                                onChange={e => setTempName(e.target.value)}
                                                variant = "outlined"
                                                style={{marginBottom: '10px'}}
                                            />
                                        ) : (
                                            language.name
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Button variant="contained" color="secondary" onClick={() => handleClick(language.id)}>
                                            Remove
                                        </Button>
                                    </TableCell>
                                    <TableCell>
                                        {editing === language.id ? (
                                            <>
                                                <Button variant="contained" color="primary" onClick={handleAccept}>
                                                    Accept
                                                </Button>
                                                <Button variant="contained" color="secondary" onClick={handleCancel}>
                                                    Cancel
                                                </Button>
                                            </>
                                        ) : (
                                            <Button variant="contained" color="inherit" onClick={() => handleEdit(language)}>
                                                Change
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
                <IconButton onClick={handlePreviousPage} disabled={startIndex === 0}>
                    <ArrowBack/>
                </IconButton>
                <IconButton onClick={handleNextPage} disabled={startIndex + 4 >= languages.length}>
                    <ArrowForward/>
                </IconButton>
            </TableContainer>
        </Container>
    );
}