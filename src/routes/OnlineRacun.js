import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import React from "react";
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';


function Transakcije(){
    const [data, setData] = useState(null);
    const { IdRacun } = useParams();

    useEffect(() => {
        UcitajRacune();
        
    },[]);

    async function UcitajRacune(){
        axios({
            method: 'post',
            url: 'http://localhost/KV/bankovnisustav/src/PHP/ReadWrite.php',
            data: {
                RequestId: 'Ucitaj_racun',
                Sifra: IdRacun
            },
            headers: { 
                "Content-Type": "multipart/form-data",
            } ,
        }).then(function (response) {
            //handle success
            console.log(response.data.loTransakcije);
            setData(response.data.loTransakcije);
          }).catch(function (response) {
            //handle error
            console.log(response);
          });
    }
    if(!data) return;
    
    return(
        data.map((x)=>
        (<div className={`card border border-${x.Iznos<0?"danger":"success"} m-3`}
        >
        <div className="card-header">{x.Datum}</div>
        <div className="card-body row">
            <div className="col-xs-12 col-md-2">
                <h5 className={`text-${x.Iznos<0?"danger":"success"}`}>{x.Iznos} </h5>
                <h6>{x.TrenutnoStanje}</h6>
            </div>
            <div className="card-text col">
            {x.Platitelj+" "+ x.Vrsta+" "+ x.Opis+ "("+ x.Sifra+")"} 
            </div>
        </div>
        </div>)));
}
function OnlineRacun(){
    const [newTransakcija, setNewTransakcija]= useState(false);
    const [inputs, setInputs] = useState({"Vrsta":"Uplata"});
    const [racun, setRacun]= useState(null);
    const { IdRacun } = useParams();
    useEffect(() => {
        UcitajRacune();
        
    },[]);
    async function UcitajRacune(){
        axios({
            method: 'post',
            url: 'http://localhost/KV/bankovnisustav/src/PHP/ReadWrite.php',
            data: {
                RequestId: 'Ucitaj_racun',
                Sifra: IdRacun
            },
            headers: { 
                "Content-Type": "multipart/form-data",
            } ,
        }).then(function (response) {
            //handle success
            console.log(response.data);
            setRacun(response.data);
          }).catch(function (response) {
            //handle error
            console.log(response);
          });
    }
    if(!racun) return;

    const modalTansactionNewOpen = (event) => {
        setInputs({"Vrsta": "Uplata"});
        setNewTransakcija(true);
    }
    const modalTansactionNewClose = (event) => {
        setNewTransakcija(false);
    }
    function ClickIzvrsiTransakciju (){
        axios({
            method: 'post',
            url: 'http://localhost/KV/bankovnisustav/src/PHP/ReadWrite.php',
            data: {
                RequestId: 'Dodaj_Transakciju',
                SifraRacuna: IdRacun,
                SifraBankara: "online",
                Vrsta:"Isplata",
                Opis: inputs.Opis,
                PozivNaBroj: inputs.PozivNaBroj,
                ImePlatitelja:inputs.ImePlatitelja,
                Iznos: inputs.Vrsta=="Uplata"?inputs.Iznos:-inputs.Iznos
            },
            headers: { 
                "Content-Type": "multipart/form-data",
            } ,
        }).then(function (response) {
            //handle success
            console.log(response);
            setNewTransakcija(false);
            setRacun([]);
            UcitajRacune();
          
        }).catch(function (response) {
            //handle error
            console.log(response);
        }); 
        axios({
            method: 'post',
            url: 'http://localhost/KV/bankovnisustav/src/PHP/ReadWrite.php',
            data: {
                RequestId: 'Dodaj_Transakciju',
                SifraRacuna: inputs.racunZaPrebacit,
                SifraBankara: "online",
                Vrsta:"Uplata",
                Opis: inputs.Opis,
                PozivNaBroj: inputs.PozivNaBroj,
                ImePlatitelja:inputs.ImePlatitelja,
                Iznos: inputs.Vrsta=="Uplata"?inputs.Iznos:-inputs.Iznos
            },
            headers: { 
                "Content-Type": "multipart/form-data",
            } ,
        }).then(function (response) {
            //handle success
            console.log(response);
            setNewTransakcija(false);
            setRacun([]);
            UcitajRacune();
          
        }).catch(function (response) {
            //handle error
            console.log(response);
        }); 
    }

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({...values, [name]: value}));
    }
    return(
        <div className="container text-center mt-5 col-xl-6 col-md-8 col-xs-12">
            <h4 className="display-4">Računa: {racun.IdRacuna}</h4>
            <h5 className="lead">Saldo: {racun.Stanje}</h5>
            <button className="btn btn-success m-3" onClick={modalTansactionNewOpen}>Nova transakcija</button>
            <hr></hr>
            <Transakcije />

            <Modal show={newTransakcija} onHide={modalTansactionNewClose}> 
                <Modal.Header closeButton>
                  <Modal.Title>Nova Transakcija</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form>
                    <label className="mb-3">Šifra računa:{IdRacun} </label><br />
                    <label>Prebaci na račun::</label>
                    <input
                    className="form-control mb-3"
                    type="text"
                    name="racunZaPrebacit"
                    value={inputs.racunZaPrebacit || ""}
                    onChange={handleChange}
                    />
                    <label>Ime platitelja:</label>
                    <input
                    className="form-control mb-3"
                    type="text"
                    name="ImePlatitelja"
                    value={inputs.ImePlatitelja || ""}
                    onChange={handleChange}
                    />
                    <label>Iznos:</label>
                    <input
                    className="form-control mb-3"
                    type="number"
                    name="Iznos"
                    value={inputs.Iznos||""}
                    onChange={handleChange}
                    />
                    <label>Poziv na broj:</label>
                    <input
                    className="form-control mb-3 col"
                    type="text"
                    name="PozivNaBroj"
                    value={inputs.PozivNaBroj||""}
                    onChange={handleChange}
                    />
                    <label>Opis:</label>
                    <input
                    className="form-control mb-3"
                    type="text"
                    name="Opis"
                    value={inputs.Opis||""}
                    onChange={handleChange}
                    /> 
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={modalTansactionNewClose}>Close</Button>
                    <Button variant="primary" onClick={()=>ClickIzvrsiTransakciju()}>Izvrši transakciju</Button>
                </Modal.Footer>
            </Modal >
        </div>
    );
}


export default OnlineRacun;