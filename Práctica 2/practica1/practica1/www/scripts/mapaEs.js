var infobox;
var datosMapa;
// var keyMapa = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhY2FzdHJvdmFsZXJvQGdtYWlsLmNvbSIsImp0aSI6IjJhYjIwYzY1LTg2ZmYtNDViNy1iODJjLWFkOWU1NzIyNzhkYyIsImlzcyI6IkFFTUVUIiwiaWF0IjoxNTM3ODYxNDg1LCJ1c2VySWQiOiIyYWIyMGM2NS04NmZmLTQ1YjctYjgyYy1hZDllNTcyMjc4ZGMiLCJyb2xlIjoiIn0.smtQwHpgC8F3oOgiRue2HGEuDZTA99SAZoBrF6j7FRI';
var key = "DISMPractica2";
var settingsMapa = {
    "async": true,
    "crossDomain": true,
    "url": "http://localhost:8080/estaciones",
    "method": "GET",
    "headers": {
        "cache-control": "no-cache",
        "token": key
    }
}
$(document).on("pagecreate", "#mapaEs", function (event) {
    InicializarMapa();
});
function InicializarMapa() {

    var map = new Microsoft.Maps.Map('#myMap', {
        credentials: 'At_HXwdSo7M1bT3KUDnr_9WDGmwmDmnbhBdsC_AsjPq1mOBn3t-poiLD7yz-ZejE'
    });

    $.ajax(settingsMapa).done(function (response) {

        var i = 1;
        datosMapa = response;
       var centro = map.getCenter();
      
       infobox = new Microsoft.Maps.Infobox(centro, {
           visible: false
       });
       infobox.setMap(map);

           // para cada ubicacion
       datosMapa.forEach(function (entry) {
           var ubi = new Microsoft.Maps.Location(hexadecimalAdecimal(entry.latitud), hexadecimalAdecimal(entry.longitud)); // tenemos la localizacion
           var pushpin = new Microsoft.Maps.Pushpin(ubi, { // creamos el pushpin
               icon: 'https://bingmapsisdk.blob.core.windows.net/isdksamples/defaultPushpin.png',
               text: `${i}`
           });
           pushpin.metadata = { // especificamos los datos que queremos mostrar al pinchar
               title: `${entry.nombre}`,
               description: `${entry.altitud}`
           }
           Microsoft.Maps.Events.addHandler(pushpin, 'click', pushpinClicked);
           map.entities.push(pushpin);
           i++; // pasamos a la siguiento localizacion
           map.setView({ center: ubi, zoom: 5 });
       });
    });
}

function pushpinClicked(e) {
    console.log(e.target.getLocation());
    
    if (e.target.metadata) {
        infobox.setOptions({
            location: e.target.getLocation(),
            title: e.target.metadata.title,
            description: `Altitud: ${e.target.metadata.description}`,
            visible: true
        });
    }
}

// Funcion para pasar de hexadecimal a decimal
function hexadecimalAdecimal(hex) {
    
    var segundos = ((hex.charAt(4) + hex.charAt(5)) / 60).toString().split(".")[1];
    var minutos = (((hex.charAt(2) + hex.charAt(3)) + "." + segundos) / 60).toString().split(".")[1];
    var decimal = hex.charAt(0) + hex.charAt(1) + "." + minutos;

    if (hex.charAt(6) == "S" || hex.charAt(6) == "W") {
        decimal *= -1;
    }
    return decimal;
    
}