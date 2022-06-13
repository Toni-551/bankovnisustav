import axios from 'axios';
import { useEffect, useState } from "react";
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider, {Search} from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';

function Racuni(){
    const [tableData, setTableData]= useState(null);
    const { SearchBar } = Search;

    const header = [
        { text: 'Šifra', dataField: 'IdRacuna', sort: true },
        { text: 'OIB', dataField: 'oKlijent.OIB', sort: true },
        { text: 'Ime klijenta', dataField: 'oKlijent.Ime', sort: true },
        { text: 'Prezime klijenta', dataField: 'oKlijent.Prezime', sort: true },
        { text: 'Adresa klijenta', dataField: 'oKlijent.Adresa', sort: true },
        { text: 'Saldo', dataField: 'Stanje', sort: true }
      ];
    useEffect(() => {
        axios({
            method: 'post',
            url: 'http://localhost/KV/bankovnisustav/src/PHP/ReadWrite.php',
            data: {
                RequestId: 'Ucitaj_racune',
            },
            headers: { 
                "Content-Type": "multipart/form-data",
            } ,
        }).then(function (response) {
            //handle success
            console.log(response.data);
            setTableData(response.data);
          }).catch(function (response) {
            //handle error
            console.log(response);
          });

    },[]);
    if(tableData){
        var i=0;
        return(
            <>
            <div className="container mt-5">
                <ToolkitProvider
                    keyField="id"
                    data={ tableData }
                    columns={ header }
                    search> 
                    {
                      props => (
                    <div>
                        <SearchBar { ...props.searchProps } srText="Pretraživanje tablice" />
                        <BootstrapTable { ...props.baseProps } striped hover pagination={ paginationFactory()} />
                     </div>
                      )
                    }   
                </ToolkitProvider>
            </div>

            </>
        );
    }
}
export default Racuni;

/*


*/