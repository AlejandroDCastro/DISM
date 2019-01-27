'use strict'
var express = require("express");
var mysql = require('mysql');
var app = express();
var bp = require('body-parser');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const cors = require('cors');
// var math = require('mathjs');
var clave;
app.use(cors());
app.options('*', cors());
app.use(bp.json());
var connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : 'root',
    database : 'dism',
    port: '3311'
});


var allowCrossTokenHeader = (req,res,next)=>{
	res.header("Acces-Control-Allow-Headers","token");
	return next();
};

var key = (req,res,next)=>{
	if(req.headers.token == "DISMPractica2"){
		return next();
	}else{
        res.send("Introduce la APIkey");
		return next(new Error("Introduce la APIkey"));
	}
};



//Ejemplo: GET http://localhost:8080/municipios
app.get('/municipios', key, function(req, resp) {
    connection.query('select * from municipios', function(err, rows) {
        if (err) {
            console.log('Error en /municipios '+err);
            resp.status(500);
            resp.send({message: "Error al obtener municipios"});
        }
        else {
            console.log('/municipios');
            resp.status(200);
            resp.send(rows);
        }
    })
});
//Ejemplo: GET http://localhost:8080/municipios/:nombre
app.get('/municipios/:nombre', key, function(req, resp) {
    var filtro = req.params.nombre;
    connection.query(`select * from municipios where nombre="${filtro}"`, function(err, rows) {
        if (err) {
            console.log('Error en /municipios '+err);
            resp.status(500);
            resp.send({message: "Error al obtener municipios"});
        }
        else {
            console.log('/municipios');
            resp.status(200);
            resp.send(rows);
        }
    })
});



//Ejemplo: GET http://localhost:8080/estaciones
app.get('/estaciones', key, function(req, resp) {
    connection.query('select * from estaciones', function(err, rows) {
        if (err) {
            console.log('Error en /estaciones '+err);
            resp.status(500);
            resp.send({message: "Error al obtener estaciones"});
        }
        else {
            console.log('/estaciones');
            resp.status(200);
            resp.send(rows);
        }
    })
});
//Ejemplo: GET http://localhost:8080/estaciones/:indicativo
app.get('/estaciones/:indicativo', key, function(req, resp) {
    var filtro = req.params.indicativo;
    connection.query(`select * from estaciones where indicativo="${filtro}"`, function(err, rows) {
        if (err) {
            console.log('Error en /estaciones '+err);
            resp.status(500);
            resp.send({message: "Error al obtener estaciones"});
        }
        else {
            console.log('/estaciones');
            resp.status(200);
            resp.send(rows);
        }
    })
});



//Ejemplo: GET http://localhost:8080/observacion
app.get('/observacion', key, function(req, resp) {
    connection.query('select * from observacion', function(err, rows) {
        if (err) {
            console.log('Error en /observacion '+err);
            resp.status(500);
            resp.send({message: "Error al obtener observacion"});
        }
        else {
            console.log('/observacion');
            resp.status(200);
            resp.send(rows);
        }
    })
});
//Ejemplo: GET http://localhost:8080/observacion/:idema
app.get('/observacion/:idema', key, function(req, resp) {
    var filtro = req.params.idema;
    connection.query(`select * from observacion where idema="${filtro}"`, function(err, rows) {
        if (err) {
            console.log('Error en /observacion '+err);
            resp.status(500);
            resp.send({message: "Error al obtener observacion"});
        }
        else {
            console.log('/observacion');
            resp.status(200);
            resp.send(rows);
        }
    })
});



// PROCEDEMOS A IMPLEMENTAR LA PARTE ADICIONAL



//Ejemplo: GET http://localhost:8080/introducirDatos
app.get('/introducirDatos', key, (req, resp) => {
    var tabla = "todas";

    solucionarPeticion(resp, tabla);
});


//Ejemplo: GET http://localhost:8080/introducirDatos/:api
app.get('/introducirDatos/:api', key, (req, resp) => {
    var tabla = req.params.api;

    if(tabla=="municipios"  ||  tabla=="estaciones"  ||  tabla=="observacion") {
        solucionarPeticion(resp, tabla);
    } else {
        console.log('Error en /introducirDatos');
        resp.status(500);
        resp.send({message: "Error al introducir datos en esta api"});
    }
    
});



