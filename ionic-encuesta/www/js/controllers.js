angular.module('encuesta.controllers', ['encuesta.services','ionic.rating'])
.controller('AppCtrl',function($scope, $ionicModal, $timeout) {
	console.log("Inside AppCtrl");
	var d = new Date();
	$scope.number = 1+(d.getTime() %3);
})
.controller('MeserosCtrl', function(CONFIGURATION,$scope, $stateParams,Meseros,Locations) {
    $scope.CONFIGURATION = CONFIGURATION;
    console.log("Inside MeserosCtrl "+$stateParams.locationId);
    Locations.get({"locationId":$stateParams.locationId}, function(loc) { 
	console.log("Found the location");
	$scope.locattion = loc;
    	$scope.meseros = Meseros.query({"locattion_id":loc._id},function() {}, function(error) {console.log("There is an error "+JSON.stringify(error));});
    },function(error) {console.log("There is an error "+JSON.stringify(error));});
})
.controller('LocationsCtrl', function($scope, $stateParams, Locations) {
    console.log("On the LocationS controller");
    $scope.locattions = Locations.query({},function() {}, function(error) {console.log("There is an error "+JSON.stringify(error));});
})
.controller('LocationCtrl', function($scope, $state,Locations) {
    
    var onSuccess = function(position) {
	var locations = Locations.query({},function() {
		var minDistance = -1;
		var minLoc;
		var distance;
		locations.forEach(function (loc,index,array) {
			distance = Math.abs(position.coords.latitude - loc.latitude) + Math.abs(position.coords.longitude);
			if(minDistance== -1 || distance < minDistance) {
				minDistance = distance;
				minLoc = loc;		
			}
		});
		$scope.currentLocation = minLoc;
		console.log("Location was correct, on to meseros");
		$state.go('app.meseros',{"locationId":minLoc._id});	
	},onError);

	};
	// onError Callback receives a PositionError object
	//
	function onError(error) {
	    console.log('code: '    + error.code    + '\n' +
        	  'message: ' + error.message + '\n');
	    $state.go('app.locations');
	}
	console.log("Inside the positional thingy");
	navigator.geolocation.getCurrentPosition(onSuccess, onError,{timeout:5000});

	
})
.controller('EncuestaCtrl', function(CONFIGURATION, $scope, $stateParams, Meseros) {
    $scope.rate=4;
    $scope.max =5;
    $scope.CONFIGURATION = CONFIGURATION;
    Meseros.get({"meseroId":$stateParams.meseroId}, function(mesero) { 
	$scope.mesero = mesero;
    });
})
.controller('EncuestaSendCtrl', ['$scope','$state','Encuestas', function($scope, $state , Encuestas) {
    //$scope.meseroId = $stateParams.meseroId;
    console.log("Comment is ["+ $scope.comment+ "] and rate is ["+ $scope.rate+"] ["+$scope.meseroId+"]");
    $scope.calificar= function(encuestaForm, mesero) {
	console.log("Revisando si el formulario es válido..."+encuestaForm.$valid);
	$scope.sent = true;
	if(encuestaForm.$valid) {
		// Rate the guy using the factory
    		console.log("Submit function ["+ $scope.comment+ "] and rate is ["+ $scope.rate+"] [mesero: "+mesero._id+"]");
		Encuestas.save({score:$scope.rate,mesero: [ mesero ],comments:$scope.comment, phone:$scope.phonenumber,email:$scope.email, when: new Date()}, function (){}, function (err) { console.log("Hay un error: "+ JSON.stringify(err)+ "->"+err.message);});
		$state.go('app.thankyou');
	} else {
	}
    }
}])
;
