import { useEffect, useState } from "react";
import axios from 'axios';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider, {Search} from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';
import { useNavigate, Link } from "react-router-dom";



function Klijenti(){

    const [data, setData] = useState(null);
    const { SearchBar } = Search;
    const navigate= useNavigate();

    const header = [
        { text: 'Šifra', dataField: 'Sifra', sort: true },
        { text: 'OIB', dataField: 'OIB', sort: true },
        { text: 'Ime', dataField: 'Ime', sort: true },
        { text: 'Prezime', dataField: 'Prezime', sort: true },
        { text: 'Adresa', dataField: 'Adresa', sort: true },
        { text: 'Telefon', dataField: 'Telefon', sort: true },
        { text: 'Spol', dataField: 'Spol' },
      ];
      

      useEffect(() => {
        axios({
            method: 'post',
            url: 'http://localhost/KV/bankovnisustav/src/PHP/ReadWrite.php',
            data: {
                RequestId: 'Ucitaj_podatke_klijenti',
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

        const rowEvents = {
            onClick: (e, row, rowIndex) => {
                console.log(row.Sifra);
                navigate("/administracija/klijent/"+row.Sifra);
            }
          };

        if(data){
        return(
            <>
            <div className="container my-5">
                <ToolkitProvider
                    keyField="OIB"
                    data={ data }
                    columns={ header }
                    search> 
                    {
                      props => (
                    <div>
                      <SearchBar { ...props.searchProps } srText="Pretraživanje tablice" />
                      <Link to={'/administracija/novaOsoba/klijent'}><button className="btn btn-success m-3">Novi Klijent</button></Link>
                      <div className="container wrapper">
                        <BootstrapTable { ...props.baseProps } striped hover pagination={ paginationFactory() } rowEvents={ rowEvents } />
                      </div>
                    </div>
                      )
                    }   
                </ToolkitProvider>
            </div>

            </>
        );
        }
    
}

export default Klijenti;


/*const body = Array.from(new Array(57), () => {
        const rd = (Math.random() * 10).toFixed(1);
      
        if (rd > 0.5) {
          return {
            username: 'i-am-billy',
            realname: `Billy ${rd}`,
            location: 'Mars'
          };
        }
      
        return {
          username: 'john-nhoj',
          realname: `John ${rd}`,
          location: 'Saturn'
        };
      });
      /*const header = [
        { dataField: 'username', text: 'username', sort: true},
        { dataField: 'realname', text: 'realname', sort: true },
        { dataField: 'location', text: 'location' }
      ];*/

/*
function Data(){

    const [data, setData] = useState(null);
    
    useEffect(() => {
    axios({
        method: 'post',
        url: 'http://localhost/KV/bankovnisustav/src/PHP/ReadWrite.php',
        data: {
            RequestId: 'Ucitaj_podatke_klijenti',
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