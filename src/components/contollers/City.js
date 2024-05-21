import * as React from 'react';
import TextField from '@mui/material/TextField';
import {
    Button, Container, Grid, Paper,
    Table, TableCell,
    TableBody, TableRow, TableHead, TableContainer, Dialog, DialogTitle, DialogContent, DialogActions
} from "@mui/material";
import {useEffect, useState} from "react";
import IconButton from "@mui/material/IconButton";
import {ArrowBack, ArrowForward} from "@mui/icons-material";

export default function City() {

    useEffect(() => {
        fetch("http://localhost:8080/api/cities/all")
            .then(result => result.json())
            .then((res) => {
                setCities(res);
            });
        fetch("http://localhost:8080/api/countries/all")
            .then(result => result.json())
            .then((res) => {
                setCountries(res);
            })
    }, [])
    const update = (() => {
        fetch("http://localhost:8080/api/cities/all")
            .then(res => res.json())
            .then((result) => {
                    setCities(result);
                }
            )
    })

    const [editing, setEditing] = useState(null);
    const [tempName, setTempName] = useState("");
    const [tempLatitude, setTempLatitude] = useState("");
    const [tempLongitude, setTempLongitude] = useState("");

    const [newName, setNewName] = useState("");
    const [newLatitude, setNewLatitude] = useState("");
    const [newLongitude, setNewLongitude] = useState("");
    const [newCountryName, setNewCountryName] = useState("Country")

    const [countries, setCountries] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchTermCountries, setSearchTermCountries] = useState("")
    const [startIndex, setStartIndex] = useState(0);
    const [modalCreateOpened, openModalCreate] = useState(false)


    const handlePreviousPage = () => {
        setStartIndex(startIndex - 5);
    };
    const handleNextPage = () => {
        setStartIndex(startIndex + 5);
    };
    const handleCreate = (e) => {
        e.preventDefault();
        let name = newName;
        let countryName = newCountryName;
        let longitude = newLongitude;
        let latitude = newLatitude;
        const city = {name, latitude, longitude};
        console.log(city);
        if (name !== "") {
            fetch("http://localhost:8080/api/cities/create/" + countryName, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(city)
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
    }

    const handleAccept = (e) => {
        e.preventDefault();
        let id = editing;
        let name = tempName;
        let latitude = tempLatitude;
        let longitude = tempLongitude;
        const city = {id, name, longitude, latitude}
        console.log(city);
        fetch("http://localhost:8080/api/cities/update", {
            method:"PUT",
            headers: {"Content-Type":"application/json"},
            body:JSON.stringify(city)
        }).then(response => {
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

    const handleCancel = () => {
        setEditing(null);
    }

    const handleEdit = (city) => {
        setEditing(city.id);
        setTempName(city.name);
        setTempLatitude(city.latitude);
        setTempLongitude(city.longitude);
    };

    const paperStyle = {padding:'50px 20px', width:850, margin:"20px auto"};
    const [cities, setCities] = useState([]);
    const handleClick = (id) => {
        fetch("http://localhost:8080/api/cities/delete?id=" + id, {
            method: "DELETE",
            headers: {"Content-Type": "application/json"},
        }).then(update)
    };
    const [checkStates, setCheckStates] = useState({...false});
    const openCreating = () => {
        openModalCreate(true)
    };
    const hideCreating = () => {
        openModalCreate(false)
        setCheckStates({...false})
        setNewName("")
        setNewLongitude("")
        setNewLatitude("")
        setNewCountryName("Country")
        setSearchTermCountries("")
    };
    const [existedCountries, setExistedCountries] = useState(null);
    const [lastId, setLastCountryId] = useState(-1);

    const hideCountries = () => {
        setExistedCountries(null)
        if (lastId >= 0) {
            setCheckStates({...false})
            setCheckStates(prevState => ({
                ...prevState,
                [lastId]: !prevState[lastId]
            }));
            setNewCountryName(countries.find(country => country.id === lastId).name)

        }
        setSearchTermCountries("")
    };
    const showCountries= () => {
        setExistedCountries(countries)
    }
    const closeCountries = () => {
        setExistedCountries(null)
        const keys = Object.keys(checkStates)
        setLastCountryId(Number(keys.pop()))
    }
    const handleCheckboxChange = (id, name) => {
        setCheckStates({...false})
        setCheckStates(prevState => ({
            ...prevState,
            [id]: !prevState[id]
        }));
        setNewCountryName(name)
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
                </Grid>
                <Dialog open={modalCreateOpened !== false}>
                    <DialogTitle>Создание города</DialogTitle>
                    <DialogContent>
                        <Grid container spacing={3} style={{display: 'flex'}}>
                            <Grid item xs={3} >
                                <TextField
                                    label="Name"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    style={{marginBottom: '10px'}}
                                />
                            </Grid>
                            <Grid item xs={3} >
                                <TextField
                                    label="Longitude"
                                    value={newLongitude}
                                    onChange={(e) => setNewLongitude(e.target.value)}
                                    style={{marginBottom: '10px'}}
                                />
                            </Grid>
                            <Grid item xs={3} >
                                <TextField
                                    label="Latitude"
                                    value={newLatitude}
                                    onChange={(e) => setNewLatitude(e.target.value)}
                                    style={{marginBottom: '10px'}}
                                />
                            </Grid>
                            <Grid item xs={3} >
                                <Button variant="contained" color="secondary"
                                    onClick={() => showCountries()}>
                                    {newCountryName}
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
                <Grid item xs={4} style={
                    {display: 'static'}

                 }>
                    <Dialog open={existedCountries !== null} fullWidth={true}>
                        <DialogTitle>Список стран</DialogTitle>
                        <TextField
                            label="Search"
                            value={searchTermCountries}
                            onChange={(e) => setSearchTermCountries(e.target.value)}
                            variant="outlined"
                            style={{position: 'relative'}}
                        />
                        <DialogContent>
                            <Table className={'table-container'}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Id</TableCell>
                                        <TableCell>Name</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {countries
                                        .filter(country => country.name.toLowerCase()
                                            .startsWith(searchTermCountries.toLowerCase()))
                                        .map(value => (
                                        <TableRow key={value.id}>
                                            <TableCell>{value.id}</TableCell>
                                            <TableCell>{value.name}</TableCell>
                                            <TableCell>
                                            <input
                                                type="checkbox"
                                                checked={checkStates[value.id] || false}
                                                onChange={() => handleCheckboxChange(value.id, value.name)}
                                                style={{marginBottom: '-10px'}}
                                            />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </DialogContent>
                        <DialogActions>

                                    <Button variant="contained" color="success"  style={{position: 'relative', left: '50px'}}
                                            onClick = {() => closeCountries()}>
                                        Confirm
                                    </Button>

                                    <Button variant="contained" color="warning" style={{position: 'relative', left: '-450px'}}
                                            onClick={() => hideCountries()}>
                                        Discard
                                    </Button>
                        </DialogActions>
                    </Dialog>
                </Grid>

                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Id</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Longitude</TableCell>
                            <TableCell>Latitude</TableCell>
                            <TableCell>Remove</TableCell>
                            <TableCell>Change</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {cities
                            .filter(city => city.name.toLowerCase().startsWith(searchTerm.toLowerCase()))
                            .slice(startIndex, startIndex + 5)
                            .map(city => (
                                <TableRow key={city.id}>
                                    <TableCell>{city.id}</TableCell>
                                    <TableCell>
                                        {editing === city.id ? (
                                            <TextField
                                                label = "Name"
                                                value = {tempName}
                                                onChange={e => setTempName(e.target.value)}
                                                variant = "outlined"
                                                style = {{marginBottom: '10px'}}
                                            />
                                        ) : (
                                            city.name
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {editing === city.id ? (
                                            <TextField
                                                label = "Longitude"
                                                value = {tempLongitude}
                                                onChange={e => setTempLongitude(e.target.value)}
                                                variant = "outlined"
                                                style = {{marginBottom: '10px'}}
                                            />
                                        ) : (
                                            city.longitude
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {editing === city.id ? (
                                            <TextField
                                                label = "Latitude"
                                                value = {tempLatitude}
                                                onChange={e => setTempLatitude(e.target.value)}
                                                variant = "outlined"
                                                style = {{marginBottom: '10px'}}
                                            />
                                        ) : (
                                            city.latitude
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Button variant="contained" color="secondary"
                                                onClick={() => handleClick(city.id)}>
                                            Remove
                                        </Button>
                                    </TableCell>
                                    <TableCell>
                                        {editing === city.id ? (
                                            <>
                                                <Button variant="contained" color="primary" onClick={handleAccept}>
                                                    Accept
                                                </Button>
                                                <Button variant="contained" color="secondary" onClick={handleCancel}>
                                                    Cancel
                                                </Button>
                                            </>
                                        ) : (
                                            <Button variant="contained" color="inherit" onClick={() => handleEdit(city)}>
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
                <IconButton onClick={handleNextPage} disabled={startIndex + 5 >= cities.length}>
                    <ArrowForward/>
                </IconButton>
            </TableContainer>
        </Container>
    );
}
/*     <Grid item xs={2} style={{display: 'flex'}}>
                        <TextField
                            label="Name"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            variant="outlined"
                            style={{marginBottom: '10px', width: '100%'}}
                        />
                    </Grid>
                    <Grid item xs={3} style={{display: 'flex'}}>
                        <TextField
                            label="Country name"
                            value={newCountryName}
                            onChange={(e) => setNewCountryName(e.target.value)}
                            variant="outlined"
                            style={{marginBottom: '10px', width: '100%'}}
                        />
                    </Grid>
                    <Grid item xs={2} style={{display: 'flex'}}>
                        <TextField
                            label="Latitude"
                            value={newLatitude}
                            onChange={(e) => setNewLatitude(e.target.value)}
                            variant="outlined"
                            style={{marginBottom: '10px', width: '100%'}}
                        />
                    </Grid>
                    <Grid item xs={2} style={{display: 'flex'}}>
                        <TextField
                            label="Longitude"
                            value={newLongitude}
                            onChange={(e) => setNewLongitude(e.target.value)}
                            variant="outlined"
                            style={{marginBottom: '10px', width: '100%'}}
                        />
                    </Grid>*/