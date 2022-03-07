let map;
let pays;
let villes;
let nbVille;
let currentVille;
let marqueurCurrentVille;
let monMarqueur;
let positionMarqueursChoisis;
let positionMarqueursVilles;
let nomMarqueursVilles;
let distanceVilles;
let pointsDistanceVilles;
let pointsTotal;
let nbClick;
let bool=true;
let score;
let Paris = [48.856614,2.3522219]; // Notre Dame par défaut

let greenIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

let goldIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Fonction pour récupérer données JSON en local
const fetchData = (data) => {
    return new Promise((resolve) => {
        fetch(`./assets/donneesGeo/${data}.json`).then((res) => resolve(res.json()))
    });
};

async function init() {
    //On vérouille la fonction pour ne pas qu'elle s'exécute plusieurs fois (asynchrone)
    if(bool){
        bool=false;
    }else{
        return;
    }

    //On nettoie la map
    map.eachLayer(function(layer) {
        if (layer instanceof L.Marker || L.Polyline) {
            map.removeLayer(layer);
        }
    });
    
    L.tileLayer(
        'https://api.mapbox.com/styles/v1/kumahe/cl0b7p36b002f14pcuojwzs5g/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1Ijoia3VtYWhlIiwiYSI6ImNsMGI3bXB1bDA3bWYzY3E5OW1iMzliNHMifQ.IkKNbMYaaF7iPLVSzNHycw', 
        {
            maxZoom: 6,
            minZoom: 3,
            noWrap: true,
            bounds: [
			    [-90, -180],
			    [90, 180],
		    ]
        }
    ).addTo(map);

    //Position des marqueurs posé par le joueur
    positionMarqueursChoisis = [];
    //Position des marqueurs que le joueur doit deviner
    positionMarqueursVilles = [];
    nomMarqueursVilles = [];
    distanceVilles= [];
    pointsDistanceVilles=[];
    pointsTotal=0;
    nbClick=0;

    map.doubleClickZoom.disable();
    
    //On créer des tableaux contenant tous les pays et villes du monde
    pays = await fetchData("pays");
    villes = await fetchData("villes");
    
    //On prend un ville aléatoire
    currentVille = villes[Math.floor(Math.random() * villes.length)];
    positionMarqueursVilles.push([currentVille.lat,currentVille.lng]);
    nomMarqueursVilles.push(currentVille);

    $("#aTrouver").html(`<h1>${currentVille.name}, ${pays[currentVille.country]}</h1>`);
    $("#aTrouver").show();
    $("#dialog").hide();
    

    nbVille = 6;

    map.on('dblclick', onMapDblClick);
}

function afficherMarqueurs(){
    map.removeLayer(monMarqueur);
    map.removeLayer(marqueurCurrentVille);
    for(let i=0; i<nbVille;i++){
        let marqueur1 = L.marker(positionMarqueursChoisis[i], {icon: goldIcon}).addTo(map);
        let marqueur2 = L.marker(positionMarqueursVilles[i], {icon: greenIcon})
        .bindPopup(L.popup({maxWidth:500, closeButton : false})
        .setContent(`${nomMarqueursVilles[i].name}, ${pays[nomMarqueursVilles[i].country]}<br />
        Distance : ${distanceVilles[i]} KM <br />
        Points : ${pointsDistanceVilles[i]}<br />
        <a href="https://fr.wikipedia.org/wiki/${nomMarqueursVilles[i].name}"><i class="bi bi-box-arrow-up-right"></i> Information sur la ville</a>`))
        .addTo(map);

        //Trace un trait entre la position choisis par le joueur et celle qu'il devait trouver
        var polyline = L.polyline([positionMarqueursChoisis[i],positionMarqueursVilles[i]], {color: 'red'}).addTo(map);
    }
}

