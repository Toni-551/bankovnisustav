import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import React from "react";
import axios from 'axios';
import { Card } from 'bootstrap'


function OnlineRacun(){
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
    
    /*data.map((x)=>
        (<Card
        bg={variant.toLowerCase()}
        key={variant}
        text={variant.toLowerCase() === 'light' ? 'dark' : 'white'}
        style={{ width: '18rem' }}
        className="mb-2"
        >
        <Card.Header>Header</Card.Header>
        <Card.Body>
          <Card.Title>{variant} Card Title </Card.Title>
          <Card.Text>
            Some quick example text to build on the card title and make up the
            bulk of the card's content.
          </Card.Text>
        </Card.Body>
        </Card>));*/
    return(
        <div className="container">
            
            
        </div>
    );
}


export default OnlineRacun;