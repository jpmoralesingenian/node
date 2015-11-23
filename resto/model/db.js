var mongo = require('mongodb');
var Server = mongo.Server,
Db = mongo.Db;
var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('resto', server);
db.ObjectID = mongo.ObjectID;
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

module.exports = db;
