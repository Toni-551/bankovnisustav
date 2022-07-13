<?php

class Racun{
    public $IdRacuna="";
    public $SifraKlijenta="";
    public $Stanje="";
    public $DatumOtvaranja="";
    public $VrstaRacuna="";
    public $oKlijent=null;
    public $loTransakcije=[];
    public function __construct($idracuna, $sifraklijenta, $stanje, $datum, $vrsta, $klijent, $transakcije){
        $this->IdRacuna=$idracuna;
        $this->SifraKlijenta=$sifraklijenta;
        $this->Stanje=$stanje;
        $this->DatumOtvaranja=$datum;
        $this->VrstaRacuna=$vrsta;
        $this->oKlijent=$klijent;
        $this->loTransakcije=$transakcije;
    }
}

class Transakcija{
    public $Sifra = "";
    public $SifraRacuna = "";
    public $Bankar = "";
    public $Vrsta = "";
    public $Datum = "";
    public $Opis = "";
    public $Platitelj = "";
    public $Iznos = "";
    public $TrenutnoStanje = "";
    public function __construct($sifra="", $sifra_racun="", $bankar="", $vrsta="", $datum="", $opis="",$platitelja="" , $iznos="", $trenutno_stanje="")
    {
        $this->Sifra = $sifra;
        $this->SifraRacuna = $sifra_racun;
        $this->Bankar = $bankar;
        $this->Vrsta = $vrsta;
        $this->Datum = $datum;
        $this->Opis = $opis;
        $this->Platitelj = $platitelja;
        $this->Iznos = $iznos;
        $this->TrenutnoStanje=$trenutno_stanje;
    }
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