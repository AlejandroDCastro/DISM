var key = "DISMPractica2";

function introducirDatos() {
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "http://localhost:8080/introducirDatos",
        "method": "GET",
        "headers": {
            "cache-control": "no-cache",
            "token": key
        }
    }

    $.ajax(settings).done(function (response) {

    });
}

function borrarDatos() {

    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "http://localhost:8080/borrarDatos",
        "method": "GET",
        "headers": {
            "cache-control": "no-cache",
            "token": key
        }
    }

    $.ajax(settings).done(function (response) {

    });
}


function generarApiKey() {
 //   key = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "http://localhost:8080/generarApiKey",
        "method": "GET",
        "headers": {
            "cache-control": "no-cache",
            "token": key
        }
    }

    $.ajax(settings).done(function (response) {

    });
}