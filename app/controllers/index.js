



/**
 * navBarTitle
 * left.title, left.onClick
 * right.title, right.onClick
 * navBarColor
 * navBarHidden
 * direction,
 * name,
 * arguments
 */
Alloy.Globals.pageFlow = $.pageflow;
Alloy.Globals.openWindow({
	name: "home",
	arguments: {},
	navBarTitle: "Home",
	navBarColor: "#4B598A",
	left :{
		title : 'Settings'
	},
	right: {
		title: "Messages"
	}
});



/*

var left = Alloy.createController("left", {buttonTitle: "Settings"});
var center = Alloy.createController("nav/center", {title: "Home"});
$.pageflow.addChild({
    arguments: {
    	onLeftClick: left.setOnClick
    },
    controller: 'home',
    navBar:{
    	backgroundColor: 'red',
    	left: left.getView(),
    	center: center.getView()
    }
 });
*/

$.index.open();


var webService = require("webService");
var homeCtrl = Alloy.createController("home", {logout: logoutUser});
var homeWin = homeCtrl.getView();

var welcomeCtrl = Alloy.createController("welcome", {finishLogin: finishLogin});
var welcomeWin = welcomeCtrl.getView();
$.index.open();
//checkLogin();
function checkLogin()
{
	if (webService.loggedIn())
	{
		showHome();
	}
	else
	{
		showWelcome();
	}
}


function showWelcome()
{
	
	welcomeWin.open({modal: true});
}

function showHome()
{
	
	homeWin.open({animated: false});
}

function logoutUser()
{
	webService.logout();
	homeWin.close();
	showWelcome();
}


function finishLogin()
{
	//Do some other stuff before this 
	welcomeWin.close();
	showHome();
}

