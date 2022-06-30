import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import React from "react";
import axios from 'axios';

function Pocetna(){
    const [data, setData] = useState(null);
    const sifraKlijenta = localStorage.getItem('Sifra');
    const navigation = useNavigate();

    useEffect(() => {
        UcitajRacune();
        
    },[]);

    async function UcitajRacune(){
        axios({
            method: 'post',
            url: 'http://localhost/KV/bankovnisustav/src/PHP/ReadWrite.php',
            data: {
                RequestId: 'Ucitaj_racune_klijenta',
                Sifra: sifraKlijenta
            },
            headers: { 
                "Content-Type": "multipart/form-data",
            } ,
        }).then(function (response) {
            //handle success
            console.log(response.data.loTransakcije);
            navigation("racun/"+response.data[0].IdRacuna);
          }).catch(function (response) {
            //handle error
            console.log(response);
          });
    }
}
export default Pocetna