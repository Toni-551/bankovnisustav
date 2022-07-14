import React from 'react';
import {useState} from 'react';
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import $ from 'jquery';

function NoviKlijent(){

    const [inputs, setInputs] = useState({"Vrsta":"Tekuči"});
    const navigate = useNavigate();
    const { IdOsoba } = useParams();

    var requestId;
    var route;
    var klijent=false;
    if(IdOsoba=='klijent'){
        requestId='Upisi_novog_klijenta';
        route='klijenti';
        klijent=true;
    }else{
        requestId='Upisi_novog_zaposlenika';
        route='zaposlenici';
    }
    const handleSubmit = (event) => {
        event.preventDefault();
        var validation = true;
        var reg = /^\d+$/;

        if($('#Ime').val().length==0){
            $('#Ime').attr('class','form-control is-invalid');
            validation=false; 
        }else{
            $('#Ime').attr('class','form-control is-valid');
        }
        if($('#Prezime').val().length==0){
            $('#Prezime').attr('class','form-control is-invalid');
            validation=false; 
        }else{
            $('#Prezime').attr('class','form-control is-valid');
        }
        if($('#Adresa').val().length==0){
            $('#Adresa').attr('class','form-control is-invalid');
            validation=false; 
        }else{
            $('#Adresa').attr('class','form-control is-valid');
        }

        if($('#Lozinka').val().length==0){
            $('#Lozinka').attr('class','form-control is-invalid');
            validation=false; 
        }else{
            $('#Lozinka').attr('class','form-control is-valid');
        }
        if($('#KorisnickoIme').val().length==0){
            $('#KorisnickoIme').attr('class','form-control is-invalid');
            validation=false; 
        }else{
            $('#KorisnickoIme').attr('class','form-control is-valid');
        }
        if(!($('#telefon').val().length == 10 && reg.test($('#telefon').val()))){
            $('#telefon').attr('class','form-control is-invalid');
            validation=false; 
        }else{
            $('#telefon').attr('class','form-control is-valid');
        }
        if(!ProvjeraOIBa(inputs.OIB || 0)){
            $('#oib').attr('class','form-control is-invalid');
            validation=false; 
        }else{
            $('#oib').attr('class','form-control is-valid');
        }
        if(!validation)return;
        UpisuBazu();
        
    }
    async function UpisuBazu(){
        var exist;
        await axios({
            method: 'post',
            url: 'http://localhost/KV/bankovnisustav/src/PHP/ReadWrite.php',
            data: {
                RequestId: 'Provjeri_korisnicko_ime',
                username:$('#KorisnickoIme').val(),
            },
            headers: { 
                "Content-Type": "multipart/form-data",
            } ,
        }).then(function (response) {
            //handle success
            console.log(response.data);
            //setCheck(response.data);
            exist=response.data;
            
        }).catch(function (response) {
            //handle error
            console.log(response);
        });
        if(exist){
            $('#KorisnickoIme').attr('class','form-control is-invalid');
            return;
        }else{
            $('#KorisnickoIme').attr('class','form-control is-valid');
        }
        if(!window.confirm("Želite li dodati novu osobu?")){
            return;
        }
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
                Vrsta: klijent?inputs.Vrsta:"",
                username:inputs.KorisnickoIme,
                password:inputs.Lozinka
            },
            headers: { 
                "Content-Type": "multipart/form-data",
            } ,
        }).then(function (response) {
            //handle success
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
        <div className='container mt-1 p-5 bg-white'>
        <form className='needs-validation' noValidate>
            <div>
            <label>Unesite OIB:</label>
            <input
            className="form-control mb-3"
            type="text"
            name="OIB"
            id="oib"
            value={inputs.OIB || ""}
            onChange={handleChange}
            required
            />
            <div className="invalid-feedback mb-3">
                OIB je neispravan.
            </div>
            </div>
            <label>Unesite Ime:</label>
            <input
            className="form-control mb-3"
            type="text"
            name="Ime"
            id="Ime"
            value={inputs.Ime || ""}
            onChange={handleChange}
            />
            <label>Unesite Prezime:</label>
            <input
            className="form-control mb-3"
            type="text"
            id="Prezime"
            name="Prezime"
            value={inputs.Prezime || ""}
            onChange={handleChange}
            />
            <label>Unesite Adresu:</label>
            <input
            className="form-control mb-3"
            type="text"
            name="Adresa"
            id="Adresa"
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
            value={inputs.Telefon || ""}
            onChange={handleChange}
            required
            />
            <div className="invalid-feedback mb-3">
                Unesite ispravan broj mobitela(10 brojeva).
            </div>
            </div>
            {klijent?<div>
                <label>Vrsta računa:</label>
                    <select name="Vrsta" className="form-control" onChange={handleChange}>
                        <option value="Tekuči">Tekuči račun</option>
                        <option value="Žiro">Žiro račun</option>
                    </select><br />
            </div>:""
            }
            <label>Podatci za prijavu online</label>
            <div>
                <label>Unesite korisničko ime:</label>
                <input
                className="form-control mb-3"
                type="text"
                id="KorisnickoIme"
                name="KorisnickoIme"
                value={inputs.KorisnickoIme || ""}
                onChange={handleChange}
                />
                <div className="invalid-feedback mb-3">
                    Korisničko ime ili postoji ili niste unijeli
                </div>
            </div>
            <div>
                <label>Unesite lozinku:</label>
                <input
                className="form-control mb-3"
                type="password"
                id="Lozinka"
                name="Lozinka"
                value={inputs.Lozinka || ""}
                onChange={handleChange}
                />
                <div className="invalid-feedback mb-3">
                    Morate unijeti lozinku
                </div>
            </div>
            <button className='btn btn-success' onClick={handleSubmit}>Dodaj novog klijenta</button>
        </form>
        </div>);

}

