<?php

class Racun{

}

class Transakcije{

}
class PodatciZaPrijavu{
}
class Osoba{
    public $OIB="";
    public $Ime="";
    public $Prezime="";
    public $Adresa="";
    public $Telefon="";
    public $Spol="";
    public function __construct($oib, $ime, $prezime, $adresa, $telefon, $spol)
    {
        $this->OIB=$oib;
        $this->Ime=$ime;
        $this->Prezime=$prezime;
        $this->Adresa=$adresa;
        $this->Telefon=$telefon;
        $this->Spol=$spol;
    }
}
class Klijent extends Osoba{
    function __construct($oib, $ime, $prezime, $adresa, $telefon, $spol) {
    parent::__construct($oib, $ime, $prezime, $adresa, $telefon, $spol);
    }
}
class Zaposlenik extends Osoba{

}


?>