import { Link, Outlet, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from 'axios';


 function Administracija(){
    //const [data, setData]=useState(null);
    // const sifra=localStorage.getItem('Sifra');

    // useEffect(() => {
    //     UcitajBankara();
    //   },[]);

    // async function UcitajBankara(){
    //     axios({
    //         method: 'post',
    //         url: 'http://localhost/KV/bankovnisustav/src/PHP/ReadWrite.php',
    //         data: {
    //             RequestId: 'Get_ime_bankara',
    //             sifra: localStorage.getItem('Sifra')
    //         },
    //         headers: { 
    //             "Content-Type": "multipart/form-data",
    //         } ,
    //     }).then(function (response) {
    //         //handle success
    //         console.log(response.data);
    //         setData(response.data);
    //       }).catch(function (response) {
    //         //handle error
    //         console.log(response);
    //       });
    // }

    const handleClick=(event)=>{
        localStorage.removeItem('Sifra');
    }
    if(localStorage.getItem('Sifra')){
        // if(!data) return;
        return(
            <>
            <nav className='navbar navbar-expand-md justify-content-between bg-primary'>
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <Link className='btn text-white' to="klijenti">Klijenti</Link>
                    </li>
                    <li className="nav-item">
                        <Link className='btn text-white' to="racuni">Racuni</Link>
                    </li>
                    <li className="nav-item">
                        <Link className='btn text-white' to="zaposlenici">Zaposlenici</Link>
                    </li>
                </ul>
                <div className="navbar-nav ml-auto">
                    {/* <button className="btn text-white" >{data.ime+" "+data.prezime}</button> */}
                    <Link className='btn text-white' to="/Login" onClick={handleClick}  >Odjava</Link>       
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


export default Administracija;