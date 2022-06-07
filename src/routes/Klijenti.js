import { useEffect, useState } from "react";
import axios from 'axios';


function Data(){
    const arr= [1,2,3,4,5];

    const [data, setData] = useState(null);
    
    useEffect(() => {
    axios({
        method: 'post',
        url: 'http://localhost/KV/bankovnisustav/src/PHP/ReadWrite.php',
        data: {
            RequestId: 'Ucitaj_podatke',
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

    if(data){
    var result = data.map((x)=>
        <tr>
            <td>{x.OIB}</td>
            <td>{x.Ime}</td>
            <td>{x.Prezime}</td>
            <td>{x.Adresa}</td>
            <td>{x.Telefon}</td>
            <td>{x.Spol}</td>
        </tr>
    );
    console.log(result);
    return(result);
    }else{
        return(
            <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
        );
    }
}

function Klijent(){
    return(
        <div className='container'>
            <table className='table table-striped'>
                <thead>
                  <tr>
                    <th>Oib</th>
                    <th>Ime</th>
                    <th>Prezime</th>
                    <th>Adresa</th>
                    <th>Telefon</th>
                    <th>Spol</th>
                  </tr>
                </thead>
                <tbody>
                    <Data />
                </tbody>
            </table>
        </div>

    );
}
export default Klijent;

/*


*/