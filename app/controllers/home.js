var args = arguments[0] || {};
var webService = require("webService");
var Map = require('ti.map');
var geofencing = require("com.tentie.geofencing");
var mapview;
var region1 = {
	latitude: 38.921495,
	longitude: -77.021509,
	title: "test",
	radius: 50
};


setNavButtonListeners();

function setNavButtonListeners()
{
	if(args.didSetOnLeftClick)
	{
		args.onLeftClick(showSettings);
	}
	
	if (args.didSetOnRightClick)
	{
		args.onRightClick(showConversations);
	}
}



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
	    latitude: 38.921495,
		longitude: -77.021509,
	    title:"Howard Manor",
	    pincolor:Map.ANNOTATION_RED,
	    myid:1 // Custom property to uniquely identify this annotation.
	});
	
	mapview = Map.createView({
	    mapType: Map.HYBRID_TYPE,
	    region: {latitude: 38.921495, longitude: -77.021509},
	    animate:true,
	    regionFit:true,
	    userLocation:true,
	    showsBuildings: true,
	    annotations:[ howardManor ]
	});
	
	var circle = Map.createCircle({
	    center: { latitude: 38.921495, longitude: -77.021509},
	    radius: 50, //1km
	    fillColor: "#80FF0000",
	    strokeWidth: 2,
	    strokeColor: "#80FF0000"
	});
	var circle1 = Map.createCircle({
	    center: { latitude: 38.925609, longitude: -77.022353},
	    radius: 50, //1km
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
	
	
	//mapview.addCircle(circle1);
	mapview.addCircle(circle);
	//mapview.addCircle(circle2);
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



function getUsersInCurrentRegion(region)
{
	var webService = require("webService");
	webService.getUsersInRegion(region).then(function(data){
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
	console.log("*****************  Region monitoring returned *********************");
	console.log(e.type + " : " + e.identifier);
	if (e.type == Alloy.CFG.ENTEREDREGION)
	{
		console.log("I was triggered fetching users now");
		//$.usersViewContainer.visible = true;
		//getUsersInCurrentRegion(e.identifier);
		
		
		Alloy.Globals.conversationCenter.fetchConversations(false).then(function(result){
			console.log(result);
		}, function(error){
			console.log(error);
		});
		
		
	}
	else if (e.type == Alloy.CFG.EXITEDREGION)
	{
		$.usersViewContainer.visible = false;
	}
}

function loaded(e)
{
	console.log("Loaded");
	mapview.removeEventListener("complete", loaded);
	geofencing.startGeofencing([region1], regionMonitorCallback);
}

/*
$.messagesButton.addEventListener("click", function(){
	var conversationWin = Alloy.createController("conversation").getView();
	conversationWin.open({modal: true});
});


$.settingsButton.addEventListener("click", function(){
	var settingsWin = Alloy.createController("settings", {didClickLogout: args.logout}).getView();
	settingsWin.open({modal: true});
});

*/

function showConversations()
{
	Alloy.Globals.openWindow({
		name: "conversation",
		arguments: {},
		navBarTitle: "Messages",
		left :{
			title : 'Back'
		},
		direction:{
			top: 1,
			left: 0
		}
	});
	
}


function showSettings()
{
	Alloy.Globals.openWindow({
		name: "settings",
		arguments: {},
		navBarTitle: "Settings",
		navBarColor: "#4B598A",
		left :{
			title : 'Close'
		},
		right :{
			title : 'Save'
		},
		direction:{
			top: 1,
			left: .5
		}
	});
}


function didClickListItem(e)
{
	var item = $.listSection.getItemAt(e.itemIndex);
	console.log("Item is " + JSON.stringify(item));
	Alloy.Globals.openWindow({
		name: "profileView",
		arguments: {
			data: item,
			image: item.imageView.image, name: item.nickNameLabel.text
		},
		navBarTitle: "Profile",
		left :{
			title : 'Back'
		},
		direction:{
			top: 0,
			left: 1
		}
	});
	
}
