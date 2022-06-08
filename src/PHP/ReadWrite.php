<?php

include "ConnectionDB.php";
include "Classes.php";


switch($_POST['RequestId']){
    case 'Ucitaj_podatke_klijenti':{
        $sQuery="SELECT * FROM klijenti;"; 
        $oStatement = $oConnection->query($sQuery);
        $oKlijenti = array();
        while($oRow = $oStatement->fetch(PDO::FETCH_BOTH))
        {
            $oKlijent = new Klijent($oRow['OIB'], $oRow['Ime'], $oRow['Prezime'], $oRow['Adresa'], $oRow['Telefon'], $oRow['Spol']);
            array_push($oKlijenti, $oKlijent);
        }
        echo json_encode($oKlijenti);
        break;
    }
    case 'Ucitaj_podatke_zaposlenici':{
        $sQuery="SELECT * FROM zaposlenici;"; 
        $oStatement = $oConnection->query($sQuery);
        $oZaposlenici = array();
        while($oRow = $oStatement->fetch(PDO::FETCH_BOTH))
        {
            $oZaposlenik = new Zaposlenik($oRow['OIB'], $oRow['Ime'], $oRow['Prezime'], $oRow['Adresa'], $oRow['Telefon'], $oRow['Spol']);
            array_push($oZaposlenici, $oZaposlenik);
        }
        echo json_encode($oZaposlenici);
        break;
    }case 'Ucitaj_podatke_Login':{
        $prijevljen = false;
        $sQuery="SELECT * FROM podatci_za_prijavu_bankari;"; 
        $oStatement = $oConnection->query($sQuery);
        $oKlijenti = array();
        while($oRow = $oStatement->fetch(PDO::FETCH_BOTH))
        {
            if($oRow['Korisnicko_ime']==$_POST['username'] && $oRow['Lozinka']==$_POST['password']){
                $prijevljen = true;
            }
        }
        echo $prijevljen;
        break;
    }case 'Ucitaj_podatke_klijenta':{
        $sQuery="SELECT * FROM klijenti WHERE OIB=".$_POST['KlijentID'].";"; 
        $oStatement = $oConnection->query($sQuery);
        while($oRow = $oStatement->fetch(PDO::FETCH_BOTH))
        {
            $oKlijent = new Klijent($oRow['OIB'], $oRow['Ime'], $oRow['Prezime'], $oRow['Adresa'], $oRow['Telefon'], $oRow['Spol']);
        }
        echo json_encode($oKlijent);
        break;
    }case 'Upisi_novog_klijenta':{
        $sQuery="INSERT INTO klijenti(OIB, Ime, Prezime, Adresa, Telefon, Spol) VALUES('".$_POST['OIB']."', '".$_POST['Ime']."', '".$_POST['Prezime']."', '".$_POST['Adresa']."', '".$_POST['Telefon']."', '".$_POST['Spol']."'); "; 
        $oStatement = $oConnection->query($sQuery);
        //echo $oRow['OIB'];
        break;
    }case 'Obrisi_klijenta':{
        $sQuery="DELETE FROM klijenti WHERE OIB='".$_POST['OIB']."'"; 
        $oStatement = $oConnection->query($sQuery);
        echo $sQuery;
        break;
    }case 'Ucitaj_podatke_zaposlenika':{
        $sQuery="SELECT * FROM zaposlenici WHERE OIB=".$_POST['ZaposlenikID'].";"; 
        $oStatement = $oConnection->query($sQuery);
        while($oRow = $oStatement->fetch(PDO::FETCH_BOTH))
        {
            $oZaposlenik = new Zaposlenik($oRow['OIB'], $oRow['Ime'], $oRow['Prezime'], $oRow['Adresa'], $oRow['Telefon'], $oRow['Spol']);
        }
        echo json_encode($oZaposlenik);
        break;
    }case 'Upisi_novog_zaposlenika':{
        $sQuery="INSERT INTO zaposlenici(OIB, Ime, Prezime, Adresa, Telefon, Spol) VALUES('".$_POST['OIB']."', '".$_POST['Ime']."', '".$_POST['Prezime']."', '".$_POST['Adresa']."', '".$_POST['Telefon']."', '".$_POST['Spol']."'); "; 
        $oStatement = $oConnection->query($sQuery);
        break;
    }case 'Obrisi_zaposlenika':{
        $sQuery="DELETE FROM zaposlenici WHERE OIB='".$_POST['OIB']."'"; 
        $oStatement = $oConnection->query($sQuery);
        echo $sQuery;
        break;
    }
    default:
        break;
}
?>