var express = require('express');
var app = express();
var util = require('util');
var db = require('./model/db');
var entity_manager= require('./model/entity');
var meseros = entity_manager(db,'meseros');
var encuestas = entity_manager(db, 'encuestas');
console.log(util.inspect(meseros));
var bodyParser = require('body-parser');
app.use(bodyParser.json());

/* Resolve the methods for REST */
var entities = [meseros, encuestas];
for(var a =0;a<entities.length;a++) {
	app.get('/api/'+entities[a].name, entities[a].findAll );
	app.get('/api/'+ entities[a].name + '/:id', entities[a].findById );
	app.post('/api/'+ entities[a].name, entities[a].addEntity);
	app.put('/api/'+ entities[a].name+ '/:id', entities[a].updateEntity);
	app.delete('/api/'+ entities[a].name + '/:id', entities[a].deleteEntity);
}

/* Frontend */
// frontend routes =========================================================
app.get('*.html', function(req, res) {
  res.sendFile(__dirname+ '/public/reports.html');
 });
app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users
var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
