import { useEffect, useState } from "react";
import axios from 'axios';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider, {Search} from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';
import { Link } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import $ from 'jquery';



function Zaposlenici(){

    const [data, setData] = useState(null);
    const [onlineBankarstvo, setonlineBankarstvo]= useState(false);
    const [password, setPassword] = useState(null);
    const [sifra, setSifra] = useState(null);
    const [statistika, setStatistika] = useState(false);
    const [statData, setStatData]= useState(false);
    const { SearchBar } = Search;

    const header = [
        { text: 'Šifra', dataField: 'Sifra', sort: true },
        { text: 'OIB', dataField: 'OIB', sort: true },
        { text: 'Ime', dataField: 'Ime', sort: true },
        { text: 'Prezime', dataField: 'Prezime', sort: true },
        { text: 'Adresa', dataField: 'Adresa', sort: true },
        { text: 'Telefon', dataField: 'Telefon', sort: true },
        { text: 'Svota uplata', dataField: 'SvotaUplata', sort: true },
      ];
      

      useEffect(() => {
        UcitajZaposlenike();
        Statistika();
        }, []);
        async function Statistika(){
          axios({
            method: 'post',
            url: 'http://localhost/KV/bankovnisustav/src/PHP/ReadWrite.php',
            data: {
                RequestId: 'Statistika',
            },
            headers: { 
                "Content-Type": "multipart/form-data",
            } ,
          }).then(function (response) {
            //handle success
            console.log(response.data);
            setStatData(response.data);
          }).catch(function (response) {
            //handle error
            console.log(response);
          });
        }
        async function UcitajZaposlenike(){
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
        }
        function handleClickDelete(sifra){
          axios({
              method: 'post',
              url: 'http://localhost/KV/bankovnisustav/src/PHP/ReadWrite.php',
              data: {
                  RequestId: 'Obrisi_zaposlenika',
                  Sifra: sifra
              },
              headers: { 
                  "Content-Type": "multipart/form-data",
              } ,
          }).then(function (response) {
              //handle success
              console.log(response.data);
          
              setData("");
              UcitajZaposlenike();
            }).catch(function (response) {
              //handle error
              console.log(response);
            });
        }
        const expandRow = {
          renderer: (row) => (
              <div>
                  <button className="btn btn-success m-3" onClick={modalonlineBankarstvoOpen} onMouseDown={setSifra(row.Sifra)}>Promjena lozinke za online bankarstvo</button>
                  <button className="btn btn-danger m-3" onClick={()=>handleClickDelete(row.Sifra)}>Obriši zaposlenika</button>
              </div>
          ),
          onlyOneExpanding: true,
        }
        const modalonlineBankarstvoClose = (event) => {
          setonlineBankarstvo(false);
        }
        const modalonlineBankarstvoOpen=(event)=>{
          setonlineBankarstvo(true);
        }
        const modalStatistikaClose = (event) => {
          setStatistika(false);
        }
        const modalStatistikaOpen=(event)=>{
          setStatistika(true);
        }
        const handleClickOnlineBankarstvo=(event)=>{
          if($("#lozinka").val().length<6){
              $("#lozinka").attr('class', "form-control is-invalid");
              return;
          }else{
              $("#lozinka").attr('class', "form-control is-valid");
          }
          if(!window.confirm("Želite li promijeniti lozinku za online bankarstvo?")){
              return;
          }
          console.log(password+"dafdafaddffdafaddaf");
          axios({
              method: 'post',
              url: 'http://localhost/KV/bankovnisustav/src/PHP/ReadWrite.php',
              data: {
                  RequestId: 'Nova_lozinka_za_prijevu_bankara',
                  sifra: sifra,
                  password: password
              },
              headers: { 
                  "Content-Type": "multipart/form-data",
              } ,
          }).then(function (response) {
            //handle success
            console.log(response.data);
            setonlineBankarstvo(false);
            alert("Lozinka uspiješno promijenjena");
          }).catch(function (response) {
            //handle error
            console.log(response);
          });
      }
        if(data){
        return(
            <div className="container mt-1 p-5 col-sm-12 col-md-9 bg-white">
              <h3 className="display-5 mb-5">Svi Zaposlenici</h3>
                <ToolkitProvider
                    keyField="Sifra"
                    data={ data }
                    columns={ header }
                    search>
                    {
                      props => (
                    <div className="wrapper container">
                        <SearchBar { ...props.searchProps } srText="Pretraživanje tablice" />
                        <Link to={'/administracija/novaOsoba/zaposlenik'}><button className="btn btn-success m-3">Novi Zaposlenik</button></Link>
                        <button className="btn btn-success m-3" onClick={modalStatistikaOpen}>Statistika</button>
                        <BootstrapTable { ...props.baseProps } striped hover pagination={ paginationFactory() }  expandRow={expandRow} />
                     </div>
                      )
                    }   
                </ToolkitProvider>
                <Modal show={onlineBankarstvo} onHide={modalonlineBankarstvoClose}> 
                  <Modal.Header closeButton>
                    <Modal.Title>Promjena lozinke za online bankarstvo</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                      <form>
                      <label>Unesite novu lozinku:</label>
                      <input
                      className="form-control mb-3"
                      type="password"
                      name="Password"
                      id="lozinka"
                      value={password || ""}
                      onChange={(e)=>setPassword(e.target.value)}
                      required
                      />
                      <div className="invalid-feedback mb-3">
                          Lozinka mora imat 6 znakova
                      </div>
                      </form>
                  </Modal.Body>
                  <Modal.Footer>
                      <Button variant="secondary" onClick={modalonlineBankarstvoClose}>Zatvori</Button>
                      <Button variant="primary" onClick={handleClickOnlineBankarstvo}>Promijeni</Button>
                  </Modal.Footer>
                </Modal >

                <Modal show={statistika} onHide={modalStatistikaClose} size="lg"> 
                  <Modal.Header closeButton>
                    <Modal.Title>Statistika</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                      <label className="my-2">Ukupno računa: {statData.count}</label><br />
                      <label className="my-2">Ukupno saldo svih računa: {statData.ukupnoStanje}</label><br />
                      <div className="wrapper">
                        <label>Račun s najvećim brojem promjena: {statData.Broj}</label><br />
                        <table className="table my-2">
                          <thead>
                            <tr>
                              <th>Šifra računa</th>
                              <th>Šifra klijenta</th>
                              <th>Vrsta računa</th>
                              <th>Saldo</th>
                              <th>Datum_Otvaranja</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>{statData.IdRacuna}</td>
                              <td>{statData.IdKlijenta}</td>
                              <td>{statData.VrstaRacuna}</td>
                              <td>{statData.Stanje}</td>
                              <td>{statData.Datum_Otvaranja}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div className="wrapper">
                        <label>Račun s največom uplatom: {statData.Iznos}</label><br />
                        <table className="table my-2">
                          <thead>
                            <tr>
                              <th>Šifra računa</th>
                              <th>Šifra klijenta</th>
                              <th>Vrsta računa</th>
                              <th>Saldo</th>
                              <th>Datum_Otvaranja</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>{statData.mIdRacuna}</td>
                              <td>{statData.mIdKlijenta}</td>
                              <td>{statData.mVrstaRacuna}</td>
                              <td>{statData.mStanje}</td>
                              <td>{statData.mDatum_Otvaranja}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                  </Modal.Body>
                  <Modal.Footer>
                      <Button variant="secondary" onClick={modalStatistikaClose}>Zatvori</Button>
                  </Modal.Footer>
                </Modal >
            </div>
        );
        }
    
}
export default Zaposlenici;
