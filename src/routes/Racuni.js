import axios from 'axios';
import { useEffect, useState } from "react";
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import ToolkitProvider, {Search} from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';

function Racuni(){
    const [tableData, setTableData]= useState(null);
    const { SearchBar } = Search;
    const [showTransakcija, setShowTransakcija]= useState(false);
    const [newTransakcija, setNewTransakcija]= useState(false);
    const [inputs, setInputs] = useState({"Vrsta":"Uplata"});
    const [transactionData, setTransactionData]= useState(null);
    const sifraBankara = localStorage.getItem('Sifra');
    const [sifraRacuna, setSifraRacuna]= useState(null);

    const header = [
        { text: 'Šifra', dataField: 'IdRacuna', sort: true },
        { text: 'OIB', dataField: 'oKlijent.OIB', sort: true },
        { text: 'Ime klijenta', dataField: 'oKlijent.Ime', sort: true },
        { text: 'Prezime klijenta', dataField: 'oKlijent.Prezime', sort: true },
        { text: 'Adresa klijenta', dataField: 'oKlijent.Adresa', sort: true },
        { text: 'Saldo', dataField: 'Stanje', sort: true }
      ];
      const headerTransakcije = [
        { text: 'Šifra', dataField: 'Sifra', sort: true },
        { text: 'šifra bankara', dataField: 'Bankar.Sifra', sort: true },
        { text: 'Vrsta', dataField: 'Vrsta', sort: true },
        { text: 'Datum', dataField: 'Datum', sort: true },
        { text: 'Iznos', dataField: 'Iznos', sort: true },
        { text: 'Trenutno stanje', dataField: 'TrenutnoStanje', sort: true },
        { text: 'Platitelj', dataField: 'Platitelj', sort: true },
        { text: 'Opis', dataField: 'Opis', sort: true },
        { text: 'Poziv na broj', dataField: 'PozivNaBroj', sort: true },
      ];
    useEffect(() => {
      UcitajRacune();

    },[]);
    async function UcitajRacune(){
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
    }

    if(!tableData)return;
    if(tableData.length==0)return;

    const modalTansactionNewOpen = (event) => {
      setInputs({"Vrsta": "Uplata"});
      setNewTransakcija(true);
    }
    const modalTansactionNewClose = (event) => {
        setNewTransakcija(false);
    }
    const modalTansactionViewOpen=(event)=>{
        setTransactionData(tableData.find(x => x.IdRacuna==sifraRacuna).loTransakcije);
        setShowTransakcija(true);
    }
    const modalTansactionViewClose = (event) => {
        setShowTransakcija(false);
    }
    const expandRow = {
        renderer: (row) => (
          <div>
            <button className="btn btn-success m-3" onClick={modalTansactionViewOpen} onMouseUp={setSifraRacuna(row.IdRacuna)}>Vidi transakcije</button >
            <button className="btn btn-success m-3" onClick={modalTansactionNewOpen} onMouseUp={setSifraRacuna(row.IdRacuna)}>Nova transakcija</button>
          </div>
        ),
        onlyOneExpanding: true
      };

    const handleChange = (event) => {
      const name = event.target.name;
      const value = event.target.value;
      setInputs(values => ({...values, [name]: value}));
    }
    function ClickIzvrsiTransakciju (){
      if(sifraRacuna.length==0 || sifraBankara.length==0){alert("Greška u programu sa šiframa"); return;}
      console.log(sifraRacuna+" "+sifraBankara+" "+inputs.Vrsta+inputs.Opis+inputs.PozivNaBroj+inputs.ImePlatitelja);
      axios({
          method: 'post',
          url: 'http://localhost/KV/bankovnisustav/src/PHP/ReadWrite.php',
          data: {
              RequestId: 'Dodaj_Transakciju',
              SifraRacuna: sifraRacuna,
              SifraBankara: sifraBankara,
              Vrsta:inputs.Vrsta,
              Opis: inputs.Opis,
              PozivNaBroj: inputs.PozivNaBroj,
              ImePlatitelja:inputs.ImePlatitelja,
              Iznos: inputs.Vrsta=="Uplata"?inputs.Iznos:-inputs.Iznos
          },
          headers: { 
              "Content-Type": "multipart/form-data",
          } ,
      }).then(function (response) {
          //handle success
          console.log(response);
          setNewTransakcija(false);
          setTableData([]);
          UcitajRacune();
        
      }).catch(function (response) {
          //handle error
          console.log(response);
      }); 
    }
    return(
        <>
        <div className="container my-5 col-sm-12 col-md-8">
            <ToolkitProvider
                keyField="IdRacuna"
                data={ tableData }
                columns={ header }
                search> 
                {
                  props => (
                <div>
                    <SearchBar { ...props.searchProps } srText="Pretraživanje tablice" />
                    <div className="text-center">
                      <BootstrapTable { ...props.baseProps } striped hover pagination={ paginationFactory()} expandRow={expandRow} />
                    </div>
                 </div>
                  )
                }   
            </ToolkitProvider>
            <Modal size="xl" show={showTransakcija} onHide={modalTansactionViewClose}> 
          <Modal.Header closeButton>
            <Modal.Title>Pregled Transakcija</Modal.Title>
          </Modal.Header>
          <Modal.Body>
              <div className="container wrapper">
                  <BootstrapTable keyField="Sifra" data={ transactionData } columns={ headerTransakcije } striped hover pagination={ paginationFactory() } />
              </div>
          </Modal.Body>
          </Modal >
          
          <Modal show={newTransakcija} onHide={modalTansactionNewClose}> 
          <Modal.Header closeButton>
            <Modal.Title>Nova Transakcija</Modal.Title>
          </Modal.Header>
          <Modal.Body>
              <form>
              <label className="mb-3">Šifra računa: </label><br />
              <label>Ime platitelja:</label>
              <input
              className="form-control mb-3"
              type="text"
              name="ImePlatitelja"
              value={inputs.ImePlatitelja || ""}
              onChange={handleChange}
              />
              <label>Vrsta:</label>
              <select name="Vrsta" className="form-control" onChange={handleChange}>
                  <option value="Uplata">Uplata</option>
                  <option value="Isplata">Isplata</option>
              </select><br />
              <label>Iznos:</label>
              <input
              className="form-control mb-3"
              type="number"
              name="Iznos"
              value={inputs.Iznos||""}
              onChange={handleChange}
              />
              <label>Poziv na broj:</label>
              <input
              className="form-control mb-3 col"
              type="text"
              name="PozivNaBroj"
              value={inputs.PozivNaBroj||""}
              onChange={handleChange}
              />
              <label>Opis:</label>
              <input
              className="form-control mb-3"
              type="text"
              name="Opis"
              value={inputs.Opis||""}
              onChange={handleChange}
              /> 
              </form>
          </Modal.Body>
          <Modal.Footer>
              <Button variant="secondary" onClick={modalTansactionNewClose}>Close</Button>
              <Button variant="primary" onClick={()=>ClickIzvrsiTransakciju()}>Izvrši transakciju</Button>
          </Modal.Footer>
          </Modal >
        </div>
        </>
    );
  }

export default Racuni;

/*


*/