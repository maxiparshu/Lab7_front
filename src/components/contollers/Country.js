import * as React from 'react';
import TextField from '@mui/material/TextField';
import {
    Button, Container, Grid,
    Paper, TableContainer, Table, TableCell,
    TableBody, TableRow, TableHead, Dialog, DialogContent, DialogTitle, DialogActions
} from "@mui/material";
import {useEffect, useState} from "react";
import IconButton from "@mui/material/IconButton";
import {ArrowBack, ArrowForward} from "@mui/icons-material";

export default function Country() {
    useEffect(() => {
        fetch("http://localhost:8080/api/countries/all")
            .then(res => res.json())
            .then((result) => {
                    setCountries(result);
                }
            );
        fetch("http://localhost:8080/api/languages/all")
            .then(res => res.json())
            .then((result) => {
                    setLanguages(result);
                }
            );
    }, [])

    const update = (() => {
        fetch("http://localhost:8080/api/countries/all")
            .then(res => res.json())
            .then((result) => {
                    setCountries(result);
                }
            )
    })
    const [languages, setLanguages] = useState([])

    const [openCities, setOpenCities] = useState(null);

    const [openLanguages, setOpenLanguages] = useState(null);
    const [searchTermCities, setSearchTermCities] = useState("")

    const handleOpenLanguages = (country) => {
        setOpenLanguages(country);
    };

    const handleCloseLanguages = () => {
        setOpenLanguages(null);
    }

    const handleOpenCities = (country) => {
        setOpenCities(country);
    };

    const handleCloseCities = () => {
        setOpenCities(null);
    };

    const [searchTerm, setSearchTerm] = useState("");

    const [startIndex, setStartIndex] = useState(0);

    const [countryIdAddLang, setCountryIdAddLang] = useState("");

    const handleNextPage = () => {
        setStartIndex(startIndex + 4);
    };

    const handlePreviousPage = () => {
        setStartIndex(startIndex - 4);
    };

    const paperStyle = {padding: '50px 20px', width: 1100, margin: "20px auto"};
    const [countries, setCountries] = useState([]);
    const handleClick = (id) => {
        fetch("http://localhost:8080/api/countries/delete?id=" + id, {
            method: "DELETE",
            headers: {"Content-Type": "application/json"},
        }).then(update)
    };

    const [editing, setEditing] = useState(null);
    const [tempName, setTempName] = useState("");
    const [selectedItems, setSelectedItems] = useState([]);
    const [modalAddLanguagesOpened, openModalLanguages] = useState(false)
    const [modalCreateOpened, openModalCreate] = useState(false)
    const handleAddLanguage = (e) => {
        e.preventDefault();
        let id = countryIdAddLang;
        let languages = selectedItems;
        const countryDTO = {id, languages};
        fetch("http://localhost:8080/api/countries/add_language", {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(countryDTO)
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(error => {
                        throw new Error(error.message);
                    });
                }
                return response.json();
            })
            .then(() => update())
            .catch(error => {
                alert(`Произошла ошибка: ${error.message}`);
            });
        hideLanguagesAdding();
    }

    const [newName, setNewName] = useState("");

    const handleCreate = (e) => {
        e.preventDefault();
        let name = newName;
        let languages = selectedItems;
        const country = { name, languages};

        console.log(country);
        fetch("http://localhost:8080/api/countries/create", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(country)
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(error => {
                        throw new Error(error.message);
                    });
                }
                return response.json();
            })
            .then(() => update())
            .catch(error => {
                alert(`Произошла ошибка: ${error.message}`);
            });
        hideCreating()
    }

    const handleEdit = (country) => {
        setEditing(country.id);
        setTempName(country.name);
    };

    const handleClickRemoveLanguage = (lang) => {
        const languages = [lang.name];
        let id = openLanguages.id;
        const countryDTO = {id, languages}
        console.log(countryDTO);
        fetch("http://localhost:8080/api/countries/delete_language", {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(countryDTO)
        }).then(update);
    }

    const handleAccept = (e) => {
        e.preventDefault();
        let id = editing;
        let name = newName;
        const countryDTO = {id, name};
        console.log(countryDTO);
        if (name !== "") {
            fetch("http://localhost:8080/api/countries/update", {
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(countryDTO)
            })
                .then(response => {
                    if (!response.ok) {
                        return response.json().then(error => {
                            throw new Error(error.message);
                        });
                    }
                    return response.json();
                })
                .then(() => update())
                .catch(error => {
                    alert(`Произошла ошибка: ${error.message}`);
                });
            setEditing(null);
        }
        else{
            alert(`Произошла ошибка`);
        }
    };


    const handleCancel = () => {
        setEditing(null);
    };

    const [tempSelectedItems, setTempSelectedItems] = useState([]);


    const [existedLanguages, setExistedLanguages] = useState(null);
    const [checkboxStates, setCheckboxStates] = useState({...false});
    const [tempCheckboxState, setTempStates] = useState({...false});

    const openCreating = () => {
        openModalCreate(true)
    };
    const hideCreating = () => {
        openModalCreate(false)
        setSelectedItems([])
        setTempSelectedItems([])
        setTempStates({...false})
        setCheckboxStates({...false})
        setNewName("")
        setSearchTerm("")
    };
    const openLanguagesAdding = () => {
        openModalLanguages(true)
    };
    const hideLanguagesAdding = () => {
        openModalLanguages(false)
        setSelectedItems([])
        setTempSelectedItems([])
        setTempStates({...false})
        setCheckboxStates({...false})
        setCountryIdAddLang("")
        setSearchTerm("")
    }
    const hideLanguages = () => {
        setExistedLanguages(null)
        setCheckboxStates(tempCheckboxState)
        setSelectedItems(tempSelectedItems)
    };
    const showLanguages = () => {
        setExistedLanguages(languages)
        setTempStates(checkboxStates)
        setTempSelectedItems(selectedItems)
    }
    const closeLanguages = () => {
        setExistedLanguages(null)
    }
    const handleCheckboxChange = (id, addedValue) => {
        setCheckboxStates(prevState => ({
            ...prevState,
            [id]: !prevState[id]
        }));
        console.log(checkboxStates[id] !== true)
        if (checkboxStates[id] !== true) {
            setSelectedItems([...selectedItems, addedValue]);
        } else {
            const updatedItems = selectedItems.filter(item => item !== addedValue);
            setSelectedItems(updatedItems);
        }
    };
    return (
        <Container>
            <TableContainer component={Paper} elevation={3} style={paperStyle}>
                <Grid container spacing={3} style={{display: 'flex'}}>
                    <Grid item xs={6}>
                        <TextField
                            label="Search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            variant="outlined"
                            style={{marginBottom: '-10px'}}
                        />
                    </Grid>
                    <Grid item xs={3} style={{display: 'flex'}}>
                        <Button variant="contained" color="success" style={{marginBottom: '-10px'}}
                                onClick={() => openCreating()}>
                            Create
                        </Button>
                    </Grid>
                    <Grid item xs={3} style={{display: 'flex'}}>
                        <Button variant="contained" color="success" style={{marginBottom: '-10px'}}
                                onClick={() => openLanguagesAdding()}>
                            Add language
                        </Button>
                    </Grid>
                </Grid>
                <Dialog open={modalAddLanguagesOpened !== false}>
                    <DialogTitle>Добавление языка</DialogTitle>
                    <DialogContent>
                        <Grid container spacing={2} style={{display: 'flex'}}>
                        <Grid item xs={6} >
                            <TextField
                                label="Id country"
                                value={countryIdAddLang}
                                onChange={(e) => setCountryIdAddLang(e.target.value)}
                                style={{marginBottom: '10px'}}
                            />
                        </Grid>
                        <Grid item xs={6} >
                            <Button variant="contained" color="secondary" style={{marginBottom: '10px'}}
                                    onClick={() => showLanguages()}>
                                Languages
                            </Button>
                        </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Grid container spacing={2} style={{display: 'flex'}}>
                            <div className={'bottom-right-button'}>
                                <Button variant="contained" color="success" style={{marginBottom: '-10px'}}
                                    onClick={handleAddLanguage}>
                                    Add
                                </Button>
                            </div>
                            <div className={'bottom-left-button'}>
                                <Button variant="contained" color="warning" style={{marginBottom: '-10px'}}
                                        onClick={() => hideLanguagesAdding()}>
                                    Discard
                                </Button>
                            </div>
                        </Grid>
                    </DialogActions>
                </Dialog>
                <Dialog open={modalCreateOpened !== false}>
                    <DialogTitle>Создание страны</DialogTitle>
                    <DialogContent>
                        <Grid container spacing={2} style={{display: 'flex'}}>
                            <Grid item xs={6} >
                                <TextField
                                    label="Name"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    style={{marginBottom: '10px'}}
                                />
                            </Grid>
                            <Grid item xs={6} >
                                <Button variant="contained" color="secondary" style={{marginBottom: '10px'}}
                                        onClick={() => showLanguages()}>
                                    Languages
                                </Button>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Grid container spacing={2} style={{display: 'flex'}}>
                            <div className={'bottom-right-button'}>
                                <Button variant="contained" color="success" style={{marginBottom: '-10px'}}
                                        onClick={handleCreate}>
                                    Add
                                </Button>
                            </div>
                            <div className={'bottom-left-button'}>
                                <Button variant="contained" color="warning" style={{marginBottom: '-10px'}}
                                        onClick={() => hideCreating()}>
                                    Discard
                                </Button>
                            </div>
                        </Grid>
                    </DialogActions>
                </Dialog>
                <Grid item xs={4} >
                    <Dialog open={existedLanguages !== null}>
                        <DialogTitle>Список языков</DialogTitle>
                        <DialogContent>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Id</TableCell>
                                        <TableCell>Name</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {languages.map(value => (
                                        <TableRow key={value.id}>
                                            <TableCell>{value.id}</TableCell>
                                            <TableCell>{value.name}</TableCell>
                                            <input
                                                type="checkbox"
                                                checked={checkboxStates[value.id] || false}
                                                onChange={() => handleCheckboxChange(value.id, value.name)}
                                            />
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </DialogContent>
                        <DialogActions>
                            <Grid item xs={12} style={{display: 'flex'}}>
                                <div className={'bottom-right-button'}>
                                    <Button variant="contained" color="success" style={{marginTop: '-10px'}}
                                            onClick = {() => closeLanguages()}>
                                        Confirm
                                    </Button>
                                </div>
                                <div className={'bottom-left-button'}>
                                    <Button variant="contained" color="warning" style={{marginTop: '-10px'}}
                                            onClick={() => hideLanguages()}>
                                        Discard
                                    </Button>
                                </div>
                            </Grid>
                        </DialogActions>
                    </Dialog>
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
                        {countries
                            .filter(country => country.name.toLowerCase().startsWith(searchTerm.toLowerCase()))
                            .slice(startIndex, startIndex + 4)
                            .map(country => (
                                <TableRow key={country.id}>
                                    <TableCell>{country.id}</TableCell>
                                    <TableCell>
                                        {editing === country.id ? (
                                            <TextField
                                                label="Name"
                                                value={tempName}
                                                onChange={e => setTempName(e.target.value)}
                                                variant="outlined"
                                                style={{marginBottom: '10px'}}
                                            />
                                        ) : (
                                            country.name
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Button variant="contained" color="secondary"
                                                onClick={() => handleClick(country.id)}>
                                            Remove
                                        </Button>
                                    </TableCell>
                                    <TableCell>
                                        {editing === country.id ? (
                                            <>
                                                <Button variant="contained" color="primary" onClick={handleAccept}>
                                                    Accept
                                                </Button>
                                                <Button variant="contained" color="secondary" onClick={handleCancel}>
                                                    Cancel
                                                </Button>
                                            </>
                                        ) : (
                                            <Button variant="contained" color="inherit"
                                                    onClick={() => handleEdit(country)}>
                                                Change
                                            </Button>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Button variant="contained" color="warning"
                                                onClick={() => handleOpenCities(country)}>
                                            Cities
                                        </Button>
                                        <Dialog onClose={handleCloseCities} open={openCities !== null} fullWidth={true}>
                                            <DialogTitle>Список городов</DialogTitle>
                                            <DialogContent>
                                                <TextField
                                                    label="Search"
                                                    value={searchTermCities}
                                                    onChange={(e) => setSearchTermCities(e.target.value)}
                                                    variant="outlined"
                                                    style={{marginBottom: '-10px'}}
                                                />
                                                <Table>
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell>Id</TableCell>
                                                            <TableCell>Name</TableCell>
                                                            <TableCell>Longitude</TableCell>
                                                            <TableCell>Latitude</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {openCities?.cities.filter(city => city.name.toLowerCase()
                                                            .startsWith(searchTermCities.toLowerCase()))
                                                            .map(value => (
                                                            <TableRow key={value.id}>
                                                                <TableCell>{value.id}</TableCell>
                                                                <TableCell>{value.name}</TableCell>
                                                                <TableCell>{value.longitude}</TableCell>
                                                                <TableCell>{value.latitude}</TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </DialogContent>
                                        </Dialog>
                                    </TableCell>
                                    <TableCell>
                                        <Button variant="contained" color="warning"
                                                onClick={() => handleOpenLanguages(country)}>
                                            Languages
                                        </Button>
                                        <Dialog onClose={handleCloseLanguages} open={openLanguages !== null}>
                                            <DialogTitle>Список языков</DialogTitle>
                                            <DialogContent>
                                                <Table>
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell>Id</TableCell>
                                                            <TableCell>Name</TableCell>
                                                            <TableCell>Remove</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {openLanguages?.languages.map(value => (
                                                            <TableRow key={value.id}>
                                                                <TableCell>{value.id}</TableCell>
                                                                <TableCell>{value.name}</TableCell>
                                                                <TableCell>
                                                                    <Button variant="contained" color="secondary"
                                                                            onClick={() => handleClickRemoveLanguage(value)}>
                                                                        Remove
                                                                    </Button>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </DialogContent>
                                        </Dialog>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
                <IconButton onClick={handlePreviousPage} disabled={startIndex === 0}>
                    <ArrowBack/>
                </IconButton>
                <IconButton onClick={handleNextPage} disabled={startIndex + 4 >= countries.length}>
                    <ArrowForward/>
                </IconButton>
            </TableContainer>
        </Container>
    )
        ;
}