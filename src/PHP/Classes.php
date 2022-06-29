<?php

class Racun{
    public $IdRacuna="";
    public $SifraKlijenta="";
    public $Stanje="";
    public $DatumOtvaranja="";
    public $oKlijent=null;
    public function __construct($idracuna, $sifraklijenta, $stanje, $datum, $klijent){
        $this->IdRacuna=$idracuna;
        $this->SifraKlijenta=$sifraklijenta;
        $this->Stanje=$stanje;
        $this->DatumOtvaranja=$datum;
        $this->oKlijent=$klijent;
    }
}

class Transakcije{

}

class Osoba{
    public $Sifra="";
    public $OIB="";
    public $Ime="";
    public $Prezime="";
    public $Adresa="";
    public $Telefon="";
    public $Spol="";
    public function __construct($sifra, $oib, $ime, $prezime, $adresa, $telefon, $spol)
    {
        $this->OIB=$oib;
        $this->Ime=$ime;
        $this->Prezime=$prezime;
        $this->Adresa=$adresa;
        $this->Telefon=$telefon;
        $this->Spol=$spol;
        $this->Sifra=$sifra;
    }
}
class Klijent extends Osoba{
    function __construct($sifra, $oib, $ime, $prezime, $adresa, $telefon, $spol) {
    parent::__construct($sifra, $oib, $ime, $prezime, $adresa, $telefon, $spol);
    }
}
class Zaposlenik extends Osoba{
    function __construct($sifra, $oib, $ime, $prezime, $adresa, $telefon, $spol) {
        parent::__construct($sifra, $oib, $ime, $prezime, $adresa, $telefon, $spol);
    }
}


?>