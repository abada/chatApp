var args = arguments[0] || {};
var webService = require("webService");
var fb = require('facebook');
 fb.permissions = ["public_profile", "email"];
 fb.appid = "1694515444111183";

$.rightNavButton.addEventListener("click", loginUser);
$.leftNavButton.addEventListener("click", closeWindow);
$.fbLoginButton.addEventListener("click", loginWithFacebook);


function closeWindow()
{
	$.rootWindow.close();
}
function loginUser()
{
	var email = $.emailField.value;
	var password = $.passwordField.value;
	
	if (email.length == 0 || password.length == 0)
	{
		alert("Please enter your email and password first");
		return;
	}
	
	webService.login({username: email, password: password}).then(function(e){
		args.didFinishLogin();
	}, function(error){
		alert("Invalid email or password, please try again");
	});
}


function loginWithFacebook()
{
	if(!fb.loggedIn)
	{
		fb.authorize();
		fb.addEventListener('login', fbLoginCallback);
	}
	else
	{
		console.log("already logged in");
		getFBAuthStatus(fb.accessToken);
	}
}



function fbLogoutCallback()
{
	 console.log("logged out");
}

function fbLoginCallback(e)
{
	fb.removeEventListener('login', fbLoginCallback);
    if (e.success) {
        webService.getAuthStatus(fb.accessToken).then(function(result){
        	
        	console.log(result);
        	if (!result.isRegisteredUser)
        	{
        		console.log("I gotm herewe");
        		completeSignup(result);
        	}
        	
        }, function(error){
        	
        	console.log(error);
        });
    }
    else if (e.cancelled)
    {
    	alert("You cancelled the fb login");
    }
    else
    {
    	alert(e.error);
    }
}

function getFBAuthStatus(accessToken)
{
	 webService.getAuthStatus(accessToken).then(function(result){
    	
    	console.log(result);
    	if (!result.isRegisteredUser)
    	{
    		args.completeSignup(result);
    	}
    	else
    	{
    		loginWithAuthCredentials(result.authUserEmail, result.authUserId);
    	}
    	
    }, function(error){
    	
    	console.log(error);
    	alert("Something wrong happened, please try again");
    });
}


function loginWithAuthCredentials(email, userId)
{
	webService.loginWithAuthCredentials ({authUserEmail: email, authUserId:userId}).then(function(){
		args.didFinishLogin();
	}, function(error){
		alert("Something wrong happened, please try again");
		console.log(error);
	});
}

