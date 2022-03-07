<?php

    require_once("connect.php");
	$sql="UPDATE utilisateur SET meilleurScore = :newScore WHERE idUtilisateur=:id";
    $pdo=pdo();
	try {
		$commande = $pdo->prepare($sql);
		$commande->bindParam(':id', $_POST['id'], PDO::PARAM_INT);
        $commande->bindParam(':newScore', $_POST['newScore'], PDO::PARAM_INT);
		$commande->execute();

	} catch (PDOException $e) {
		echo utf8_encode("Echec de select : " . $e->getMessage() . "\n");
		die(); // On arrête tout.
	}
