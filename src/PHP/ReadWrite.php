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
            $oKlijent = new Klijent($oRow['Sifra'] ,$oRow['OIB'], $oRow['Ime'], $oRow['Prezime'], $oRow['Adresa'], $oRow['Telefon'], $oRow['Spol']);
            array_push($oKlijenti, $oKlijent);
        }
        echo json_encode($oKlijenti , JSON_UNESCAPED_UNICODE);
        break;
    }
    case 'Ucitaj_podatke_zaposlenici':{
        $sQuery="SELECT * FROM zaposlenici;"; 
        $oStatement = $oConnection->query($sQuery);
        $oZaposlenici = array();
        while($oRow = $oStatement->fetch(PDO::FETCH_BOTH))
        {
            $oZaposlenik = new Zaposlenik($oRow['Sifra'] ,$oRow['OIB'], $oRow['Ime'], $oRow['Prezime'], $oRow['Adresa'], $oRow['Telefon'], $oRow['Spol']);
            array_push($oZaposlenici, $oZaposlenik);
        }
        echo json_encode($oZaposlenici, JSON_UNESCAPED_UNICODE);
        break;
    }case 'Ucitaj_podatke_Login':{
        $prijevljen = false;
        $sQuery="SELECT * FROM podatci_za_prijavu_bankari;"; 
        $oStatement = $oConnection->query($sQuery);
        $oKlijenti = array();
        while($oRow = $oStatement->fetch(PDO::FETCH_BOTH))
        {
            if($oRow['Korisnicko_ime']==$_POST['username'] && $oRow['Lozinka']==$_POST['password']){
                $prijevljen = $oRow['Sifra'];
            }
        }
        echo $prijevljen;
        break;
    }case 'Ucitaj_podatke_klijenta':{
        $sQuery="SELECT * FROM klijenti WHERE Sifra=".$_POST['KlijentID'].";"; 
        $oStatement = $oConnection->query($sQuery);
        while($oRow = $oStatement->fetch(PDO::FETCH_BOTH))
        {
            $oKlijent = new Klijent($oRow['Sifra'], $oRow['OIB'], $oRow['Ime'], $oRow['Prezime'], $oRow['Adresa'], $oRow['Telefon'], $oRow['Spol']);
        }
        echo json_encode($oKlijent, JSON_UNESCAPED_UNICODE);
        break;
    }case 'Upisi_novog_klijenta':{
        $sQuery="SELECT MAX(Sifra)as oldSifra FROM klijenti";
        $sValue = $oConnection->query($sQuery)->fetch(PDO::FETCH_ASSOC);
        $sNewSifra= $sValue['oldSifra'];
        $sNewSifra +=1;
        $sQuery="INSERT INTO klijenti(Sifra, OIB, Ime, Prezime, Adresa, Telefon, Spol) VALUES('".$sNewSifra."','".$_POST['OIB']."', '".$_POST['Ime']."', '".$_POST['Prezime']."', '".$_POST['Adresa']."', '".$_POST['Telefon']."', '".$_POST['Spol']."'); "; 
        $oStatement = $oConnection->query($sQuery);
        break;
    }case 'Obrisi_klijenta':{
        $sQuery="DELETE FROM klijenti WHERE Sifra='".$_POST['Sifra']."'"; 
        $oStatement = $oConnection->query($sQuery);
        echo $sQuery;
        break;
    }case 'Ucitaj_podatke_zaposlenika':{
        $sQuery="SELECT * FROM zaposlenici WHERE Sifra=".$_POST['ZaposlenikID'].";"; 
        $oStatement = $oConnection->query($sQuery);
        while($oRow = $oStatement->fetch(PDO::FETCH_BOTH))
        {
            $oZaposlenik = new Zaposlenik($oRow['Sifra'], $oRow['OIB'], $oRow['Ime'], $oRow['Prezime'], $oRow['Adresa'], $oRow['Telefon'], $oRow['Spol']);
        }
        echo json_encode($oZaposlenik, JSON_UNESCAPED_UNICODE);
        break;
    }case 'Upisi_novog_zaposlenika':{
        $sQuery="SELECT MAX(Sifra)as oldSifra FROM zaposlenici";
        $sValue = $oConnection->query($sQuery)->fetch(PDO::FETCH_ASSOC);
        $sNewSifra= $sValue['oldSifra'];
        $sNewSifra +=1;
        $sQuery="INSERT INTO zaposlenici(Sifra, OIB, Ime, Prezime, Adresa, Telefon, Spol) VALUES('".$sNewSifra."','".$_POST['OIB']."', '".$_POST['Ime']."', '".$_POST['Prezime']."', '".$_POST['Adresa']."', '".$_POST['Telefon']."', '".$_POST['Spol']."'); "; 
        $oStatement = $oConnection->query($sQuery);
        break;
    }case 'Obrisi_zaposlenika':{
        $sQuery="DELETE FROM zaposlenici WHERE Sifra='".$_POST['Sifra']."'"; 
        $oStatement = $oConnection->query($sQuery);
        echo $sQuery;
        break;
    }case 'Ucitaj_racune':{
        $sQuery="SELECT * FROM racuni"; 
        $oStatement = $oConnection->query($sQuery);
        $oRacuni = array();
        while($oRow = $oStatement->fetch(PDO::FETCH_BOTH))
        {
            $squery="SELECT * FROM klijenti WHERE Sifra='".$oRow['Sifra_klijenta']."'"; 
            $ostatement = $oConnection->query($squery)->fetchObject();
            $klijent = new Klijent($ostatement->Sifra, $ostatement->OIB, $ostatement->Ime, $ostatement->Prezime, $ostatement->Adresa, $ostatement->Telefon, $ostatement->Spol);
            $oRacun = new Racun($oRow['idRacuni'], $oRow['Sifra_klijenta'], $oRow['Stanje'], $oRow['Datum_otvaranja'], $klijent);
            array_push($oRacuni, $oRacun);
        }
        echo json_encode($oRacuni, JSON_UNESCAPED_UNICODE);
        break;
    }case 'Ucitaj_racune_klijenta':{
        $sQuery="SELECT * FROM klijenti WHERE Sifra='".$_POST['Sifra']."'"; 
        $klijent = $oStatement = $oConnection->query($sQuery);
        $sQuery="SELECT * FROM racuni WHERE Sifra_klijenta='".$_POST['Sifra']."'"; 
        $oStatement = $oConnection->query($sQuery);
        $oRacuni = array();
        while($oRow = $oStatement->fetch(PDO::FETCH_BOTH))
        {
            $oRacun = new Racun($oRow['idRacuni'], $oRow['Sifra_klijenta'], $oRow['Stanje'], $oRow['Datum_otvaranja'], $klijent);
            array_push($oRacuni, $oRacun);
        }
        echo json_encode($oRacuni, JSON_UNESCAPED_UNICODE);
        break;
    }case 'Dodaj_racun':{
        $sQuery="SELECT MAX(idRacuni)as oldSifra FROM racuni";
        $sValue = $oConnection->query($sQuery)->fetch(PDO::FETCH_ASSOC);
        $sNewSifra= $sValue['oldSifra'];
        $sNewSifra +=1;
        $sQuery="INSERT INTO racuni (idRacuni, Sifra_klijenta, Stanje, Datum_otvaranja) VALUES ('".$sNewSifra."', '".$_POST['Sifra']."', '".$_POST['Value']."', '".date("d/m/Y")."');";
        $oStatement = $oConnection->query($sQuery);
        break;
    }case 'Obrisi_racun':{
        $sQuery="DELETE FROM racuni WHERE idRacuni='".$_POST['Sifra']."'"; 
        $oStatement = $oConnection->query($sQuery);
        echo $sQuery;
        break;
    }case 'Dodaj_Transakciju':{
        $sQuery="SELECT MAX(Sifra)as oldSifra FROM transakcije";
        $sValue = $oConnection->query($sQuery)->fetch(PDO::FETCH_ASSOC);
        $sNewSifra= $sValue['oldSifra'] || '10000000000';
        $sNewSifra +=1;
        $sQuery = "SELECT MAX(Stanje) as stanje FROM racuni WHERE idRacuni='".$_POST['SifraRacuna']."';";
        $sValue = $oConnection->query($sQuery)->fetch(PDO::FETCH_ASSOC);
        $stanje=$sValue['stanje']+$_POST['Iznos'];
        $sQuery="INSERT INTO transakcije (Sifra, Sifra_racun, Sifra_bankar, Vrsta, Datum, Opis, Poziv_na_broj, Ime_platitelja, Iznos, Trenutno_Stanje) VALUES  ('".$sNewSifra."', '".$_POST['SifraRacuna']."', '".$_POST['SifraBankara']."', '".$_POST['Vrsta']."', '".date("d/m/Y")."', '".$_POST['Opis']."', '".$_POST['PozivNaBroj']."', '".$_POST['Iznos']."', '".$stanje."' );";
        $oStatement = $oConnection->query($sQuery);
        echo "'".$sNewSifra."', '".$_POST['SifraRacuna']."', '".$_POST['SifraBankara']."', '".$_POST['Vrsta']."', '".date("d/m/Y")."', '".$_POST['Opis']."', '".$_POST['PozivNaBroj']."', '".$_POST['Iznos']."', '".$stanje."'";
        break;
    }
    default:
        break;
}

?>