var mongo = require('mongodb');
var util = require('util');
var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('resto', server);

db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'resto' database");
        db.collection('meseros', {strict:true}, function(err, collection) {
            if (err) {
                console.log("The 'meseros' collection doesn't exist. Creating it with sample data...");
                populateDB();
            }
        });
    }
});
exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving mesero: ' + id);
    db.collection('meseros', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};

exports.findAll = function(req, res) {
    db.collection('meseros', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.addMesero = function(req, res) {
    console.log('Request is: ' + util.inspect(req.body));
    var mesero = req.body;
    console.log('Adding mesero: ' + JSON.stringify(mesero));
    db.collection('meseros', function(err, collection) {
        collection.insert(mesero, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
}

exports.updateMesero = function(req, res) {
    var id = req.params.id;
    var mesero = req.body;
    console.log('Updating mesero: ' + id);
    console.log(JSON.stringify(mesero));
    db.collection('meseros', function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, mesero, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating mesero: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(mesero);
            }
        });
    });
}

exports.deleteMesero = function(req, res) {
    var id = req.params.id;
    console.log('Deleting mesero: ' + id);
    db.collection('meseros', function(err, collection) {
        collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
}

/*--------------------------------------------------------------------------------------------------------------------*/
// Populate database with sample data -- Only used once: the first time the application is started.
// You'd typically not find this code in a real-life app, since the database would already exist.
var populateDB = function() {

    var meseros = [
    { name: "Homero"},
    { name: "Moe"},
    { name: "Horace"},
    { name: "Philip"},
    { name: "Bender"}];

    db.collection('meseros', function(err, collection) {
        collection.insert(meseros, {safe:true}, function(err, result) {});
    });

};
