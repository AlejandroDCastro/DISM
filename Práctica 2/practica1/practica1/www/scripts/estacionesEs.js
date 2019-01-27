/*Peticion dentro de otra peticion*/

// var datosEstaciones;
// var keyEstaciones = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhY2FzdHJvdmFsZXJvQGdtYWlsLmNvbSIsImp0aSI6IjJhYjIwYzY1LTg2ZmYtNDViNy1iODJjLWFkOWU1NzIyNzhkYyIsImlzcyI6IkFFTUVUIiwiaWF0IjoxNTM3ODYxNDg1LCJ1c2VySWQiOiIyYWIyMGM2NS04NmZmLTQ1YjctYjgyYy1hZDllNTcyMjc4ZGMiLCJyb2xlIjoiIn0.smtQwHpgC8F3oOgiRue2HGEuDZTA99SAZoBrF6j7FRI';
var key = "DISMPractica2";
var settingsEstaciones = {
    "async": true,
    "crossDomain": true,
    "url": "http://localhost:8080/estaciones",
    "method": "GET",
    "headers": {
        "cache-control": "no-cache",
        "token": key
    }
}
$(document).on("pagecreate", "#estacionesEs", function (event) {
    InicializarEstaciones();
});
function InicializarEstaciones() {

    var tabla;

    $.ajax(settingsEstaciones).done(function (response) {

        // Primera peticion -> Response Body

       // $.ajax(response.datos).done(function (response) {

            // segunda peticion -> https://opendata.aemet.es/opendata/sh/974715ba

            // datosEstaciones = JSON.parse(response);
            tabla = $('#dataGrid2').DataTable({

                "data": response,
                responsive: false,
                retrieve: true,
                deferRender: true,
                scrollY: 500,
                scrollX: true,
                scrollCollapse: true,
                scroller: true,
                "columns": [
                    {
                        "data": "nombre"
                    },
                    {
                        "data": "latitud"
                    },
                    {
                        "data": "longitud"
                    },
                    {
                        "data": "indicativo"
                    },
                    {
                        "defaultContent": `<button class="ui-btn ui-corner-all" name="info" onclick='clickInfo(this);'>View</button>`
                    }
                ]
            });
       // });
    });
}

// Funcion que se ejecuta al pinchar sobre View
function clickInfo(e) {
    document.getElementById('mapaOculto').style.display = 'block';
    var nombre = e.parentNode.parentNode.children[0].innerHTML;
    var latitud = e.parentNode.parentNode.children[1].innerHTML;
    var longitud = e.parentNode.parentNode.children[2].innerHTML;

    var map = new Microsoft.Maps.Map('#myMap', {
        credentials: 'At_HXwdSo7M1bT3KUDnr_9WDGmwmDmnbhBdsC_AsjPq1mOBn3t-poiLD7yz-ZejE'
    });

    var loc = new Microsoft.Maps.Location(sexaToDec(latitud), sexaToDec(longitud));
    var pushpin = new Microsoft.Maps.Pushpin(loc, {
        icon: 'https://bingmapsisdk.blob.core.windows.net/isdksamples/defaultPushpin.png',
        "title": `${nombre}`

    });
    map.entities.push(pushpin);
    map.setView({ center: loc, zoom: 6 });
}

//Función que pasa de hexadecimal a decimal
function sexaToDec(hex) {

    var segundos = ((hex.charAt(4) + hex.charAt(5)) / 60).toString().split(".")[1];
    var minutos = (((hex.charAt(2) + hex.charAt(3)) + "." + segundos) / 60).toString().split(".")[1];
    var decimal = hex.charAt(0) + hex.charAt(1) + "." + minutos;

    if (hex.charAt(6) == "S" || hex.charAt(6) == "W") {
        decimal *= -1;
    }

    return decimal;
}

//Funcion para cerrar el mapa
function escondeMapa() {
    document.getElementById('mapaOculto').style.display = 'none';
}
