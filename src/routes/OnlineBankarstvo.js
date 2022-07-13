import { Link, Outlet, Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from 'axios';

function OnlineBankarstvo(){
    
    const [data, setData]= useState(null);
    const sifraKlijenta = localStorage.getItem('Sifra');
    const {navigate}=useNavigate();

    const handleClick=(event)=>{
       localStorage.removeItem('Sifra');
    }
    
    useEffect(() => {
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
            console.log(response.data);
            setData(response.data);
          }).catch(function (response) {
            //handle error
            console.log(response);
          });
    }, []);


    if(localStorage.getItem('Sifra')){
        if(!data)return;
        console.log(data);
        var i = 0;
        function LoadNav(){
            return(
            data.map((x)=>(<li id={x.IdRacuna} className="nav-item">
                        <Link className='btn text-white' to={"/OnlineBankarstvo/racun/"+x.IdRacuna}>{x.VrstaRacuna}</Link>
                    </li>) )
                    );
        }
        return(
            <>
            <nav className='navbar navbar-expand-md justify-content-between bg-primary'>
                <ul className="navbar-nav">
                    <LoadNav />
                </ul>
                <div className="navbar-nav ml-auto">
                    <Link className='btn text-white' to="/Login" onClick={handleClick} >Odjava</Link>       
                </div>    
            </nav>
            <Outlet />
            </>
        );
    }else{
        return(
            <Navigate to="/login" />
        );
    }
}


export default OnlineBankarstvo;