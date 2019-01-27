
function InicializarDatos() {

    // obtenemos el idema
    var idema = document.getElementById('idem').value;

    var tabla;
    var datos;
    var key = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhY2FzdHJvdmFsZXJvQGdtYWlsLmNvbSIsImp0aSI6IjJhYjIwYzY1LTg2ZmYtNDViNy1iODJjLWFkOWU1NzIyNzhkYyIsImlzcyI6IkFFTUVUIiwiaWF0IjoxNTM3ODYxNDg1LCJ1c2VySWQiOiIyYWIyMGM2NS04NmZmLTQ1YjctYjgyYy1hZDllNTcyMjc4ZGMiLCJyb2xlIjoiIn0.smtQwHpgC8F3oOgiRue2HGEuDZTA99SAZoBrF6j7FRI';
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://opendata.aemet.es/opendata/api/observacion/convencional/datos/estacion/" +idema+ "?api_key=" + key,
        "method": "GET",
        "headers": {
            "cache-control": "no-cache"
        }
    }

    $.ajax(settings).fail(function (response) {

        // Primera peticion -> Response Body

        $.ajax(JSON.parse(response.responseText).datos).done(function (response) {

            // segunda peticion -> https://opendata.aemet.es/opendata/sh/4e07a247

            datos = JSON.parse(response);
            
            tabla = $('#dataGrid3').DataTable({
                "data": datos,
                responsive: false,
                retrieve: true,
                deferRender: true,
                scrollY: 500,
                scrollX: true,
                scrollCollapse: true,
                scroller: true,
                "columns": [
                    {
                        "data": "idema"
                    },
                    {
                        "data": "ubi"
                    },
                    {
                        "data": "fint"
                    },
                    {
                        "data": "ta"
                    }
                ]
            });
        });
    });
}
