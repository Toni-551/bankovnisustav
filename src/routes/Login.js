import {useState} from 'react';
import { useNavigate} from 'react-router-dom';
import axios from 'axios';

function Login(){
    const [username, setUsername]= useState();
    const [password, setPassword]= useState();

    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        axios({
            method: 'post',
            url: 'http://localhost/KV/bankovnisustav/src/PHP/ReadWrite.php',
            data: {
                RequestId: 'Ucitaj_podatke_Login',
                username: username ,//|| "",
                password: password //|| ""
            },
            headers: { 
                "Content-Type": "multipart/form-data",
            } ,
             }).then(function (response) {
            //handle success
            console.log(response.data);
            if(response.data){
                navigate('/administracija/klijenti');
            }
             }).catch(function (response) {
            //handle error
            console.log(response);
          });
        }

        
    return(
    <div className="col-lg-6 mx-auto mt-5">
    <div className="card">
        <div className="card-body px-4 py-5 px-md-5">
            <form>
                <div className="form-outline">
                    <label className="form-label" htmlFor="username">Username:</label>
                    <input type="text" id="username" className="form-control" onChange={(e)=>{setUsername(e.target.value)}} />
                </div>
                <div className="form-outline">
                    <label className="form-label" htmlFor="password">Password:</label>
                    <input type="password" id="password" className="form-control" onChange={(e)=>{setPassword(e.target.value)}} />
                </div>
                <button className='btn btn-primary mt-2' onClick={handleSubmit}>Prijava</button>
            </form>
        </div>
    </div>
    
    </div>
    );
}

export default Login;