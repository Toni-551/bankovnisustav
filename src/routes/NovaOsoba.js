import React from 'react';
import {useState} from 'react';
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function NoviKlijent(){

    const [inputs, setInputs] = useState({});
    const navigate = useNavigate();
    const { IdOsoba } = useParams();

    var requestId;
    var route;
    if(IdOsoba=='klijent'){
        requestId='Upisi_novog_klijenta';
        route='klijenti';
    }else{
        requestId='Upisi_novog_zaposlenika';
        route='zaposlenici';
    }
    const handleSubmit = (event) => {
        event.preventDefault();
        axios({
            method: 'post',
            url: 'http://localhost/KV/bankovnisustav/src/PHP/ReadWrite.php',
            data: {
                RequestId: requestId,
                OIB: inputs.OIB,
                Ime: inputs.Ime,
                Prezime: inputs.Prezime,
                Adresa: inputs.Adresa,
                Telefon: inputs.Telefon,
                Spol: inputs.Spol
            },
            headers: { 
                "Content-Type": "multipart/form-data",
            } ,
        }).then(function (response) {
            //handle success
            console.log(response.data);
            console.log(response);
            navigate('/administracija/'+route);
          }).catch(function (response) {
            //handle error
            console.log(response);
          });

    }
    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({...values, [name]: value}))
    }
    return (
        <div className='container mt-5'>
        <form>
            <label>Unesite OIB:</label>
            <input
            className="form-control mb-3"
            type="text"
            name="OIB"
            value={inputs.OIB || ""}
            onChange={handleChange}
            />
            <label>Unesite Ime:</label>
            <input
            className="form-control mb-3"
            type="text"
            name="Ime"
            value={inputs.Ime || ""}
            onChange={handleChange}
            />
            <label>Unesite Prezime:</label>
            <input
            className="form-control mb-3"
            type="text"
            name="Prezime"
            value={inputs.Prezime || ""}
            onChange={handleChange}
            />
            <label>Unesite Adresu:</label>
            <input
            className="form-control mb-3"
            type="text"
            name="Adresa"
            value={inputs.Adresa || ""}
            onChange={handleChange}
            />
            <label>Unesite Telefon:</label>
            <input
            className="form-control mb-3"
            type="text"
            name="Telefon"
            value={inputs.Telefon || ""}
            onChange={handleChange}
            />
            <label>Unesite Spol:</label>
            <input
            className="form-control mb-3"
            type="text"
            name="Spol"
            value={inputs.Spol || ""}
            onChange={handleChange}
            />
            <button className='btn btn-success' onClick={handleSubmit}>Dodaj novog klijenta</button>
        </form>
        </div>);

}
export default NoviKlijent;