var datosMunicipios;
var datosfiltradosMunicipios = [];
var keyMunicipios = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhY2FzdHJvdmFsZXJvQGdtYWlsLmNvbSIsImp0aSI6IjJhYjIwYzY1LTg2ZmYtNDViNy1iODJjLWFkOWU1NzIyNzhkYyIsImlzcyI6IkFFTUVUIiwiaWF0IjoxNTM3ODYxNDg1LCJ1c2VySWQiOiIyYWIyMGM2NS04NmZmLTQ1YjctYjgyYy1hZDllNTcyMjc4ZGMiLCJyb2xlIjoiIn0.smtQwHpgC8F3oOgiRue2HGEuDZTA99SAZoBrF6j7FRI';
var settingsMunicipios = {
    "async": true,
    "crossDomain": true,
    "url": "https://opendata.aemet.es/opendata/api/maestro/municipios?api_key=" + keyMunicipios,
    "method": "GET",
    "headers": {
        "cache-control": "no-cache"
    }
}
$(document).on("pagecreate", "#municipiosEs", function (event) {
    InicializarMunicipios();
});
function InicializarMunicipios() {
    $.ajax(settingsMunicipios).done(function (response) {
        var j = 0;
        datosMunicipios = JSON.parse(response);
        datosMunicipios.forEach(function (entry) {
            if (entry.num_hab > 50000) {    // Filtramos para que sean mas de 50000 habitantes
                datosfiltradosMunicipios[j] = entry;
                j = j + 1;
            }
        });
        tabla = $('#dataGrid1').DataTable({
            responsive: true,
            "data": datosfiltradosMunicipios,
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
                    "data": "num_hab" // Metemos tambien el numero de habitantes
                }
            ]
        });
    }); // Peticion ajax terminada
}