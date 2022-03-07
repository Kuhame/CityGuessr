<?php

    function ident(){
        $email =  isset($_POST['email']) ? ($_POST['email']) : '';
        $mdp =  isset($_POST['mdp']) ? ($_POST['mdp']) : '';
        $msg = '';

        if (count($_POST) == 0) {
            require("./v/ident.tpl");
        }
        else {
            require_once("./m/utilisateurBD.php");
            if (!verif_ident_bd($email, $mdp, $resultat)) {
                $_SESSION['profil'] = array();
                $msg = "Erreur de saisie";
                require("./v/ident.tpl");
            } else {
                $_SESSION['profil'] = $resultat[0];
                $url = "index.php?controle=utilisateur&action=map";
                header("Location:" . $url);
            }
        }
    }

    function map(){
        $email = isset($_SESSION['profil']['email']) ? ($_SESSION['profil']['email']) : '';
        if($email==""){
            header("Location: index.php?controle=utilisateur&action=ident");
        }else{
            require_once("./v/map.tpl");
        }
    }

    function inscription(){
        $nom = isset($_POST['nom'])?($_POST['nom']):'';
        $prenom = isset($_POST['prenom'])?($_POST['prenom']):'';
        $mdp = isset($_POST['mdp'])?($_POST['mdp']):'';
        $mail = isset($_POST['mail'])?($_POST['mail']):'';
        $msg = "";

        if (count($_POST)==0)
                require("./v/inscription.tpl");
        else {
            require_once("./m/utilisateurBD.php");
            if  (!verif_inscrip_bd($nom,$prenom,$mdp,$mail,$msg)) {
                require("./v/inscription.tpl");
            }
            else {
                require_once("./m/utilisateurBD.php");
                creation_compte($nom,$prenom,$mdp,$mail);
                if (verif_ident_bd($mail,$mdp,$resultat)){
                    $_SESSION['profil'] = $resultat[0];
                }
                require_once ("./v/inscription_reussi.tpl");
                header("refresh:5; url=index.php?controle=utilisateur&action=map");
            }
        }
    }

    function deconnexion(){
        session_destroy();
        require_once ("./v/deconnexion.tpl");
        header("refresh:5; url=index.php?controle=utilisateur&action=ident");
    }

    function verif_inscrip_bd ($nom,$prenom,$mdp,$mail,&$msg) {
        return verif_nom($nom,$msg)&&verif_mdp($mdp,$msg)&&verif_mail($mail,$msg)&&verif_prenom($prenom,$msg);
    }

    function verif_nom($nom,&$msg){
        if(!preg_match("#^.{1,30}$#",$nom)){
            $msg ="Erreur de saisie";
            return false;
        }
        return preg_match("#^.{1,30}$#",$nom);
    }

    function verif_prenom($prenom,&$msg){
        if(!preg_match("#^.{1,30}$#",$prenom)){
            $msg ="Erreur de saisie";
            return false;
        }
        return preg_match("#^.{1,30}$#",$prenom);
    }

    function verif_mdp($mdp,&$msg){
        if(!preg_match("#^.{1,50}$#",$mdp)){
            $msg ="Erreur de saisie";
            return false;
        }
        return preg_match("#^.{1,50}$#",$mdp);
    }

    function verif_mail($mail,&$msg){
        require_once ("./m/utilisateurBD.php");
        $utilisateurs=get_utilisateur();
        foreach ($utilisateurs as $u){
            if($u['email']==$mail){
                $msg ="Email existe deja";
                return false;
            }
        }
        return filter_var($mail, FILTER_VALIDATE_EMAIL) && preg_match("#^.{1,50}$#",$mail);
    }

?>