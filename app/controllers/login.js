var args = arguments[0] || {};
var webService = require("webService");
var fb = require('facebook');
 fb.permissions = ["public_profile", "email"];
fb.addEventListener('logout', fbLogoutCallback);

$.createAccount.addEventListener("click", function(){
	var signupWin = Alloy.createController("signup").getView();
	signupWin.open({modal: true});
});


$.fbLoginButton.addEventListener("click", loginWithFacebook);

function loginWithFacebook()
{
	fb.addEventListener('login', fbLoginCallback);
 	fb.initialize(1000);
 	fb.authorize();
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


function completeSignup(data)
{
	
	var signupWin = Alloy.createController("signup", {fbUserData: data, cancelCallback: signupCancelCallback}).getView();
	signupWin.open({modal: true});
}


function signupCancelCallback()
{
	if (fb.loggedIn)
	{
		fb.logout();
	}
}
