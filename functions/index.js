/*
La licencia MIT (MIT)

Copyright (c) 2019 Concomsis S.A. de C.V.

Por la presente se otorga el permiso, sin cargo, a cualquier persona que obtenga una copia de
este software y los archivos de documentación asociados (el "Software"), para tratar en
el Software sin restricciones, incluidos, entre otros, los derechos de
usar, copiar, modificar, fusionar, publicar, distribuir, sublicenciar y / o vender copias de
el Software, y para permitir que las personas a quienes se suministra el Software lo hagan,
sujeto a las siguientes condiciones:

El aviso de copyright anterior y este aviso de permiso se incluirán en todas las
Copias o partes sustanciales del Software.

EL SOFTWARE SE PROPORCIONA "TAL CUAL", SIN GARANTÍA DE NINGÚN TIPO, EXPRESA O
IMPLÍCITOS, INCLUIDOS, PERO NO LIMITADOS A LAS GARANTÍAS DE COMERCIABILIDAD, APTITUD
PARA UN PROPÓSITO PARTICULAR Y NO INCUMPLIMIENTO. EN NINGÚN CASO LOS AUTORES O
LOS TITULARES DEL DERECHO DE AUTOR SERÁN RESPONSABLES POR CUALQUIER RECLAMACIÓN, DAÑOS U OTRAS RESPONSABILIDADES, SI
EN UNA ACCIÓN DE CONTRATO, CORTE O DE OTRA MANERA, DERIVADO DE, FUERA O EN
CONEXIÓN CON EL SOFTWARE O EL USO U OTRAS REPARACIONES EN EL SOFTWARE.
*/
'use strict';
/////////////////////// CON FIREBASE

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const language = require('@google-cloud/language');
const client = new language.LanguageServiceClient();

/////////////////////////////
const express = require('express');
const app = express();
///////
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mercadopago = require('mercadopago');
///
const jmy_connect= require('./config/key.js');
const jmyServerLicencias ="https://us-central1-concomsis.cloudfunctions.net/app/";
///
// AXIOS

app.use(express.static(__dirname + '/public'));

///////// Configuraciones de MercadoPago /////////
mercadopago.configure({
  sandbox: true,
  access_token: 'TEST-5908568980084275-030619-a73d504c7eb53a8993f71fecdd6efad9-406264130'
});


app.set('json spaces',6);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/',async (req, res) => {

  const post = req.body;
  try {      
    console.log('post',post);
    res.render('index',data);    
  } catch(error) {
    console.log('Error detecting sentiment or saving message', error.message);
    res.sendStatus(500);
  }
});

/*
app.post.verEmpresa( axios((jmyServerLicencias)) )

app.post.verLicencias(axios((jmyServerLicencias)))

*/

////////////// Pruebas de mp ////////////////////

/*
  Tarjetas para pagos de prueba
  
  Visa Débito	            4189 1412 2126 7633
  Mastercard Débito	      5579 0785 2102 5680
  Tarjeta MercadoPago	    5399 7823 2218 1356

*/

// Ejemplo de productos para crear preferencias de pago
let productos = {
  "1":{
    "nombre":"lapiz",
    "precio":5
  },
  "2":{
    "nombre":"libreta",
    "precio":15
  },
  "3":{
    "nombre":"goma",
    "precio":3
  },
  "4":{
    "nombre":"colores",
    "precio":10
  },
  "5":{
    "nombre":"hojas",
    "precio":2
  }
};

// Prueba de vista en templet
app.get('/mp', async (req, res) => {
 
  res.json({});
});

// Crear una preferencia de pago
app.get('/pago/pagar/:id', async (req, res) => {
  let id = req.params.id;
  let op = productos[id];
  console.log('id: ' + id, 'Producto elegido: ' , op);

  var preference = {
    items: [
      {
        id: id,
        title: op.nombre,
        quantity: 1,
        currency_id: 'MXN',
        unit_price: op.precio
      }
    ],
    payer: {
      email: 'lillian.beer@hotmail.com'
    }
  };
  console.log('Preferencia de pago',preference);

  if(op){
    mercadopago.preferences.create(preference).then(function (preference) {
      const p = preference;
      console.log('Información de la preferencia',p.body);
      
      // console.log('Informacion pasada a la vista', p.body.sandbox_init_point);
      res.json( {prod:p.body.items[0].title,urlPago:p.body.sandbox_init_point});
    }).catch(function (error) {
      console.log(error);
      res.sendStatus(500);
    });
  }
});

// Obtener todos los pagos
app.get('/pago/obtener', async (req, res) => {
  mercadopago.payment.search({
    qs: {
      'collector.id': 'me'
    }
  }).then(function (mpResponse){
    console.log(mpResponse.body.results[0]);
    res.json(mpResponse.body.results);    
  }).catch(function (error){
    res.sendStatus(500);
  })
});

// Cancelar pago 
app.get('/pago/cancelar/:id', async (req, res) => {
  let id_pago = req.params.id;
  console.log('id de pago: ', id_pago);
  
  if(id_pago){
    mercadopago.payment.update({
      id: id_pago,
      status: "cancelled"
    }).then(function(ok){
      res.sendStatus(200);
      console.log('Pago('+id_pago+') cancelado con exito');
    }).catch(function(err){
      res.sendStatus(500);
      console.log(err);
    });
  }
});

// Notificaciones ---Pendiente---
app.get('/notificaciones', async (req, res) => {
  try{
    mercadopago.ipn.manage(req).then(function (data) {
      res.json({
        result: data
      });
      console.log(data);
    });
  }catch(error){
    console.log('Error detecting sentiment or saving message', error.message);
    res.sendStatus(500);
  }
  // res.sendStatus(200);
});

///////////////// Fin de mp ////////////////////

// Expose the API as a function
exports.api = functions.https.onRequest(app);

