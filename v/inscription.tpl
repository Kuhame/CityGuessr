<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- Bootstrap -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.1/dist/css/bootstrap.min.css">

    <!--Font -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">

    <!-- CSS -->
    <link rel="stylesheet" href="css/styles.css">

    <title>Inscription</title>
</head>

<body>
<div class="d-flex align-items-center justify-content-center vw-100 vh-100">
    <div class="container">
        <h1 class="text-center"><img src="./assets/images/CityGuessr80x80.png" alt=""> CityGuessr</h1>
        <section class="formulaire">
            <div class="form-container">
                <form method="post" action="index.php?controle=utilisateur&action=inscription">
                    <h2 class="text-center"><strong>Créer un compte</strong></h2>
                    <?php if($msg=="Erreur de saisie"||$msg=="Email existe deja"){
                        printf("<div class=\"alert alert-danger\" role=\"alert\">%s</div>",$msg);
            }
            ?>
                    <div class="form-group mb-3"><input class="form-control" type="text" name="nom" placeholder="Nom"></div>
                    <div class="form-group mb-3"><input class="form-control" type="text" name="prenom" placeholder="Prenom"></div>
                    <div class="form-group mb-3"><input class="form-control" type="email" name="mail" placeholder="Email"></div>
                    <div class="form-group mb-3"><input class="form-control" type="password" name="mdp" placeholder="Mot de passe"></div>
                    <div class="form-group mb-3"><button class="btn btn-primary d-block w-100" id="submitButton" type="submit">Créer un compte</button></div><a class="already" href="index.php?controle=utilisateur&action=ident">Déjà un compte ? Se connecter</a>
                </form>
            </div>
        </section>
    </div>
</div>
</body>

</html>