<?php
function pdo(){
	$hostname = "localhost";	//ou localhost
	$base= "pwebc";
	$loginBD= "root";	//ou "root"
	$passBD="";

	try {
		$pdo = new PDO ("mysql:server=$hostname; dbname=$base", "$loginBD", "$passBD");
	}
	catch (PDOException $e) {
		die  ("Echec de connexion : " . utf8_encode($e->getMessage()) . "\n");
	}
	return $pdo;
}