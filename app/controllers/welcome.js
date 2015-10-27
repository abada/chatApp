var args = arguments[0] || {};
var webService = require("webService");
var fb = require('facebook');
 fb.permissions = ["public_profile", "email"];
 fb.appid = "1694515444111183";
fb.addEventListener('logout', fbLogoutCallback);


$.createAccount.addEventListener("click", function(){
	var signupWin = Alloy.createController("signup").getView();
	signupWin.open({modal: true});
});

$.emailLoginButton.addEventListener("click", function(){
	var loginWin = Alloy.createController("login", {
		didFinishLogin:function(){
			loginWin.close({animated: false});
			args.finishLogin();
		}, completeSignup:function(data){
			loginWin.close({animated: false});
			completeSignup(data);
		}
	}).getView();
	$.navWindow.openWindow(loginWin);
});



$.fbLoginButton.addEventListener("click", loginWithFacebook);

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
    		completeSignup(result);
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
		args.finishLogin();
	}, function(error){
		alert("Something wrong happened, please try again");
		console.log(error);
	});
}



function completeSignup(data)
{
	
	var signupWin = Alloy.createController("signup", {fbUserData: data, cancelCallback: signupCancelCallback, didFinishLogin:function(){
			signupWin.close({animated: false});
			args.finishLogin();
		}}).getView();
	signupWin.open({modal: true});
}


function signupCancelCallback()
{
	if (fb.loggedIn)
	{
		fb.logout();
	}
}