function onMapDblClick(e) {
    if(nbClick<nbVille){
        if (map.hasLayer(monMarqueur) || map.hasLayer(marqueurCurrentVille)) {
            map.removeLayer(monMarqueur);
            map.removeLayer(marqueurCurrentVille);
        }
        monMarqueur = L.marker(e.latlng, {icon: goldIcon}).addTo(map);
        distanceVilles.push(Math.round(map.distance(e.latlng,[currentVille.lat, currentVille.lng])/1000));
        calculePoints(nbClick);
        positionMarqueursChoisis.push(e.latlng);
        //On affiche l'endroit correspondant à la ville du texte
        marqueurCurrentVille = L.marker([currentVille.lat, currentVille.lng], {icon: greenIcon}).addTo(map);

        //On change de ville
        currentVille = villes[Math.floor(Math.random() * villes.length)];
        positionMarqueursVilles.push([currentVille.lat,currentVille.lng]);
        nomMarqueursVilles.push(currentVille);
        
        $("#aTrouver").html(`<h1>${currentVille.name}, ${pays[currentVille.country]}</h1>`);
        nbClick++;
    }
    if(nbClick==nbVille){
        map.off("dblclick", onMapDblClick);
        let meilleurScoreDistance = Math.min(...distanceVilles);
        let meilleurScorePoints = Math.max(...pointsDistanceVilles);
        let distanceMoyenne = Math.round(calculeMoyenne(distanceVilles));
        let indexMeilleurScore = distanceVilles.indexOf(meilleurScoreDistance);

        //On récupère le meilleurs score enregistré du joueur
        score=getMeilleurScore();
        for(let i=0; i<nbVille;i++){
            pointsTotal+=pointsDistanceVilles[i];
        }
        console.log(pointsTotal);
        if(score < pointsTotal){
            setMeilleurScore(pointsTotal);
            score=getMeilleurScore();
        }
        afficherMarqueurs();

        $("#aTrouver").hide();
        $("#dialogTitle").html(`<h1>${pointsTotal} points</h1>`);
        $("#dialogList").html(`
        <li><i class="bi bi-trophy-fill"></i> Record global : ${score} points</li>
        <li><i class="bi bi-graph-up"></i> Distance moyenne: ${distanceMoyenne} km</li>
        <li><i class="bi bi-hand-thumbs-up-fill"></i> Meilleur score : ${meilleurScoreDistance} km (${meilleurScorePoints} pts)<br />(${nomMarqueursVilles[indexMeilleurScore].name}, ${pays[nomMarqueursVilles[indexMeilleurScore].country]})</li>
        `);
        bool=true;
        $("#dialogButton").html("<button type=\"button\"><i class=\"bi bi-arrow-clockwise\"></i> <span>Rejouer ?</span></button>")
        $("#dialogButton").click(()=>{init()});
        $("#dialog").show();
    }
    
}

function calculePoints(index){
    if(distanceVilles[index]<=100){
        pointsDistanceVilles.push(15000);
    }
    else if(distanceVilles[index]>5000){
        pointsDistanceVilles.push(0);
    }else{
        pointsDistanceVilles.push((15000-(distanceVilles[index]*3)));
    }
}

function calculeMoyenne(tab){
    let tmp=0;
    for(let i=0; i<tab.length;i++){
        tmp+=tab[i];
    }
    return tmp/tab.length;
}

function nettoyerMap(){
    for(let i=0; i<nbVille;i++){
        tmp+=tab[i];
    }
}

function getMeilleurScore(){
    let idUtilisateur= $("#idUtilisateur").text();
    let scoreReq;
    $.ajax({
        type: "post",
        url: "./m/getMeilleurScore.php",
        datatype: "json",
        async: false,
        data: { id: idUtilisateur }, // données passées en POST au fichier mapDB.php
        success: (response) => {
            let resp = JSON.parse(response);
            scoreReq = parseInt(resp.meilleurScore);
        }
    });
    return scoreReq;
}

function setMeilleurScore(newScore){
    let idUtilisateur= $("#idUtilisateur").text();
    $.ajax({
        type: "post",
        url: "./m/setMeilleurScore.php",
        datatype: "json",
        async: false,
        data: { id: idUtilisateur, newScore: newScore }, // données passées en POST au fichier mapDB.php
    });
}


window.onload=function jouer(){
    map = L.map('map', {
        doubleClickZoom: false,
        zoomControl: false
    }).setView(Paris, 8); // Paris centre du monde

    L.tileLayer(
        'https://api.mapbox.com/styles/v1/kumahe/cl0b7p36b002f14pcuojwzs5g/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1Ijoia3VtYWhlIiwiYSI6ImNsMGI3bXB1bDA3bWYzY3E5OW1iMzliNHMifQ.IkKNbMYaaF7iPLVSzNHycw', 
        {
            maxZoom: 6,
            minZoom: 3,
            noWrap: true,
            bounds: [
			    [-90, -180],
			    [90, 180],
		    ]
        }
    ).addTo(map);
    $("#aTrouver").hide();
    $("#dialogTitle").html(`<h1>CityGuessr</h1>`);
    $("#dialogList").html(`
    <li><i class="bi bi-cursor-fill"></i> Double clique pour deviner la position de 6 villes</li>
    <li><i class="bi bi-zoom-in"></i> Tu peux zoomer pour être plus précis</li>
    <li><i class="bi bi-trophy-fill"></i> Obtiens des points en fonction de la distance entre ton choix et l'emplacement réel</li>
    `);
    $("#dialogButton").html("<button type=\"button\"><i class=\"bi bi-geo-alt-fill\"></i></i> <span>Jouer !</span></button>");
    $("#dialogButton").click(()=>{init()});
};
