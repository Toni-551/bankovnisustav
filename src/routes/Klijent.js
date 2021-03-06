import { useParams, useNavigate, Link } from "react-router-dom";
import axios from 'axios';
import { useEffect, useState } from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import $ from 'jquery';

function Klijent(){

    const [show, setShow] = useState(false);
    const [value, setValue]= useState(0);
    const [data, setData] = useState(null);
    const [password, setPassword] = useState(null);
    const [vrstaRacuna, setVrstaRacuna]=useState("Tekuči");
    const [onlineBankarstvo, setonlineBankarstvo]= useState(false);
    const [tableData, setTableData]= useState(null);
    const [prop, setProp]= useState("false");
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
          UcitajRacune();
    }, []);

    async function UcitajRacune(){
        axios({
            method: 'post',
            url: 'http://localhost/KV/bankovnisustav/src/PHP/ReadWrite.php',
            data: {
                RequestId: 'Ucitaj_racune_klijenta',
                Sifra: KlijentID
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
    const modalOpen = (event) => {
        setShow(true);
        if(tableData.length==1){
            tableData[0].VrstaRacuna=="Žiro"?setVrstaRacuna("Tekuči"):setVrstaRacuna("Žiro");
            setProp("true");
            console.log(vrstaRacuna);
        }
    }
    const modalClose = (event) => {
        setShow(false);
    }
    const modalonlineBankarstvoClose = (event) => {
        setonlineBankarstvo(false);
    }
    const modalonlineBankarstvoOpen=(event)=>{
        setonlineBankarstvo(true);
    }
    const handleClickDelete = (event) => {
        if(!window.confirm("Želite li obrisati klijenta?")){
            return;
        }
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
        if(!window.confirm("Želite li dodati novi račun?")){
            return;
        }
        
        axios({
            method: 'post',
            url: 'http://localhost/KV/bankovnisustav/src/PHP/ReadWrite.php',
            data: {
                RequestId: 'Dodaj_racun',
                Value: value,
                Sifra: data.Sifra,
                Vrsta: vrstaRacuna
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
                RequestId: 'Nova_lozinka_za_prijevu_klijent',
                sifra: KlijentID,
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
        <div className="container text-center mt-1 p-5 col-sm-12 col-md-9 bg-white">
            <h1 className="display-4">{data.Ime +" "+ data.Prezime}</h1>
            <p className="lead">{data.OIB}</p>
            <hr></hr>
            <button className="btn btn-success m-3" id="noviRacun" onClick={modalOpen}>Novi Račun</button>
            <Link className="btn btn-success m-3" to={"/administracija/azurirajklijenta/"+data.Sifra}>Ažuriraj klijenta</Link>
            <button className="btn btn-success m-3" onClick={modalonlineBankarstvoOpen}>Online bankarstvo</button>
            <button className="btn btn-danger m-3" onClick={handleClickDelete}>Obriši Klijenta</button>
            <TableRacuni sifra={data.Sifra} />
            <Modal centered show={show} onHide={modalClose}> 
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
                    <label>Vrsta računa:</label>
                    <select name="Vrsta" id="Vrsta" disabled={prop} value={vrstaRacuna} className="form-control" onChange={(e)=>setVrstaRacuna(e.target.value)}>
                        <option value="Tekuči">Tekuči račun</option>
                        <option value="Žiro">Žiro račun</option>
                    </select><br />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={modalClose}>Zatvori</Button>
                    <Button variant="primary" onClick={handleClickNoviRacun}>Napravi račun</Button>
                </Modal.Footer>
            </Modal >

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
        </div>
    );
    }
}

/////////////////////////////////
function TableRacuni(props){

    const [showTransakcija, setShowTransakcija]= useState(false);
    const [newTransakcija, setNewTransakcija]= useState(false);
    const [transactionData, setTransactionData]= useState(null);
    const [tableData, setTableData]= useState(null);
    const [sifraRacuna, setSifraRacuna]= useState(null);
    const [inputs, setInputs] = useState({});
    const sifraBankara = localStorage.getItem('Sifra');
    const header = [
        { text: 'Šifra', dataField: 'IdRacuna', sort: true },
        { text: 'Stanje', dataField: 'Stanje', sort: true },
        { text: 'Vrsta', dataField: 'VrstaRacuna', sort: true },
        { text: 'Datum otvaranja', dataField: 'DatumOtvaranja', sort: true },
      ];
      const headerTransakcije = [
        { text: 'Šifra', dataField: 'Sifra', sort: true },
        { text: 'Bankar', dataField:'Bankar.Sifra', sort: true },
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
    if(tableData.length>=2){
        $('#noviRacun').attr("disabled", "");
    }
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
   

    async function handleClickDeleteAccount(sifraRacuna){
        if(!window.confirm("Želite li Obrisati račun?")){
            return;
        }
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
            setTableData([]);
            UcitajRacune();
            //window.location.reload();
        }).catch(function (response) {
            //handle error
            console.log(response);
        });
        
    }

    const expandRow = {
        renderer: (row) => (
            <div>
                <button className="btn btn-success m-3" onClick={modalTansactionViewOpen} onMouseUp={setSifraRacuna(row.IdRacuna)}>Vidi transakcije</button>
                <button className="btn btn-success m-3" onClick={modalTansactionNewOpen} onMouseUp={setSifraRacuna(row.IdRacuna)}>Nova transakcija</button>
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
        console.log(inputs.Vrsta);
        
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
                Opis: inputs.Opis || "",
                ImePlatitelja:inputs.ImePlatitelja || "",
                Iznos: Iznos,
                TrenutnoStanje: parseFloat(stanje)+parseFloat(Iznos)
            },
            headers: { 
                "Content-Type": "multipart/form-data",
            } ,
        }).then(function (response) {
            //handle success
            console.log(response.data);
            setNewTransakcija(false);
            setTableData([]);
            UcitajRacune();
          
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

            <Modal size="xl" show={showTransakcija} onHide={modalTansactionViewClose}> 
            <Modal.Header closeButton>
              <Modal.Title>Pregled Transakcija</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="container wrapper">
                    <BootstrapTable keyField="Sifra" data={ transactionData } columns={ headerTransakcije } striped hover pagination={ paginationFactory() }  />
                </div>
            </Modal.Body>
            </Modal >

            <Modal show={newTransakcija} onHide={modalTansactionNewClose}> 
            <Modal.Header closeButton>
              <Modal.Title>Nova Transakcija</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form>
                <label className="mb-3">Račun: {sifraRacuna}</label><br />
                <label className="mb-3">Trenutno stanje: {sifraRacuna?tableData.find(element=>element.IdRacuna==sifraRacuna).Stanje:""} HRK</label><br />
                <label>Ime platitelja:</label>
                <input
                className="form-control mb-3"
                type="text"
                id="imeplatitelja"
                name="ImePlatitelja"
                value={inputs.ImePlatitelja}
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
                id="tableData"
                name="Iznos"
                value={inputs.Iznos}
                onChange={handleChange}
                required
                />
                <div className="invalid-feedback mb-3">
                    Nemoguća isplata više novaca nego što ima na računu
                </div>
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
                <Button variant="secondary" onClick={modalTansactionNewClose}>Zatvori</Button>
                <Button variant="primary" onClick={()=>ClickIzvrsiTransakciju()}>Izvrši transakciju</Button>
            </Modal.Footer>
            </Modal >
        </div>
    );
}

export default Klijent;
