import React from 'react';
import {useState, useEffect} from 'react';
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import $ from 'jquery';

function AzurirajKlijenta(){

    const [inputs, setInputs] = useState({});
    const navigate = useNavigate();
    const { KlijentID } = useParams();
    const [data, setData] = useState(null);

    useEffect(() => {
        UcitajKlijenta();
    },[]);

    async function UcitajKlijenta(){
        axios({
            method: 'post',
            url: 'http://localhost/KV/bankovnisustav/src/PHP/ReadWrite.php',
            data: {
                RequestId: 'Ucitaj_podatke_klijenta',
                KlijentID: KlijentID
            },
            headers: { 
                "Content-Type": "multipart/form-data",
            } ,
        }).then(function (response) {
            //handle success
            console.log(response.data);
            setData(response.data);
          }).catch(function (response) {
            //handle error
            console.log(response);
          });
        }
    
    if(data){
   
    const handleSubmit = (event) => {
        event.preventDefault();
        var validation = true;
        var reg = /^\d+$/;
        if(!($('#telefon').val().length == 10 && reg.test($('#telefon').val()))){
            $('#telefon').attr('class','form-control is-invalid');
            validation=false; 
        }else{
            $('#telefon').attr('class','form-control is-valid');
        }
        if(!validation)return;
        axios({
            method: 'post',
            url: 'http://localhost/KV/bankovnisustav/src/PHP/ReadWrite.php',
            data: {
                RequestId: "Azuriraj_klijenta",
                Ime: inputs.Ime ||data.Ime,
                Prezime: inputs.Prezime ||data.Prezime,
                Adresa: inputs.Adresa ||data.Adresa,
                Telefon: inputs.Telefon||data.Telefon,
                Spol: inputs.Spol||data.Spol,
                KlijentID: KlijentID
            },
            headers: { 
                "Content-Type": "multipart/form-data",
            } ,
        }).then(function (response) {
            //handle success
            console.log(response.data);
            console.log(response);
            navigate('/administracija/klijenti');
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
        <div className='container mt-1 p-5 bg-white'>
        <form className='needs-validation' noValidate>
            <div>
            <label>Unesite OIB:</label>
            <input
            className="form-control mb-3"
            type="text"
            name="OIB"
            id="oib"
            value={inputs.OIB || data.OIB}
            onChange={handleChange}
            required
            readOnly
            />
            <div className="invalid-feedback mb-3">
                OIB je neispravan.
            </div>
            </div>
            <label>Unesite novo Ime:staro ime({data.Ime}) </label>
            <input
            className="form-control mb-3"
            type="text"
            name="Ime"
            placeholder={data.Ime}
            value={inputs.Ime || ""}
            onChange={handleChange}
            />
            <label>Unesite Prezime:</label>
            <input
            className="form-control mb-3"
            type="text"
            name="Prezime"
            placeholder={data.Prezime}
            value={inputs.Prezime || ""}
            onChange={handleChange}
            />
            <label>Unesite Adresu:</label>
            <input
            className="form-control mb-3"
            type="text"
            name="Adresa"
            placeholder={data.Adresa}
            value={inputs.Adresa || ""}
            onChange={handleChange}
            />
            <label>Unesite Telefon:</label>
            <div>
            <input
            className="form-control mb-3"
            type="text"
            name="Telefon"
            id="telefon"
            placeholder={data.Telefon}
            value={inputs.Telefon || ""}
            onChange={handleChange}
            required
            />
            <div className="invalid-feedback mb-3">
                Unesite ispravan broj mobitela(10 brojeva).
            </div>
            </div>
            <label>Unesite Spol:</label>
            <input
            className="form-control mb-3"
            type="text"
            id="spol"
            name="Spol"
            placeholder={data.Spol}
            value={inputs.Spol || ""}
            onChange={handleChange}
            />
            <button className='btn btn-success' onClick={handleSubmit}>Dodaj novog klijenta</button>
        </form>
        </div>);
    }

}


export default AzurirajKlijenta;