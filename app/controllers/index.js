function doClick(e) {
    alert($.label.text);
}




var Map = require('ti.map');
var geofencing = require("com.tentie.geofencing");



//var authStatus = geofencing.getAuthorizationStatus();
//console.log("Authorization status is " +  authStatus);
//var mapview = MapModule.createView({mapType:MapModule.NORMAL_TYPE});

//37.78583400,-122.40641700

var howardManor = Map.createAnnotation({
    latitude:38.925609,
    longitude:-77.022353,
    title:"Howard Manor",
    pincolor:Map.ANNOTATION_RED,
    myid:1 // Custom property to uniquely identify this annotation.
});


var currentLocation = Map.createAnnotation({
    latitude:38.925609,
    longitude:-77.022353,
    title:"My location",
    pincolor:Map.ANNOTATION_BLUE,
    myid:1 // Custom property to uniquely identify this annotation.
});





var mapview = Map.createView({
    mapType: Map.HYBRID_TYPE,
    region: {latitude: 38.925609, longitude: -77.022353},
    animate:true,
    regionFit:true,
    userLocation:true,
    showsBuildings: true,
    
   annotations:[ currentLocation ]
});

var circle = Map.createCircle({
    center: { latitude: 38.925609, longitude: -77.022353},
    radius: 40, //1km
    fillColor: "#80FF0000",
    strokeWidth: 2,
    strokeColor: "#80FF0000"
});
var circle1 = Map.createCircle({
    center: { latitude: 38.925609, longitude: -77.022353},
    radius: 45, //1km
    fillColor: "#80d3d3d3",
    strokeWidth: 2,
    strokeColor: "#80FF0000"
});

var circle2 = Map.createCircle({
    center: { latitude: 38.925609, longitude: -77.022353},
    radius: 35, //1km
    fillColor: "#80ADD8E6",
    strokeWidth: 2,
    strokeColor: "#80FF0000"
});





mapview.addCircle(circle1);
mapview.addCircle(circle);
mapview.addCircle(circle2);

$.index.add(mapview);


Titanium.Geolocation.accuracy = Titanium.Geolocation.ACCURACY_BEST;
Titanium.Geolocation.getCurrentPosition(function(e){
	console.log("Current position:");
	console.log(e);
});


/*
Titanium.Geolocation.addEventListener("location", function(e){
	console.log(e);
});
*/

var region1 = {
	latitude: 38.925609,
	longitude: -77.022353,
	title: "Howard manor region",
	radius: 40
};

function regionMonitorCallback(e)
{
	console.log("Region monitoring returned");
	//console.log(e);
	alert(e.type + " : " + e.identifier);
}

function loaded(e)
{
	console.log("Loaded");
	mapview.removeEventListener("complete", loaded);
	geofencing.startGeofencing([region1], regionMonitorCallback);
}

mapview.addEventListener("complete", loaded);
$.index.open();


