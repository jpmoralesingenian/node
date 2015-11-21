/*
This creates a generic entity that has the following functions:
Each function receives the database and the entity as a parameter and returns a function that does whatever it needs to
findById
findAll
*/

var util = require('util');
module.exports = function(db,table) {
	var answer = {
		name : table,
		findById : function(req, res) {
			var id = req.params.id;
			console.log('Retrieving ' + table + ': ' + id);
			db.collection(table, function(err, collection) {
				collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
					res.send(item);
				});
			});
		},
		findAll : function(req, res) {
			db.collection(table, function(err, collection) {
					collection.find().toArray(function(err, items) {
					res.send(items);
				});
			});
		},
		addEntity: function(req, res) {
			console.log('Request is: ' + util.inspect(req.body));
			var entity = req.body;
			console.log('Adding ' + table + ': ' + JSON.stringify(entity));
			db.collection(table, function(err, collection) {
				collection.insert(entity, {safe:true}, function(err, result) {
					if (err) {
						res.send({'error':'An error has occurred'});
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
				collection.update({'_id':new BSON.ObjectID(id)}, entity, {safe:true}, function(err, result) {
					if (err) {
						console.log('Error updating '+ table + ': ' + err);
						res.send({'error':'An error has occurred'});
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
	};
	return answer;
}
