import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios';
import { useEffect, useState } from "react";


function Klijent(){

    const [data, setData] = useState(null);
    const { KlijentID } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
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
        }, []);

    const handleClickDelete = (event) => {
        axios({
            method: 'post',
            url: 'http://localhost/KV/bankovnisustav/src/PHP/ReadWrite.php',
            data: {
                RequestId: 'Obrisi_klijenta',
                OIB: data.OIB
            },
            headers: { 
                "Content-Type": "multipart/form-data",
            } ,
        }).then(function (response) {
            //handle success
            console.log(response.data);
        
            navigate('/administracija/klijenti');
          }).catch(function (response) {
            //handle error
            console.log(response);
          });
    }

    if(data){
    return(
        <div className="container text-center mt-5">
            <h1 className="display-4">{data.Ime +" "+ data.Prezime}</h1>
            <p className="lead">{data.OIB}</p>
            <hr></hr>
            <button className="btn btn-danger m-3" onClick={handleClickDelete}>Obriši Klijenta</button>
            <button className="btn btn-success m-3">Novi Račun</button>
            <button className="btn btn-success m-3">Registracija za online bankarstvo</button>
        </div>
    );
    }
}

export default Klijent;