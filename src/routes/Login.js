import {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import $ from 'jquery';

function Login(){
    const [username, setUsername]= useState();
    const [password, setPassword]= useState();
    const [RequestId, setRequestId]=useState('Login_klijent');
    const [route, setRoute]=useState('/OnlineBankarstvo/');

    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        axios({
            method: 'post',
            url: 'http://localhost/KV/bankovnisustav/src/PHP/ReadWrite.php',
            data: {
                RequestId: RequestId,
                username: username || "",
                password: password || ""
            },
            headers: { 
                "Content-Type": "multipart/form-data",
            } ,
             }).then(function (response) {
            //handle success
            console.log(response.data);
            if(response.data){
                localStorage.setItem('Sifra', response.data);
                navigate(route);
            }else{
                $("#username").attr("class", "form-control is-invalid");
            $("#password").attr("class", "form-control is-invalid");
            }
             }).catch(function (response) {
            //handle error
            console.log(response);
            
          });
        }
    const handleChange=(event)=>{
        if (event.target.checked) {
            setRequestId('Login_bankar');
            setRoute('/administracija/klijenti');
          } else {
            setRequestId('Login_klijent');
            setRoute('/OnlineBankarstvo/');
          }
          
    }

    return(
    <div className="col-lg-6 mx-auto mt-5">
    <div className="card">
        <div className="card-header">Prijava</div>
        <div className="card-body px-4 py-5 px-md-5">
            <form>
                
                <div className="form-outline">
                    <label className="form-label" htmlFor="username">Username:</label>
                    <input type="text" id="username" className="form-control" onChange={(e)=>{setUsername(e.target.value)}} />
                </div>
                <div className="form-outline">
                    <label className="form-label" htmlFor="password">Password:</label>
                    <input type="password" id="password" className="form-control" onChange={(e)=>{setPassword(e.target.value)}} />
                    <div className="invalid-feedback mb-3"> Username ili pasword su neispravni</div>
                </div>
                <button className='btn btn-primary mt-2' onClick={handleSubmit}>Prijava</button>
                
            </form>
            <input type="checkbox" id="checkbox" onChange={handleChange} /><label>Prijava bankara</label>
        </div>
    </div>
    
    </div>
    );
}

export default Login;