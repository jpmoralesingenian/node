/*
This creates a generic entity that has the following functions:
Each function receives the database and the entity as a parameter and returns a function that does whatever it needs to
findById
findAll
*/

var util = require('util');
// Inspired by https://mongodb.github.io/node-mongodb-native/driver-articles/mongoclient.html
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var util = require('util');
var url = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/resto';
var db;
MongoClient.connect(url, function(err, database) {
	console.log('Connecting to '+url + '!!!');
	db = database.db('resto');
	db.ObjectID = mongodb.ObjectID;
	module.exports = db;
	
});
module.exports = function(table) {
	var answer = {
		name : table,
		findById : function(req, res) {
			var id = req.params.id;
			console.log('Retrieving ' + table + ': ' + id+ "->"+util.inspect(db));
			db.collection(table, function(err, collection) {
				collection.findOne({'_id':new db.ObjectID(id)}, function(err, item) {
					res.send(item);
				});
			});
		},
		findAll : function(req, res) {
			console.log('Retrieving ' + table + ': ->'+db);
			db.collection(table, function(err, collection) {
				if(err) {
					console.log("Error in find: "+ err);
				} else {
					collection.find().toArray(function(err, items) {
						res.send(items);
					});
				} 
			});
		},
		addEntity: function(req, res) {
			console.log('Request is: ' + util.inspect(req.body));
			var entity = req.body;
			entity = fixIds(db,entity);
			if(entity.when) entity.when = new Date(entity.when);
			console.log('Adding ' + table + ': ' + JSON.stringify(entity));
			db.collection(table, function(err, collection) {
				collection.insert(entity, {safe:true}, function(err, result) {
					if (err) {
						console.log('Error adding '+err);
					 	console.log("Authenticated user: "+db.runCommand({connectionStatus:1}).authInfo.authenticatedUsers[0]);
						res.send({'error':'An error has occurred '+err});
					} else {
						console.log('Success: ' + JSON.stringify(result[0]));
						res.send(result[0]);
					}
				});
			});	
		},
		updateEntity: function(req, res) {
			var id = req.params.id;
			var entity = req.body;
			console.log('Updating '+ table + ': ' + id);
			console.log(JSON.stringify(entity));
			db.collection(table, function(err, collection) {
				collection.update({'_id':new db.ObjectID(id)}, entity, {safe:true}, function(err, result) {
					if (err) {
						console.log('Error updating '+ table + ': ' + err);
						res.send({'error':'An error has occurred '+err});
					} else {
						console.log('' + result + ' document(s) updated');
						res.send(entity);
					}
				});
			});
		},
		deleteEntity : function(req, res) {
			var id = req.params.id;
			console.log('Deleting '+ table + ': ' + id);
			db.collection(table, function(err, collection) {
				collection.remove({'_id':new db.ObjectID(id)}, {safe:true}, function(err, result) {
					if (err) {
						res.send({'error':'An error has occurred ' + err});
					} else {
						console.log('' + result + ' document(s) deleted');
						res.send(req.body);
					}
				});
			});
		}
	};
	return answer;
}
/*
 Make sure all properties called _id are ObjectID
 */
function fixIds(db,object) {
	for (var property in object) {
		// It is not my property
	    if (!object.hasOwnProperty(property)) {
			continue;
    	}
		if(property=='_id') {
			object[property] = db.ObjectID(object[property]);
			continue;
		}
		if(Array.isArray(object[property])) {
			var arr = object[property];
			arr.forEach(function(value,index,array) {
				array[index] = fixIds(db,value);
			});		
			object[property] = arr;	
		}
	}
	return object;
}