// funcion para insertar valores de la API de AEMET en nuestra API
function solucionarPeticion(resp, tabla) {

    // cramos la peticion
    var request = new XMLHttpRequest();
    var request1 = new XMLHttpRequest();
    var request2 = new XMLHttpRequest();
    var apikey = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhY2FzdHJvdmFsZXJvQGdtYWlsLmNvbSIsImp0aSI6IjJhYjIwYzY1LTg2ZmYtNDViNy1iODJjLWFkOWU1NzIyNzhkYyIsImlzcyI6IkFFTUVUIiwiaWF0IjoxNTM3ODYxNDg1LCJ1c2VySWQiOiIyYWIyMGM2NS04NmZmLTQ1YjctYjgyYy1hZDllNTcyMjc4ZGMiLCJyb2xlIjoiIn0.smtQwHpgC8F3oOgiRue2HGEuDZTA99SAZoBrF6j7FRI'; 

    if(tabla == "municipios") {
        request.open("GET","https://opendata.aemet.es/opendata/api/maestro/municipios?api_key=" + apikey, true);
        request.setRequestHeader("cache-control","no-cache");
        insertarMunicipios(resp,request);
    } else if(tabla == "estaciones") {
        request.open("GET","https://opendata.aemet.es/opendata/api/valores/climatologicos/inventarioestaciones/todasestaciones?api_key=" + apikey, true);
        insertarEstaciones(resp,request);
    } else if(tabla == "observacion") {
        request.open("GET","https://opendata.aemet.es/opendata/api/observacion/convencional/todas?api_key="+ apikey, true);
        insertarObservacion(resp,request);
    } else {
        request.open("GET","https://opendata.aemet.es/opendata/api/maestro/municipios?api_key=" + apikey, true);
        request.setRequestHeader("cache-control","no-cache");
        insertarMunicipios(resp,request);
        request1.open("GET","https://opendata.aemet.es/opendata/api/valores/climatologicos/inventarioestaciones/todasestaciones?api_key=" + apikey, true);
        insertarEstaciones(resp,request1);
        request2.open("GET","https://opendata.aemet.es/opendata/api/observacion/convencional/todas?api_key="+ apikey, true);
        insertarObservacion(resp,request2);
    }
}


// funcion para insertar municipios en nuestra API
function insertarMunicipios(resp, request) {
    var datos;

    request.onload = function(){
        // borramos los datos existentes
        connection.query("DELETE FROM municipios");
        datos = JSON.parse(request.responseText);
        var i = 0;
        
        datos.forEach(element => {
            if(i<10000){

                // escapamos las comillas dobles
                let lat = element.latitud.split('"');
                let latitud = lat[0].concat('\\"');
                let lon = element.longitud.split('"');
                let longitud = lon[0].concat('\\"');
                 
                var querysql = `INSERT INTO municipios(latitud,id_old, url, latitud_dec, altitud, capital, num_hab, zona_comarcal, destacada, nombre, longitud_dec, id,longitud) VALUES ("${latitud}", "${element.id_old}","${element.url}","${element.latitud_dec}","${element.altitud}","${element.capital}","${element.num_hab}","${element.zona_comarcal}","${element.destacada}","${element.nombre}","${element.longitud_dec}","${element.id}","${longitud}")`;
                console.log('Municipio introducido ' + i);

                connection.query(querysql, function(err, rows) {
                    if (err) {
                        console.log('Error en /introducirDatos/municipios '+err);
                        resp.status(500);
                        resp.send({message: "Error al insertar municipios..."});
                    }
                    else {
                        resp.status(200);
                    }
                })
                i++;
            }
        });
        console.log('Todos los municipios introducidos...');        
    }
    request.onerror = function(){
        console.log("Error...");
    }
    request.send();
}



