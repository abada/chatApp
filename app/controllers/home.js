var args = arguments[0] || {};
var webService = require("webService");
var Map = require('ti.map');
var geofencing = require("com.tentie.geofencing");
var mapview;
var region1 = {
	latitude: 38.925609,
	longitude: -77.022353,
	title: "Howard manor region",
	radius: 40
};

getUsersInCurrentRegion();


checkPermission();
function checkPermission()
{
	geofencing.requestAuthorization(function (event){
		console.log(event);
		if (event.status == Alloy.CFG.STATUSAUTHORIZED || event.status == Alloy.CFG.STATUSAUTHORIZEDWHENINUSE)
		{
			initialize();
		}
		else {
			console.log("No location authorization");
		}
	});
}





function initialize()
{
	
	var howardManor = Map.createAnnotation({
	    latitude:38.925609,
	    longitude:-77.022353,
	    title:"Howard Manor",
	    pincolor:Map.ANNOTATION_RED,
	    myid:1 // Custom property to uniquely identify this annotation.
	});
	
	mapview = Map.createView({
	    mapType: Map.HYBRID_TYPE,
	    region: {latitude: 38.925609, longitude: -77.022353},
	    animate:true,
	    regionFit:true,
	    userLocation:true,
	    showsBuildings: true,
	    annotations:[ howardManor ]
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
	$.mapViewContainer.add(mapview);
	
	
	
	var currentLocation = Map.createAnnotation({
	    latitude:38.925609,
	    longitude:-77.022353,
	    title:"My location",
	    pincolor:Map.ANNOTATION_BLUE,
	    myid:1 // Custom property to uniquely identify this annotation.
	});
	
	mapview.addEventListener("complete", loaded);
}



function getUsersInCurrentRegion()
{
	var webService = require("webService");
	webService.getUsersInRegion("test").then(function(data){
		var listViewItems = [];
		try{
				data.forEach(function(user){
				var name = user.nickName;
				var  image = user.profilePictureUrl;
				
				var item = {
					properties :{
						data:  user
					},
					imageView: {
						image:image
					},
					nickNameLabel:{
						text: name
					}
				};
				
			 listViewItems.push(item);
				
			});
			
			$.listSection.insertItemsAt(0, listViewItems);
		}
		catch(error)
		{
			console.log("Error adding items" + JSON.stringify(error));
		}
		
		
	}, function(error){
		console.log(error);
	});

}


function startGeofenceMonitor()
{
	
}



function regionMonitorCallback(e)
{
	console.log("Region monitoring returned");
	alert(e.type + " : " + e.identifier);
}

function loaded(e)
{
	console.log("Loaded");
	mapview.removeEventListener("complete", loaded);
	geofencing.startGeofencing([region1], regionMonitorCallback);
}


$.messagesButton.addEventListener("click", function(){
	var conversationWin = Alloy.createController("conversation").getView();
	conversationWin.open({modal: true});
});


$.settingsButton.addEventListener("click", function(){
	var settingsWin = Alloy.createController("settings", {didClickLogout: args.logout}).getView();
	settingsWin.open({modal: true});
});



function didClickListItem(e)
{
	//console.log(e);
	var item = $.listSection.getItemAt(e.itemIndex);
	var profileViewWin = Alloy.createController("profileView", {image: item.imageView.image, name: item.nickNameLabel.text}).getView();
	$.navWindow.openWindow(profileViewWin);
}
