import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios';
import { useEffect, useState } from "react";


function Zaposlenik(){

    const [data, setData] = useState(null);
    const { ZaposlenikID } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        axios({
            method: 'post',
            url: 'http://localhost/KV/bankovnisustav/src/PHP/ReadWrite.php',
            data: {
                RequestId: 'Ucitaj_podatke_zaposlenika',
                ZaposlenikID: ZaposlenikID
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
                RequestId: 'Obrisi_zaposlenika',
                Sifra: data.Sifra
            },
            headers: { 
                "Content-Type": "multipart/form-data",
            } ,
        }).then(function (response) {
            //handle success
            console.log(response.data);
        
            navigate('/administracija/zaposlenici');
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
            <p className="lead">{data.Sifra}</p>
            <hr></hr>
            <button className="btn btn-danger m-3" onClick={handleClickDelete}>Obriši zaposlenika</button>
            <button className="btn btn-success m-3">Registracija za online bankarstvo</button>
        </div>
    );
    }
}

export default Zaposlenik;