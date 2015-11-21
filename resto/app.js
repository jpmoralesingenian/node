var express = require('express');
var meseros = require('./routes/meseros');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.get('/api/meseros', meseros.findAll );
app.get('/api/meseros/:id', meseros.findById );
app.post('/api/meseros', meseros.addMesero);
app.put('/api/meseros/:id', meseros.updateMesero);
app.delete('/api/meseros/:id', meseros.deleteMesero);

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
