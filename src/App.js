import './App.css';
import React, {useState} from "react";
import CRUDBar from "./components/CRUDBar";
import City from "./components/contollers/City";
import Country from "./components/contollers/Country";
import Language from "./components/contollers/Language";

function App() {
    const [numAction, setNumAction] = useState(null)
    const handleAction = (numAction) => {
        setNumAction(numAction);
    }
    return (<div className = "App">
            <CRUDBar onAction = {handleAction}/>
            {numAction === "CRUD_CITY" && <City/>}
            {numAction === "CRUD_COUNTRY" && <Country/>}
            {numAction === "CRUD_LANGUAGE" && <Language/>}
        </div>
    )
}

export default App;
