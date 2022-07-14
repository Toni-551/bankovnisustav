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
            $oKlijent = new Klijent($oRow['Sifra'] ,$oRow['OIB'], $oRow['Ime'], $oRow['Prezime'], $oRow['Adresa'], $oRow['Telefon']);
            array_push($oKlijenti, $oKlijent);
        }
        echo json_encode($oKlijenti , JSON_UNESCAPED_UNICODE);
        break;
    }case 'Ucitaj_podatke_zaposlenici':{
        $sQuery="SELECT * FROM zaposlenici;"; 
        $oStatement = $oConnection->query($sQuery);
        $oZaposlenici = array();
        while($oRow = $oStatement->fetch(PDO::FETCH_BOTH))
        {
            $sQuery="SELECT SUM(Iznos)as uIznos FROM transakcije WHERE Sifra_bankar='".$oRow['Sifra']."' AND Iznos>0;"; 
            $oValue = $oConnection->query($sQuery)->fetch(PDO::FETCH_ASSOC);
            $svalue= $oValue['uIznos'];
            if(!$svalue)$svalue=0;
            $oZaposlenik = new Zaposlenik($oRow['Sifra'] ,$oRow['OIB'], $oRow['Ime'], $oRow['Prezime'], $oRow['Adresa'], $oRow['Telefon'], $svalue);
            array_push($oZaposlenici, $oZaposlenik);
        }
        echo json_encode($oZaposlenici, JSON_UNESCAPED_UNICODE);
        break;
    }case 'Login_bankar':{
        $prijevljen = false;
        $sQuery="SELECT * FROM podatci_za_prijavu_bankari;"; 
        $oStatement = $oConnection->query($sQuery);
        $oKlijenti = array();
        while($oRow = $oStatement->fetch(PDO::FETCH_BOTH))
        {
            if(strtolower($oRow['Korisnicko_ime'])==strtolower($_POST['username']) && $oRow['Lozinka']==$_POST['password']){
                $prijevljen = $oRow['Sifra'];
            }
        }
        echo $prijevljen;
        break;
    }case 'Login_klijent':{
        $prijevljen = false;
        $sQuery="SELECT * FROM podatci_za_prijavu_klijenti;"; 
        $oStatement = $oConnection->query($sQuery);
        $oKlijenti = array();
        while($oRow = $oStatement->fetch(PDO::FETCH_BOTH))
        {
            if(strtolower($oRow['Korisnicko_ime'])==strtolower($_POST['username']) && $oRow['Lozinka']==$_POST['password']){
                $prijevljen = $oRow['Sifra'];
            }
        }
        echo $prijevljen;
        break;
    }case 'Ucitaj_podatke_klijenta':{
        $sQuery="SELECT * FROM klijenti WHERE Sifra='".$_POST['KlijentID']."';"; 
        $oStatement = $oConnection->query($sQuery);
        while($oRow = $oStatement->fetch(PDO::FETCH_BOTH))
        {
            $oKlijent = new Klijent($oRow['Sifra'], $oRow['OIB'], $oRow['Ime'], $oRow['Prezime'], $oRow['Adresa'], $oRow['Telefon']);
        }
        echo json_encode($oKlijent, JSON_UNESCAPED_UNICODE);
        break;
    }case 'Upisi_novog_klijenta':{
        $sQuery="SELECT MAX(Sifra)as oldSifra FROM klijenti";
        $sValue = $oConnection->query($sQuery)->fetch(PDO::FETCH_ASSOC);
        $sNewSifra= $sValue['oldSifra'];
        if(!$sNewSifra)$sNewSifra='23061335563';
        $sNewSifra +=1;
        $sQuery="INSERT INTO klijenti(Sifra, OIB, Ime, Prezime, Adresa, Telefon) VALUES('".$sNewSifra."','".$_POST['OIB']."', '".$_POST['Ime']."', '".$_POST['Prezime']."', '".$_POST['Adresa']."', '".$_POST['Telefon']."'); "; 
        $oStatement = $oConnection->query($sQuery);
        //racun:
        $sQuery="SELECT idRacuni FROM racuni";
        $sValue = $oConnection->query($sQuery)->fetch(PDO::FETCH_ASSOC);
        $lIdRacuna= $sValue;
        do{
        $sRacunSifra=rand(1000000000, 9999999999);
        }while(in_array($sRacunSifra, $lIdRacuna));
        $sRacunSifra="HR256872103".$sRacunSifra;
        $sQuery="INSERT INTO racuni (idRacuni, Sifra_klijenta, Stanje, Datum_otvaranja, Vrsta_racuna) VALUES ('".$sRacunSifra."', '".$sNewSifra."', '0', '".date("d/m/Y")."', '".$_POST['Vrsta']."');";
        $oStatement = $oConnection->query($sQuery);
        $sQuery="INSERT INTO podatci_za_prijavu_klijenti (Sifra, Korisnicko_ime, Lozinka) VALUES ('".$sNewSifra."', '".$_POST['username']."', '".$_POST['password']."')";
        $oStatement = $oConnection->query($sQuery);
        break;
    }case 'Obrisi_klijenta':{
        $sQuery="DELETE FROM klijenti WHERE Sifra='".$_POST['Sifra']."'"; 
        $oStatement = $oConnection->query($sQuery);
        $sQuery="DELETE FROM Racuni WHERE Sifra_klijenta='".$_POST['Sifra']."'"; 
        $oStatement = $oConnection->query($sQuery);
        $sQuery="DELETE FROM podatci_za_prijavu_klijenti WHERE Sifra='".$_POST['Sifra']."'"; 
        $oStatement = $oConnection->query($sQuery);
        echo $sQuery;
        break;
    }case 'Ucitaj_podatke_zaposlenika':{
        $sQuery="SELECT * FROM zaposlenici WHERE Sifra=".$_POST['ZaposlenikID'].";"; 
        $oStatement = $oConnection->query($sQuery);
        while($oRow = $oStatement->fetch(PDO::FETCH_BOTH))
        {
            $oZaposlenik = new Zaposlenik($oRow['Sifra'], $oRow['OIB'], $oRow['Ime'], $oRow['Prezime'], $oRow['Adresa'], $oRow['Telefon']);
        }
        echo json_encode($oZaposlenik, JSON_UNESCAPED_UNICODE);
        break;
    }case 'Upisi_novog_zaposlenika':{
        $sQuery="SELECT MAX(Sifra)as oldSifra FROM zaposlenici";
        $sValue = $oConnection->query($sQuery)->fetch(PDO::FETCH_ASSOC);
        $sNewSifra= $sValue['oldSifra'];
        if(!$sNewSifra)$sNewSifra='56261885311';
        $sNewSifra +=1;
        $sQuery="INSERT INTO zaposlenici(Sifra, OIB, Ime, Prezime, Adresa, Telefon) VALUES('".$sNewSifra."','".$_POST['OIB']."', '".$_POST['Ime']."', '".$_POST['Prezime']."', '".$_POST['Adresa']."', '".$_POST['Telefon']."'); "; 
        $oStatement = $oConnection->query($sQuery);
        $sQuery="INSERT INTO podatci_za_prijavu_bankari (Sifra, Korisnicko_ime, Lozinka) VALUES ('".$sNewSifra."', '".$_POST['username']."', '".$_POST['password']."')";
        $oStatement = $oConnection->query($sQuery);
        break;
    }case 'Obrisi_zaposlenika':{
        $sQuery="DELETE FROM zaposlenici WHERE Sifra='".$_POST['Sifra']."'"; 
        $oStatement = $oConnection->query($sQuery);
        $sQuery="DELETE FROM podatci_za_prijavu_bankari WHERE Sifra='".$_POST['Sifra']."'"; 
        $oStatement = $oConnection->query($sQuery);
        echo $sQuery;
        break;
    }case 'Ucitaj_racun':{
        $sQuery="SELECT * FROM transakcije WHERE Sifra_racun='".$_POST['Sifra']."' ORDER BY Sifra DESC"; 
        $aStatement = $oConnection->query($sQuery);
        $oTransakcije= array();
        while($aRow = $aStatement->fetch(PDO::FETCH_BOTH))
        {
            $sQuery="SELECT * FROM zaposlenici WHERE Sifra='".$aRow['Sifra_bankar']."'"; 
            $ostatement = $oConnection->query($sQuery)->fetchObject();
            $bankar=new Zaposlenik("Online");
            if($ostatement){
                $bankar = new Zaposlenik($ostatement->Sifra, $ostatement->OIB, $ostatement->Ime, $ostatement->Prezime, $ostatement->Adresa, $ostatement->Telefon);
            }
            $oTransakcija = new Transakcija($aRow['Sifra'], $aRow['Sifra_racun'], $bankar, $aRow['Vrsta'], $aRow['Datum'], $aRow['Opis'], $aRow['Ime_platitelja'],$aRow['Iznos'], $aRow['Trenutno_Stanje']);
            array_push($oTransakcije, $oTransakcija);
        }
        $sQuery="SELECT * FROM racuni WHERE idRacuni='".$_POST['Sifra']."'";
        $aStatement = $oConnection->query($sQuery)->fetchObject();

        $squery="SELECT * FROM klijenti WHERE Sifra='".$aStatement->Sifra_klijenta."'"; 
        $ostatement = $oConnection->query($squery)->fetchObject();
        $klijent = new Klijent($ostatement->Sifra, $ostatement->OIB, $ostatement->Ime, $ostatement->Prezime, $ostatement->Adresa, $ostatement->Telefon);

        $oRacun = new Racun($aStatement->idRacuni, $aStatement->Sifra_klijenta, $aStatement->Stanje, $aStatement->Datum_otvaranja, $aStatement->Vrsta_racuna, $klijent, $oTransakcije);
        echo json_encode($oRacun, JSON_UNESCAPED_UNICODE);
        break;
    }case 'Ucitaj_racune':{
        $sQuery="SELECT * FROM racuni WHERE Sifra_klijenta!=''"; 
        $oStatement = $oConnection->query($sQuery);
        $oRacuni = array();
        while($oRow = $oStatement->fetch(PDO::FETCH_BOTH))
        {
            $sQuery="SELECT * FROM transakcije WHERE Sifra_racun='".$oRow['idRacuni']."'"; 
            $aStatement = $oConnection->query($sQuery);
            $oTransakcije= array();
            while($aRow = $aStatement->fetch(PDO::FETCH_BOTH))
            {
                $sQuery="SELECT * FROM zaposlenici WHERE Sifra='".$aRow['Sifra_bankar']."'"; 
                $ostatement = $oConnection->query($sQuery)->fetchObject();
                $bankar=new Zaposlenik("Online");
                if($ostatement){
                    $bankar = new Zaposlenik($ostatement->Sifra, $ostatement->OIB, $ostatement->Ime, $ostatement->Prezime, $ostatement->Adresa, $ostatement->Telefon);
                }
                $oTransakcija = new Transakcija($aRow['Sifra'], $aRow['Sifra_racun'], $bankar, $aRow['Vrsta'], $aRow['Datum'], $aRow['Opis'], $aRow['Ime_platitelja'],$aRow['Iznos'], $aRow['Trenutno_Stanje']);
                array_push($oTransakcije, $oTransakcija);
            }
            $squery="SELECT * FROM klijenti WHERE Sifra='".$oRow['Sifra_klijenta']."'"; 
            $ostatement = $oConnection->query($squery)->fetchObject();
            $klijent = new Klijent($ostatement->Sifra, $ostatement->OIB, $ostatement->Ime, $ostatement->Prezime, $ostatement->Adresa, $ostatement->Telefon);
            $oRacun = new Racun($oRow['idRacuni'], $oRow['Sifra_klijenta'], $oRow['Stanje'], $oRow['Datum_otvaranja'], $oRow['Vrsta_racuna'], $klijent, $oTransakcije);
            array_push($oRacuni, $oRacun);
        }
        echo json_encode($oRacuni, JSON_UNESCAPED_UNICODE);
        break;
    }case 'Ucitaj_racune_klijenta':{
        $sQuery="SELECT * FROM racuni WHERE Sifra_klijenta='".$_POST['Sifra']."'"; 
        $oStatement = $oConnection->query($sQuery);
        $oRacuni = array();
        while($oRow = $oStatement->fetch(PDO::FETCH_BOTH))
        {
            $sQuery="SELECT * FROM transakcije WHERE Sifra_racun='".$oRow['idRacuni']."'"; 
            $aStatement = $oConnection->query($sQuery);
            $oTransakcije= array();
            while($aRow = $aStatement->fetch(PDO::FETCH_BOTH))
            {
                $sQuery="SELECT * FROM zaposlenici WHERE Sifra='".$aRow['Sifra_bankar']."'"; 
                $ostatement = $oConnection->query($sQuery)->fetchObject();
                $bankar= new Zaposlenik("Online");
                if($ostatement!=""){
                    $bankar = new Zaposlenik($ostatement->Sifra, $ostatement->OIB, $ostatement->Ime, $ostatement->Prezime, $ostatement->Adresa, $ostatement->Telefon);
                }
                $oTransakcija = new Transakcija($aRow['Sifra'], $aRow['Sifra_racun'], $bankar, $aRow['Vrsta'], $aRow['Datum'], $aRow['Opis'], $aRow['Ime_platitelja'],$aRow['Iznos'],  $aRow['Trenutno_Stanje']);
                array_push($oTransakcije, $oTransakcija);
            }
            $squery="SELECT * FROM klijenti WHERE Sifra='".$_POST['Sifra']."'"; 
            $ostatement = $oConnection->query($squery)->fetchObject();
            $klijent = new Klijent($ostatement->Sifra, $ostatement->OIB, $ostatement->Ime, $ostatement->Prezime, $ostatement->Adresa, $ostatement->Telefon);
            $oRacun = new Racun($oRow['idRacuni'], $oRow['Sifra_klijenta'], $oRow['Stanje'], $oRow['Datum_otvaranja'], $oRow['Vrsta_racuna'], $klijent, $oTransakcije);
            array_push($oRacuni, $oRacun);
        }
        echo json_encode($oRacuni, JSON_UNESCAPED_UNICODE);
        break;
    }case 'Dodaj_racun':{
        $sQuery="SELECT idRacuni FROM racuni";
        $sValue = $oConnection->query($sQuery)->fetch(PDO::FETCH_ASSOC);
        $lIdRacuna= $sValue;
        do{
        $sNewSifra=rand(1000000000, 9999999999);
        }while(in_array($sNewSifra, $lIdRacuna));
        $sNewSifra="HR256872103".$sNewSifra;
        $sQuery="INSERT INTO racuni (idRacuni, Sifra_klijenta, Stanje, Datum_otvaranja, Vrsta_racuna) VALUES ('".$sNewSifra."', '".$_POST['Sifra']."', '".$_POST['Value']."', '".date("d/m/Y")."', '".$_POST['Vrsta']."');";
        echo $sQuery;
        $oStatement = $oConnection->query($sQuery);
        break;
    }case 'Obrisi_racun':{
        $sQuery="DELETE from racuni WHERE idRacuni='".$_POST['Sifra']."'"; 
        $oStatement = $oConnection->query($sQuery);
        echo $sQuery;
        break;
    }case 'Dodaj_Transakciju':{
        $sQuery="SELECT MAX(Sifra)as oldSifra FROM transakcije";
        $sValue = $oConnection->query($sQuery)->fetch(PDO::FETCH_ASSOC);
        $sNewSifra = $sValue['oldSifra'];
        if(!$sNewSifra)$sNewSifra='56261551469';
        $sNewSifra +=1;
        $sQuery="SELECT Stanje FROM racuni WHERE idRacuni='".$_POST['SifraRacuna']."'";
        $oStatement = $oConnection->query($sQuery)->fetch(PDO::FETCH_ASSOC);
        $oldStanje=$oStatement['Stanje'];
        $newStanje=(float)$oldStanje+(float)$_POST['Iznos'];

        $sQuery="INSERT INTO transakcije (Sifra, Sifra_racun, Sifra_bankar, Vrsta, Datum, Opis, Ime_platitelja , Iznos, Trenutno_Stanje) VALUES  ('".$sNewSifra."', '".$_POST['SifraRacuna']."', '".$_POST['SifraBankara']."', '".$_POST['Vrsta']."', '".date("d/m/Y")."', '".$_POST['Opis']."', '".$_POST['ImePlatitelja']."', '".$_POST['Iznos']."', '".$newStanje."' )";
        $oStatement = $oConnection->query($sQuery);
       
        
        $sQuery="UPDATE racuni SET Stanje='".$newStanje."' WHERE idRacuni='".$_POST['SifraRacuna']."'";
        $oStatement = $oConnection->query($sQuery);
        break;
    }case 'Provjera_racuna':{
        $RacunPostoji=0;
        $sQuery="SELECT * FROM racuni WHERE Sifra_klijenta!='' AND idRacuni!='".$_POST['Racun']."'";
        $oStatement = $oConnection->query($sQuery);
        while($oRow = $oStatement->fetch(PDO::FETCH_BOTH)){
            if($oRow['idRacuni']==$_POST['Sifra']){
                $RacunPostoji=1;
            }
        }
        echo $RacunPostoji;
        break;
    }case 'Azuriraj_klijenta':{
        $sQuery="UPDATE klijenti SET Ime='".$_POST['Ime']."',  Prezime='".$_POST['Prezime']."' , Adresa='".$_POST['Adresa']."' , Telefon='".$_POST['Telefon']."'  WHERE Sifra='".$_POST['KlijentID']."';";
        $oStatement = $oConnection->query($sQuery);
        break;
    }case 'Nova_lozinka_za_prijevu_klijent':{
        $sQuery="UPDATE podatci_za_prijavu_klijenti SET Lozinka='".$_POST['password']."' WHERE Sifra='".$_POST['sifra']."'";
        $oStatement = $oConnection->query($sQuery);
        break;
    }case 'Nova_lozinka_za_prijevu_bankara':{
        $sQuery="UPDATE podatci_za_prijavu_bankari SET Lozinka='".$_POST['password']."'WHERE Sifra='".$_POST['sifra']."'";
        $oStatement = $oConnection->query($sQuery);
        break;
    }case 'Provjeri_korisnicko_ime':{
        $sQuery="SELECT * FROM podatci_za_prijavu_klijenti WHERE Korisnicko_ime='".$_POST['username']."'";
        $oStatement = $oConnection->query($sQuery)->fetchObject();
        if($oStatement){
        echo json_encode($oStatement, JSON_UNESCAPED_UNICODE);
        }
        $sQuery="SELECT * FROM podatci_za_prijavu_bankari WHERE Korisnicko_ime='".$_POST['username']."'";
        $oStatement = $oConnection->query($sQuery)->fetchObject();
        
        if($oStatement){
        echo json_encode($oStatement, JSON_UNESCAPED_UNICODE);
        }
        break;
    }case 'Statistika':{
        $sQuery="SELECT COUNT(*)AS num, SUM(Stanje)as stanje FROM racuni";
        $sValue = $oConnection->query($sQuery)->fetch(PDO::FETCH_ASSOC);
        $snum= $sValue['num'];
        $uStanje= $sValue['stanje'];
        $sQuery="SELECT *, MAX((SELECT COUNT(*) FROM transakcije WHERE Sifra_racun=idRacuni)) as mag FROM racuni ";
        $sValue = $oConnection->query($sQuery)->fetchObject();
        $sQuery="SELECT *, MAX((SELECT MAX(Iznos) FROM transakcije WHERE Sifra_racun=idRacuni)) as iznos FROM racuni ";
        $oValue = $oConnection->query($sQuery)->fetchObject();
        $Iznos=$oValue->iznos;
        if(!$Iznos){
            $Iznos=0;
        }
        echo '{"count":'.$snum.', "ukupnoStanje":'.$uStanje.', "IdRacuna":"'.$sValue->idRacuni.'","Datum_Otvaranja":"'.$sValue->Datum_otvaranja.'","VrstaRacuna":"'.$sValue->Vrsta_racuna.'","IdKlijenta":'.$sValue->Sifra_klijenta.',"Stanje":'.$sValue->Stanje.',"Broj":'.$sValue->mag.',"mIdRacuna":"'.$oValue->idRacuni.'","mDatum_Otvaranja":"'.$oValue->Datum_otvaranja.'","mVrstaRacuna":"'.$oValue->Vrsta_racuna.'","mIdKlijenta":'.$oValue->Sifra_klijenta.',"mStanje":'.$oValue->Stanje.',"Iznos":'.$Iznos.'}';
    }default:
        break;
}


?>