//provjera ispravnosti oib-a
function ProvjeraOIBa(OIB){
	// OIB ima 11 znamenaka i mora biti numeric.
	if(OIB.length!=11 && Number.isInteger(parseInt(OIB))){
		return false;
	}
	// Posljednja tj. 11. znamenka je kontrolna znamenka. Dobivena  je
    // izračunom  iz  prethodnih  10  znamenaka  po međunarodnoj  normi  ISO 7064 (MOD 11, 10).
    // Prva znamenka zbroji se s brojem 10. U sljedećim koracima to će biti ostatak koji će se zbrajati
    // s idućom znamenkom.
	var ostatak = 10;
	// Prođi kroz sve znamenke, osim zadnje.
	for(var i=0; i<10;i++){
		// Dohvati trenutni znak iz OIBa i castaj ga u int kako bismo mogli raditi operacije.
		var ternutnaZanmenka = parseInt(OIB[i]);
		// 1. Prva znamenka zbroji se s brojem 10, a svaka sljedeća s ostatkom u prethodnom koraku.
		var zbroj = ternutnaZanmenka + ostatak;
		// 2. Dobiveni  zbroj  cjelobrojno  (s  ostatkom)  podijeli  se  brojem  10;  ako  je  dobiveni
        // ostatak 0 zamijeni se brojem 10 (ovaj broj je tzv. međuostatak)
		var meduOstatak = zbroj % 10;
		if(meduOstatak==0){
			meduOstatak=10;
		}
		// 3. Dobiveni međuostatak pomnoži se brojem 2
		var umnozak=meduOstatak*2;
		// 4. Dobiveni  umnožak  cjelobrojno  (s  ostatkom)  podijeli se  brojem  11;  ovaj  ostatak
        // matematički nikako ne može biti 0 jer je rezultat prethodnog koraka uvijek paran broj
		ostatak = umnozak % 11;
		// 5. Slijedeća znamenka zbroji se s ostatkom u prethodnom koraku...
        // 6. Ponavljaju se koraci 2, 3, 4 i 5  dok se ne potroše sve znamenke...
	}
	var kontrolnaZnamenka;
	// 7. Razlika izmeñu broja 11 i ostatka u zadnjem koraku je kontrolna znamenka.
    // Ako je ostatak 1 kontrolna znamenka je 0 (11 1=10, a 10 ima dvije znamenke)
	if(ostatak==1){
		kontrolnaZnamenka=0;
	}else{
		kontrolnaZnamenka=11-ostatak;
	}
	// Provjeri dali kontrolne znamenka odgovara onoj u OIBu
	if(parseInt(OIB[10])==kontrolnaZnamenka){
		return true;
	}
	// Ako smo došli tu, kontrola nije prošla.
	return false;
}
export default NoviKlijent;