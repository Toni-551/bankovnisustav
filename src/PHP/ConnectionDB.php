<?php
header('Access-Control-Allow-Origin: *');

$host="127.0.0.1";
$dbName="pinbanka";
$username="root";
$password="";


try
{
 $oConnection = new PDO("mysql:host=$host;dbname=$dbName", $username, $password, array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8") );
 //echo "Connected to $dbName at $host successfully.";
}
catch (PDOException $pe)
{
 die("Could not connect to the database $dbname :" . $pe->getMessage());
}


?>