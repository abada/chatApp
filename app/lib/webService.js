var Q = require("q");


var WebService = function()
{
	this.baseUrl = "http://8f90c1c6.ngrok.io/api/v1";
};


WebService.prototype.createUser = function(_params)
{
	var data = {
		url: "/user",
		method: "POST",
		params:_params
	};
	
	return this.makeHttpRequest("signup", data);	
};

WebService.prototype.login = function(_params)
{
	var data = {
		url : "/user/login",
		method: "POST",
		params: _params
	};
	return this.makeHttpRequest("login", data);
};

WebService.prototype.loginWithAuthCredentials = function(_params)
{
	var data = {
		url : "/user/login/auth",
		method: "POST",
		params: _params
	};
	return this.makeHttpRequest("login", data);
};

WebService.prototype.getAuthStatus = function(_accessToken)
{
	var data = {
		url : "/user/authstatus/" + _accessToken,
		method: "GET"
	};
	return this.makeHttpRequest("getAuthStatus", data);
};

WebService.prototype.loggedIn = function()
{
	//console.log("Session token is " + Ti.App.Properties.getString('parseSessionToken'));
	return Ti.App.Properties.hasProperty('parseSessionToken');
};

WebService.prototype.logout = function()
{
	Ti.App.Properties.removeProperty('parseSessionToken');
	Ti.App.Properties.removeProperty('parseUser');
}; 


WebService.prototype.uploadImage = function(_params)
{
	var data = {
		url : "/media/image",
		method: "POST",
		params: _params
	};
	return this.makeHttpRequest("uploadImage", data);
};


WebService.prototype.getUsersInRegion = function(_regionIdentifier)
{
	var data = {
		url : "/user/region/" + _regionIdentifier,
		method: "GET"
	};
	return this.makeHttpRequest("getUsers", data);
};


WebService.prototype.getRandomUsers = function()
{
	var data = {
		url : "http://api.randomuser.me/?results=20",
		method: "GET"
	};
	return this.makeHttpRequest("getRandomUsers", data);
};

WebService.prototype.createConversation = function(_params)
{
	var data = {
		url : "/conversation",
		method: "POST",
		params: _params
	};
	return this.makeHttpRequest("createConversation", data);
};


WebService.prototype.addMessageToConversation = function(_params)
{
	var data = {
		url : "/conversation/messages",
		method: "POST",
		params: _params
	};
	return this.makeHttpRequest("addMessageToConversation", data);
};

WebService.prototype.getMessagesFromConversationWithId = function(_conversationId)
{
	var data = {
		url : "/conversation/"+ _conversationId + "/messages",
		method: "GET"
	};
	return this.makeHttpRequest("getMessagesFromConversationWithId", data);
};



WebService.prototype.makeHttpRequest = function(_action, _data)
{
	var deferred = Q.defer();
	var url;
	if (_action == "getRandomUsers")
	{
		url = _data.url;
	}
	else
	{
		url = this.baseUrl + _data.url;
	}
	//var url = baseUrl + _data.url;
	var client = Ti.Network.createHTTPClient({
	     onload : function(e) {
	     	var response = JSON.parse(this.responseText);
	     	switch(_action){
	     		case "login": case "signup":
	     			Ti.App.Properties.setString('parseSessionToken', response.sessionToken);
					Ti.App.Properties.setObject('parseUser', response.user);
	        		deferred.resolve({
	        			user: response.user,
	        			sessionToken: response.sessionToken
	        		});
	        		break;
	        	case "logout":
	        		Ti.App.Properties.removeProperty('parseSessionToken');
	        	 	Ti.App.Properties.removeProperty('parseUser');
	        		deferred.resolve("Successfully logged out");
	        		break;
	        	default:
	        		deferred.resolve(response);
	        		
	     	}	
	     },
	     onerror : function(e) {
	     	var error = {
	     		code: e.code,
	     		message: this.responseText
	     	};
	  		console.log(error);
	        deferred.reject(error);
	        
	     },
	     timeout : 900000  //15 minutes
	 });
	 

	 client.open(_data.method, url);
	 var params = _data.params;
	 
	 if(Ti.App.Properties.hasProperty('parseSessionToken'))
	 {
	 	 var sessionToken = Ti.App.Properties.getString('parseSessionToken');
	 	 client.setRequestHeader("USER-SESSION-TOKEN", sessionToken);
	 }
	
	//client.setRequestHeader("enctype", " multipart/form-data");
	 
	 if (!params)
	 {
	 	client.send();
	 }
	 else
	 {
	 	client.send(params);
	 }
	 
	 return deferred.promise;
};

var webService = new WebService();
module.exports = webService;
