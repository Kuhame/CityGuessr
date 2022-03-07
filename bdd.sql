DROP TABLE IF EXISTS utilisateur;
CREATE TABLE IF NOT EXISTS utilisateur(
    idUtilisateur INT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(30) NOT NULL,
    prenom VARCHAR(30) NOT NULL,
    motDePasse VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL,
    meilleurScore INT NOT NULL,
    UNIQUE(email)
);

INSERT INTO utilisateur(nom, prenom, motDePasse, email, meilleurScore) VALUES
('Antoine', 'Clermont', 'bfe54caa6d483cc3887dce9d1b8eb91408f1ea7a', 'antoine.clermont@gmail.com', 0);