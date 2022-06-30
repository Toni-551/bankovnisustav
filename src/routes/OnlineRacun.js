import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import React from "react";
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import $ from 'jquery';


function Transakcije(){
    const [data, setData] = useState(null);
    const [racun, setRacun]=useState();
    const { IdRacun } = useParams();

    useEffect(() => {
        UcitajRacune();
    },[IdRacun]);


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
    const [inputs, setInputs] = useState({"Vrsta":"Uplata", "Iznos":0});
    const [racun, setRacun]= useState(null);
    const { IdRacun } = useParams();
    useEffect(() => {
        UcitajRacune();
        
    },[IdRacun]);
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
        setInputs({"Vrsta": "Uplata", "Iznos":0});
        setNewTransakcija(true);
    }
    const modalTansactionNewClose = (event) => {
        setNewTransakcija(false);
    }
    function ProvjeraTransakcije(){
        
        var valid=true;
        
        if(parseFloat(inputs.Iznos)<0 || parseFloat(inputs.Iznos)>parseFloat(racun.Stanje)){
            valid=false;
            $('#Iznos').attr('class','form-control is-invalid');
        }else{
            $('#Iznos').attr('class','form-control is-valid');
        }
       /* axios({
            method: 'post',
            url: 'http://localhost/KV/bankovnisustav/src/PHP/ReadWrite.php',
            data: {
                RequestId: 'Provjera_racuna',
                Sifra: inputs.racunZaPrebacit||""
            },
            headers: { 
                "Content-Type": "multipart/form-data",
            } ,
        }).then(function (response) {
            //handle success
            console.log(response.data)
            if(response.data=='0'){
                $('#racun').attr('class','form-control is-invalid');
                valid = 0;
            }else{
                $('#racun').attr('class','form-control is-valid');
            }
            setState(response.data);
        }).catch(function (response) {
            //handle error
            console.log(response);
        });
        if(!state)return;
            console.log(valid);*/
            return valid;
        
        
        
    }
    function ClickIzvrsiTransakciju (){
        if(ProvjeraTransakcije()==0){
            return;
        }
        if(!window.confirm("Želite li izvršiti transakciju?")){
            return;
        }
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
                Iznos: -inputs.Iznos,
                TrenutnoStanje: racun.Stanje-inputs.Iznos
            },
            headers: { 
                "Content-Type": "multipart/form-data",
            } ,
        }).then(function (response) {
            //handle success
            console.log(response);
          
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
                Iznos: inputs.Iznos,
                TrenutnoStanje: racun.Stanje+inputs.Iznos
            },
            headers: { 
                "Content-Type": "multipart/form-data",
            } ,
        }).then(function (response) {
            //handle success
            console.log(response);
            setNewTransakcija(false);
            window.location.reload();
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
            <h4 id="idRacuna"className="display-4">Računa: {racun.IdRacuna}</h4>
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
                    <div>
                        <label>Prebaci na račun:</label>
                        <input
                        className="form-control mb-3"
                        type="text"
                        id="racun"
                        name="racunZaPrebacit"
                        value={inputs.racunZaPrebacit || ""}
                        onChange={handleChange}
                        />
                        <div className="invalid-feedback mb-3">
                        Uneseni račun nepostoji
                        </div>
                    </div>
                    <label>Ime platitelja:</label>
                    <input
                    className="form-control mb-3"
                    type="text"
                    name="ImePlatitelja"
                    value={inputs.ImePlatitelja || ""}
                    onChange={handleChange}
                    />
                    <div>
                        <label>Iznos:</label>
                        <input
                        className="form-control mb-3"
                        type="number"
                        id="Iznos"
                        name="Iznos"
                        value={inputs.Iznos||0}
                        onChange={handleChange}
                        />
                        <div className="invalid-feedback mb-3">
                        Nemože se uplatit više nego što ima na računu novaca
                        </div>
                    </div>
                    <div>
                        <label>Poziv na broj:</label>
                        <input
                        className="form-control mb-3 col"
                        type="text"
                        id="PozivNaBroj"
                        name="PozivNaBroj"
                        value={inputs.PozivNaBroj||""}
                        onChange={handleChange}
                        />
                         <div className="invalid-feedback mb-3">
                        Poziv na broj može biti ili prazan ili 12 znamenki
                        </div>
                    </div>
                    <div>
                        <label>Opis:</label>
                        <input
                        className="form-control mb-3"
                        type="text"
                        id="Opis"
                        name="Opis"
                        value={inputs.Opis||""}
                        onChange={handleChange}
                        /> 
                        <div className="invalid-feedback mb-3">
                        Opis nemože biti duži od 50 znakova
                        </div>
                    </div>
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