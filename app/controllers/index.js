var webService = require("webService");

var homeCtrl = Alloy.createController("home", {logout: logoutUser});
var homeWin = homeCtrl.getView();

var welcomeCtrl = Alloy.createController("welcome", {finishLogin: finishLogin});
var welcomeWin = welcomeCtrl.getView();
$.index.open();
checkLogin();
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
