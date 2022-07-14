import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import React from "react";
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import $ from 'jquery';

function Transakcije(){
    const [data, setData] = useState(null);
    const [filter, setFilter]= useState("none");
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
    const handleChange=(event)=>{
        setFilter(event.target.value)
        setData([]);

        UcitajRacune();
    }
    var output;
    if(filter=="none"){
        output =data.map((x)=>
                (<div id={x.Sifra} className={`text-center card border border-${x.Iznos<0?"danger":"success"} m-3`}
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
                </div>)
            )
    }
    else if(filter=="uplate"){
        output= data.filter(x=>x.Iznos>0);
        output= output.map(x=>(<div id={x.Sifra} className={`text-center card border border-${x.Iznos<0?"danger":"success"} m-3`}
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
        </div>));
    }
    else if(filter=="isplate"){
        output= data.filter(x=>x.Iznos<0);
        output= output.map(x=>(<div id={x.Sifra} className={`text-center card border border-${x.Iznos<0?"danger":"success"} m-3`}
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
        </div>));
    }
    
    return(<div>
        <label>Vrsta računa:</label>
        <select name="filter" className="form-control" onChange={handleChange}>
            <option value="none">Sve Transakcije</option>
            <option value="uplate">Uplate</option>
            <option value="isplate">Isplate</option>
        </select><br />
        {output}
    </div>
    );
}
function OnlineRacun(){
    const [newTransakcija, setNewTransakcija]= useState(false);
    const [showDetalji, setShowDetalji]= useState(false);
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
        setInputs({"Vrsta":"Uplata", "Iznos":0});
        setNewTransakcija(true);
    }
    const modalTansactionNewClose = (event) => {
        setNewTransakcija(false);
    }
    const modalshowDetaljiOpen = (event) => {
        setShowDetalji(true);
    }
    const modalshowDetaljiClose = (event) => {
        setShowDetalji(false);
    }
    async function ProvjeraTransakcije(){
        var valid=1;
        if(parseFloat(inputs.Iznos)<=0 || parseFloat(inputs.Iznos)>parseFloat(racun.Stanje)){
            valid=0;
            $('#Iznos').attr('class','form-control is-invalid');
        }else{
            $('#Iznos').attr('class','form-control is-valid');
        }
        await axios({
            method: 'post',
            url: 'http://localhost/KV/bankovnisustav/src/PHP/ReadWrite.php',
            data: {
                RequestId: 'Provjera_racuna',
                Sifra: inputs.racunZaPrebacit||"",
                Racun: racun.IdRacuna
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
        }).catch(function (response) {
            //handle error
            console.log(response);
        });
        return parseFloat(valid);
    }
    async function ClickIzvrsiTransakciju (){
        if(await ProvjeraTransakcije()==0){
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
                Opis: inputs.Opis || "",
                ImePlatitelja:"Osobno",
                Iznos: -inputs.Iznos,
                TrenutnoStanje: parseFloat(racun.Stanje)-parseFloat(inputs.Iznos)
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
                Opis: inputs.Opis || "",
                ImePlatitelja:racun.oKlijent.Ime+" "+racun.oKlijent.Prezime,
                Iznos: inputs.Iznos,
                TrenutnoStanje: parseFloat(racun.Stanje)+parseFloat(inputs.Iznos)
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
        <div className="container mt-1 p-5 col-xl-8 col-md-8 col-xs-12 bg-white">
            <div className="bg-primary text-white container pb-4">
                <div className="pt-5 px-5">
                    <h4 className="display-5">{racun.VrstaRacuna} račun</h4>
                    <h4 className="display-5">{racun.IdRacuna}</h4>
                    <h5 className="display-6">{racun.Stanje} HRK</h5>
                </div>
                <nav className='navbar navbar-expand-md justify-content-center bg-success mt-5'>
                    <ul className="navbar-nav">
                        <li>
                            <button className="btn" onClick={modalTansactionNewOpen}>Nova transakcija</button>
                        </li>
                        <li>
                            <button className="btn" onClick={modalshowDetaljiOpen}>Info</button>
                        </li>
                    </ul>
                </nav>
            </div>
        <hr></hr>
        <Transakcije />

        <Modal show={showDetalji} onHide={modalshowDetaljiClose}> 
            <Modal.Header closeButton>
              <Modal.Title>Detalji</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h6>Naziv računa: {racun.VrstaRacuna}</h6><br/>
                <h6>IBAN: {racun.IdRacuna}</h6><br/>
                <h6>vlasnik: {racun.oKlijent.Ime+" "+racun.oKlijent.Prezime} </h6><br/>
                <h6>Raspoloživo sredstvo: {racun.Stanje} HRK</h6><br/>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={modalshowDetaljiClose}>Zatvori</Button>
            </Modal.Footer>
        </Modal >

        <Modal show={newTransakcija} onHide={modalTansactionNewClose}> 
            <Modal.Header closeButton>
              <Modal.Title>Nova Transakcija</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form>
                <label className="mb-3">Račun: {IdRacun} </label><br />
                <label className="mb-3">Trenutno stanje: {racun.Stanje} HRK</label><br />
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
                value={racun.oKlijent.Ime+" "+racun.oKlijent.Prezime}
                readOnly
                />
                <div>
                    <label>Iznos:</label>
                    <input
                    className="form-control mb-3"
                    type="number"
                    id="Iznos"
                    name="Iznos"
                    value={inputs.Iznos}
                    onChange={handleChange}
                    />
                    <div className="invalid-feedback mb-3">
                    Nemoguče je  uplatiti više nego što ima na računu novaca.
                    Nemoguče je uplatiti 0 kn
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
                <Button variant="secondary" onClick={modalTansactionNewClose}>Zatvori</Button>
                <Button variant="primary" onClick={()=>ClickIzvrsiTransakciju()}>Izvrši transakciju</Button>
            </Modal.Footer>
        </Modal >
        </div>
    );
}


export default OnlineRacun;