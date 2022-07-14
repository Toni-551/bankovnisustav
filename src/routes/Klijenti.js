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
        <div className="container mt-1 p-5 col-sm-12 col-md-9 bg-white">
          <h3 className="display-5 mb-5">Svi Klijenti</h3>
            <ToolkitProvider
                keyField="Sifra"
                data={ data }
                columns={ header }
                search> 
                {
                  props => (
                <div className="container wrapper">
                  <SearchBar { ...props.searchProps } srText="Pretraživanje tablice" />
                  <Link to={'/administracija/novaOsoba/klijent'}><button className="btn btn-success m-3">Novi Klijent</button></Link>
                  <BootstrapTable { ...props.baseProps } striped hover pagination={ paginationFactory() } rowEvents={ rowEvents } />
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
