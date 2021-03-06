import axios from 'axios';
import { useEffect, useState } from "react";
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import ToolkitProvider, {Search} from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';
import $ from 'jquery';

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
      { text: 'Vrsta računa', dataField: 'VrstaRacuna'},
      { text: 'Saldo', dataField: 'Stanje', sort: true }
    ];
    const headerTransakcije = [
      { text: 'Šifra', dataField: 'Sifra', sort: true },
      { text: 'Bankar', dataField: 'Bankar.Sifra', sort: true },
      { text: 'Vrsta', dataField: 'Vrsta', sort: true },
      { text: 'Datum', dataField: 'Datum', sort: true },
      { text: 'Iznos', dataField: 'Iznos', sort: true },
      { text: 'Trenutno stanje', dataField: 'TrenutnoStanje', sort: true },
      { text: 'Platitelj', dataField: 'Platitelj', sort: true },
      { text: 'Opis', dataField: 'Opis', sort: true },
    ];
  useEffect(() => {
    UcitajRacune();
  },[]);
  useEffect(() => {
    if(inputs.Vrsta=="Isplata"){
        $("#imeplatitelja").attr("readonly",true);
        setInputs(values => ({...values, "ImePlatitelja": "Osobno"}));
    }else{
        $("#imeplatitelja").removeAttr("readonly",false);
    }
  },[inputs.Vrsta]);
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
    setInputs({"Vrsta":"Uplata", "Iznos":0, "ImePlatitelja":"Osobno"});
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
    if(parseFloat(inputs.Iznos)<0 || parseFloat(inputs.Iznos)>parseFloat(tableData.Stanje)){
      $('#Iznos').attr('class','form-control is-invalid');
      return;
    }else{
        $('#Iznos').attr('class','form-control is-valid');
    }
      if(!window.confirm("Želite li izvršiti transakciju?")){
        return;
    }
    var Iznos= inputs.Vrsta=="Uplata"?inputs.Iznos:-inputs.Iznos;
    var stanje=0;
    var ImePlatitelja=inputs.Vrsta=="Uplata"?inputs.ImePlatitelja:"Osobno";
    tableData.forEach(function(row){
        if(row.IdRacuna==sifraRacuna){
            stanje=row.Stanje;
        }
    });
    axios({
        method: 'post',
        url: 'http://localhost/KV/bankovnisustav/src/PHP/ReadWrite.php',
        data: {
            RequestId: 'Dodaj_Transakciju',
            SifraRacuna: sifraRacuna,
            SifraBankara: sifraBankara,
            Vrsta:inputs.Vrsta,
            Opis: inputs.Opis,
            PozivNaBroj: inputs.PozivNaBroj || "",
            ImePlatitelja:inputs.ImePlatitelja || "",
            Iznos: Iznos,
            TrenutnoStanje: parseFloat(stanje)+parseFloat(Iznos)
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
      <div className="container mt-1 p-5 col-sm-12 col-md-9 bg-white">
      <h3 className="display-5 mb-5">Svi Računi</h3>
          <ToolkitProvider
              keyField="IdRacuna"
              data={ tableData }
              columns={ header }
              search> 
              {
                props => (
              <div className="container wrapper">
                  <SearchBar { ...props.searchProps } srText="Pretraživanje tablice" />
                  <div className="text-center mt-3">
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
              <label className="mb-3">Šifra računa: {sifraRacuna}</label><br />
              <label className="mb-3">Trenutno stanje: {sifraRacuna?tableData.find(element=>element.IdRacuna==sifraRacuna).Stanje:""}</label><br />
              <label>Ime platitelja:</label>
              <input
              className="form-control mb-3"
              type="text"
              name="ImePlatitelja"
              id="imeplatitelja"
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
              id="Iznos"
              value={inputs.Iznos}
              onChange={handleChange}
              />
               <div className="invalid-feedback mb-3">
                  Nemože se uplatit više nego što ima na računu novaca
                </div>
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