angular.module('encuesta.services', ['ngResource']) 
.factory('Meseros', function ($resource) {
	return $resource('http://localhost:5000/api/meseros/:meseroId');
})
.factory('Locations', function($resource) { 
	return $resource('http://localhost:5000/api/locations/:locationId');
})
;
