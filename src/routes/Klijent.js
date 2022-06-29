import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios';
import { useEffect, useState } from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';


function Klijent(){

    const [show, setShow] = useState(false);
    const [value, setValue]= useState(0);
    const [data, setData] = useState(null);
    const { KlijentID } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        axios({
            method: 'post',
            url: 'http://localhost/KV/bankovnisustav/src/PHP/ReadWrite.php',
            data: {
                RequestId: 'Ucitaj_podatke_klijenta',
                KlijentID: KlijentID
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

    const modalOpen = (event) => {
        setShow(true);
    }
    const modalClose = (event) => {
        setShow(false);
    }
    const handleClickDelete = (event) => {
        axios({
            method: 'post',
            url: 'http://localhost/KV/bankovnisustav/src/PHP/ReadWrite.php',
            data: {
                RequestId: 'Obrisi_klijenta',
                Sifra: data.Sifra
            },
            headers: { 
                "Content-Type": "multipart/form-data",
            } ,
        }).then(function (response) {
            //handle success
            console.log(response.data);
            
            navigate('/administracija/klijenti');
          }).catch(function (response) {
            //handle error
            console.log(response);
          });
    }
    const handleClickNoviRacun = (event) => {
        axios({
            method: 'post',
            url: 'http://localhost/KV/bankovnisustav/src/PHP/ReadWrite.php',
            data: {
                RequestId: 'Dodaj_racun',
                Value: value,
                Sifra: data.Sifra
            },
            headers: { 
                "Content-Type": "multipart/form-data",
            } ,
        }).then(function (response) {
          //handle success
          console.log(response.data);
          window.location.reload();
        }).catch(function (response) {
          //handle error
          console.log(response);
        });
    }

    if(data){
    return(
        <div className="container text-center mt-5">
            <h1 className="display-4">{data.Ime +" "+ data.Prezime}</h1>
            <p className="lead">{data.OIB}</p>
            <hr></hr>
            <button className="btn btn-success m-3" onClick={modalOpen}>Novi Račun</button>
            <button className="btn btn-success m-3">Online bankarstvo</button>
            <button className="btn btn-danger m-3" onClick={handleClickDelete}>Obriši Klijenta</button>
            <TableRacuni sifra={data.Sifra} />
            <Modal show={show} onHide={modalClose}> 
                <Modal.Header closeButton>
                  <Modal.Title>Novi Račun</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <label>Početna Uplata:</label>
                    <input
                    className="form-control mb-3"
                    type="text"
                    name="Ime"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    />
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={modalClose}>Close</Button>
                    <Button variant="primary" onClick={handleClickNoviRacun}>Napravi račun</Button>
                </Modal.Footer>
            </Modal >
        </div>
    );
    }
}



///777777777777777777777777777777777777777777777777777777777777777777777
function TableRacuni(props){

    const [showTransakcija, setShowTransakcija]= useState(false);
    const [tableData, setTableData]= useState(null);
    const [sifraRacuna, setSifraRacuna]= useState(null);
    const [inputs, setInputs] = useState({"Vrsta":"Uplata"});
    const sifraBankara = localStorage.getItem('Sifra')
    const header = [
        { text: 'Šifra', dataField: 'IdRacuna', sort: true },
        { text: 'Stanje', dataField: 'Stanje', sort: true },
        { text: 'Datum otvaranja', dataField: 'DatumOtvaranja', sort: true },
      ];
    useEffect(() => {
        UcitajRacune();

    },[]);

    async function UcitajRacune(){
        axios({
            method: 'post',
            url: 'http://localhost/KV/bankovnisustav/src/PHP/ReadWrite.php',
            data: {
                RequestId: 'Ucitaj_racune_klijenta',
                Sifra: props.sifra
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

    const modalTansactionOpen = (event) => {
        setShowTransakcija(true);
    }
    const modalTansactionClose = (event) => {
        setShowTransakcija(false);
    }

    async function handleClickDeleteAccount(sifraRacuna){
        axios({
            method: 'post',
            url: 'http://localhost/KV/bankovnisustav/src/PHP/ReadWrite.php',
            data: {
                RequestId: 'Obrisi_racun',
                Sifra: sifraRacuna
            },
            headers: { 
                "Content-Type": "multipart/form-data",
            } ,
        }).then(function (response) {
            //handle success
            console.log(response.data);
            //window.location.reload();
        }).catch(function (response) {
            //handle error
            console.log(response);
        });
        setTableData([]);
        UcitajRacune();
    }

    const expandRow = {
        renderer: (row) => (
            <div>
                <button className="btn btn-success m-3">Vidi transakcije</button>
                <button className="btn btn-success m-3" onClick={modalTansactionOpen} onMouseUp={setSifraRacuna(row.IdRacuna)}>Nova transakcija</button>
                <button className="btn btn-danger m-3" onClick={()=>handleClickDeleteAccount(row.IdRacuna)}>Obriši račun</button>
            </div>
        ),
        onlyOneExpanding: true,
        /*onExpand: (row, isExpand, rowIndex, e) => {
            setSifraRacuna(row.IdRacuna);
          },
          showExpandColumn: true*/
    };

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({...values, [name]: value}));
        console.log(value);
    }
    function ClickIzvrsiTransakciju (){
        if(sifraRacuna.length==0 || sifraBankara==0){alert("Greška u programu sa šiframa"); return;}
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
          setShowTransakcija(false);
          alert("jej");
          
        }).catch(function (response) {
          //handle error
          console.log(response);
        }); 
    }
     

    return(
        <div className="container my-5">
            <div className="container wrapper">
                <BootstrapTable keyField="IdRacuna" data={ tableData } columns={ header } striped hover pagination={ paginationFactory() } expandRow={expandRow}/>
            </div>
        
        <Modal show={showTransakcija} onHide={modalTansactionClose}> 
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
            <div className="row mx-1">
                <input
                className="form-control mb-3 col"
                type="text"
                name="PozivNaBroj"
                value={inputs.PozivNaBroj||""}
                onChange={handleChange}
                />
                <label className="col pt-1">{"asd"}</label>
            </div><br />
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
            <Button variant="secondary" onClick={modalTansactionClose}>Close</Button>
            <Button variant="primary" onClick={()=>ClickIzvrsiTransakciju()}>Izvrši transakciju</Button>
        </Modal.Footer>
    </Modal >
    </div>
    );
}

export default Klijent;