// funcion para insertar estaciones en nuestra API
function insertarEstaciones(resp, request){
    var info;

    // recordemos que hay que hacer una peticion dentro de otra peticion
    request.onload = function(){
        var request2 = new XMLHttpRequest();
        var url = JSON.parse(request.responseText).datos
        request2.open("GET",url,true);

        request2.onload = function(){
            info = JSON.parse(request2.responseText)

            // borramos lo que habia para actualizar con lo nuevo
            connection.query("DELETE FROM estaciones");
            var i = 0;
            
            info.forEach(element => {
                if(i<300){
                    var querysql = `INSERT INTO estaciones(latitud, provincia, altitud, indicativo, nombre, indsinop, longitud) VALUES ("${element.latitud}","${element.provincia}","${element.altitud}","${element.indicativo}","${element.nombre}","${element.indsinop}","${element.longitud}")`;
                    console.log('Estacion introducida ' + i);

                    connection.query(querysql, function(err, rows) {
                        if (err) {
                            console.log('Error en /introducirDatos/estaciones '+err);
                            resp.status(500);
                            resp.send({message: "Error al insertar estaciones..."});
                        }
                        else {
                            resp.status(200);
                        }
                    })
                    i++;
                }
            });
            console.log('Todas las estaciones introducidas...');            
        }
        request2.onerror = function(){
            console.log("Error...");
        }    
        request2.send();
    }
    request.onerror = function(){
        console.log("Error...");
    }    
    request.send();
}



// funcion para insertar las observaciones en nuestra API
function insertarObservacion(resp, request){
    var info;

    request.onload = function(){
        var request2 = new XMLHttpRequest();
        var url = JSON.parse(request.responseText).datos
        request2.open("GET",url,true);

        request2.onload = function(){
            info = JSON.parse(request2.responseText);
            connection.query("DELETE FROM observacion");
            var i = 0;
            info.forEach(element => {
                if(i<10000){

                    // recordemos que algunas observaciones no tienen los mismos campos
                    if(element.idema!=undefined || element.lon!=undefined || element.fint!=undefined || element.prec!=undefined || element.alt!=undefined || element.vmax!=undefined || element.vv!=undefined || element.dv!=undefined || element.lat!=undefined || element.dmax!=undefined || element.ubi!=undefined || element.hr!=undefined || element.tamin!=undefined || element.ta!=undefined || element.tamax!=undefined || element.tpr!=undefined || element.rviento!=undefined){
                        
                        
                        var querysql = `INSERT INTO observacion(idema, lon, fint, prec, alt, vmax, vv,dv,lat,dmax,ubi,hr,tamin,ta,tamax,tpr,rviento) VALUES ("${element.idema}","${element.lon}","${element.fint}","${element.prec}","${element.alt}","${element.vmax}","${element.vv}","${element.dv}","${element.lat}","${element.dmax}","${element.ubi}","${element.hr}","${element.tamin}","${element.ta}","${element.tamax}","${element.tpr}","${element.rviento}")`;
                        console.log('Observacion introducida ' + i);

                        connection.query(querysql, function(err, rows) {
                            if (err) {
                                console.log('Error en /introducirDatos/observacion '+err);
                                resp.status(500);
                                resp.send({message: "Error al insertar observaciones..."});
                            }
                            else {
                                resp.status(200);
                            }
                        })
                        i++;
                    }
                }
            });
            console.log('Todas las observaciones introducidas...');
        }
        request2.onerror = function(){
            console.log("Error...");
        }
        request2.send();
    }
    request.onerror = function(){
        console.log("Error...");
    }
    request.setRequestHeader("cache-control", "no-cache");
    request.send();
}


//Ejemplo: GET http://localhost:8080/generarApiKey
app.get('/generarApiKey', function(req, resp) {
    clave = req.params.token;
    var querykey = `INSERT INTO apikeys (llave) VALUES ("${clave}")`;
    console.log("ApiKey creada correctamente...");
    connection.query(querykey, function(err, rows) {
        if (err) {
            console.log('Error en /generarApiKey '+err);
            resp.status(500);
            resp.send({message: "Error al generar ApiKey..."});
        }
        else {
            resp.status(200);
        }
    })
});


//Ejemplo: GET hhtp://localhost:8080/borrarDatos
app.get('/borrarDatos', (req,resp)=>{
    connection.query("DELETE FROM municipios");
    connection.query("DELETE FROM estaciones");
    connection.query("DELETE FROM observacion");

    resp.status(200);
    resp.send({message: "Todos las filas han sido eliminadas..."});
    console.log('Todos las filas han sido eliminadas...');
})


// escuchamos en el puerto 8080
var server = app.listen(8080, function () {
console.log('Servidor iniciado en puerto 8080…');
});