import { useEffect, useState } from "react";
import axios from 'axios';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider, {Search} from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';
import { useNavigate, Link } from "react-router-dom";



function Zaposlenici(){

    const [data, setData] = useState(null);
    const { SearchBar } = Search;
    const navigate= useNavigate();

    const header = [
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
                RequestId: 'Ucitaj_podatke_zaposlenici',
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
                console.log(row.OIB);
                navigate("/administracija/zaposlenik/"+row.OIB);
            }
          };

        if(data){
        return(
            <div className="container mt-5">
                <ToolkitProvider
                    keyField="id"
                    data={ data }
                    columns={ header }
                    search>
                    {
                      props => (
                    <div>
                        <SearchBar { ...props.searchProps } srText="Pretraživanje tablice" />
                        <Link to={'/administracija/novaOsoba/zaposlenik'}><button className="btn btn-success m-3">Novi Zaposlenik</button></Link>
                        <BootstrapTable { ...props.baseProps } striped hover pagination={ paginationFactory() }  rowEvents={ rowEvents } />
                     </div>
                      )
                    }   
                </ToolkitProvider>
            </div>
        );
        }
    
}
export default Zaposlenici;

/*


*/