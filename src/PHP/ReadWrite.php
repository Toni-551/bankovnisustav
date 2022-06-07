<?php

include "ConnectionDB.php";
include "Classes.php";


switch($_POST['RequestId']){
    case 'Ucitaj_podatke':{
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
    default:
        break;
}
?>