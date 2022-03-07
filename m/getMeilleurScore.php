<?php

    require_once("connect.php");
	$sql="SELECT meilleurScore FROM utilisateur WHERE idUtilisateur=:id";
    $pdo=pdo();
	try {
		$commande = $pdo->prepare($sql);
		$commande->bindParam(':id', $_POST['id'], PDO::PARAM_INT);
		$commande->execute();
		echo json_encode($commande->fetchAll(PDO::FETCH_ASSOC)[0]);

	} catch (PDOException $e) {
		echo utf8_encode("Echec de select : " . $e->getMessage() . "\n");
		die(); // On arrête tout.
	}
