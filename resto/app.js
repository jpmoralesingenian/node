var express = require('express');
var app = express();
app.get('/api/meseros', function(req, res) {
    res.send([{id:1,name:'Homero'}, {id:2,name:'Moe'}, {id:3,name:'Horace'}, {id:4,name:'Philip'}, {id:5,name:'Bender'}]);
});
app.get('/api/meseros/:id', function(req, res) {
    res.send({id:req.params.id, name: "The Name"});
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
