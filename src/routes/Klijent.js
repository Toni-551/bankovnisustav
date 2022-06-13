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
        
            navigate('/administracija/klijenti');
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
            <button className="btn btn-danger m-3" onClick={handleClickDelete}>Obriši Klijenta</button>
            <button className="btn btn-success m-3" onClick={modalOpen}>Novi Račun</button>
            <button className="btn btn-success m-3">Online bankarstvo</button>
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
function TableRacuni(props){

    const [tableData, setTableData]= useState(null);

    const header = [
        { text: 'Šifra', dataField: 'IdRacuna', sort: true },
        { text: 'Stanje', dataField: 'Stanje', sort: true },
        { text: 'Datum otvaranja', dataField: 'DatumOtvaranja', sort: true },
      ];
    useEffect(() => {
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

    },[]);
    if(tableData){
        return(
            <div className="container mt-5">
                <BootstrapTable keyField="id" data={ tableData } columns={ header } striped hover pagination={ paginationFactory() }/>
            </div>
        );
    }
}

export default Klijent;
