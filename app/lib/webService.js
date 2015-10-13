       var baseUrl = "http://8e690a22.ngrok.io/api/v1";
var Q = require("q");

exports.createUser = function(_params)
{
	var data = {
		url: "/user",
		method: "POST",
		params:_params
	};
	
	return makeHttpRequest("signup", data);	
};


exports.loginUser = function(_params)
{
	var data = {
		url : "/user/login",
		method: "POST",
		params: _params
	};
	return makeHttpRequest("login", data);
};

exports.getAuthStatus = function(_accessToken)
{
	var data = {
		url : "/user/authstatus/" + _accessToken,
		method: "GET"
	};
	return makeHttpRequest("getAuthStatus", data);
};



exports.uploadImage = function(_params)
{
	var data = {
		url : "/media/image",
		method: "POST",
		params: _params
	};
	return makeHttpRequest("uploadImage", data);
};

exports.getRandomUsers = function()
{
	var data = {
		url : "http://api.randomuser.me/?results=20",
		method: "GET"
	};
	return makeHttpRequest("getRandomUsers", data);
};

exports.createConversation = function(_params)
{
	var data = {
		url : "/conversation",
		method: "POST",
		params: _params
	};
	return makeHttpRequest("createConversation", data);
};


exports.addMessageToConversation = function(_params)
{
	var data = {
		url : "/conversation/messages",
		method: "POST",
		params: _params
	};
	return makeHttpRequest("addMessageToConversation", data);
};

exports.getMessagesFromConversationWithId = function(_conversationId)
{
	var data = {
		url : "/conversation/"+ _conversationId + "/messages",
		method: "GET"
	};
	return makeHttpRequest("getMessagesFromConversationWithId", data);
};



function makeHttpRequest(_action, _data)
{
	var deferred = Q.defer();
	var url;
	if (_action == "getRandomUsers")
	{
		url = _data.url;
	}
	else
	{
		url = baseUrl + _data.url;
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
}