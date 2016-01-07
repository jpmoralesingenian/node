angular.module('encuesta.services', ['ngResource']) 
.factory('Meseros', ['CONFIGURATION','$resource', function (CONFIGURATION,$resource) {
	return $resource(CONFIGURATION.rest_url + 'api/meseros/:meseroId');
}])
.factory('Locations',['CONFIGURATION', '$resource', function (CONFIGURATION,$resource) { 
	return $resource(CONFIGURATION.rest_url + 'api/locations/:locationId');
}])
.factory('Encuestas',['CONFIGURATION', '$resource', function (CONFIGURATION,$resource) { 
	return $resource(CONFIGURATION.rest_url + 'api/encuestas/:encuestaId');
}])
;
