Alloy.Globals.Device = {
	version : Ti.Platform.version,
	width : Ti.Platform.displayCaps.platformWidth,
	height : Ti.Platform.displayCaps.platformHeight,
	dpi : Ti.Platform.displayCaps.dpi,
	defaultWindowHeight: Ti.Platform.displayCaps.platformHeight - 80
};
var heightPadding = 37;
Alloy.Globals.itemScreenWidth = (Alloy.Globals.Device.width/3) - 15;
Alloy.Globals.itemScreenHeight = (Alloy.Globals.itemScreenWidth) + heightPadding;
Alloy.Globals.itemImageSize = Math.floor(Alloy.Globals.itemScreenWidth - 10);
Alloy.Globals.itemImageRadius = Math.floor(Alloy.Globals.itemImageSize/2);
Alloy.Globals.itemLabelHeight = 20;
//console.log("Size is " + Alloy.Globals.itemImageSize);
//console.log("Radius is " + Alloy.Globals.itemImageRadius);

Alloy.Globals.defaultNavBarColor = "#4B598A";
Alloy.Globals.jolicode = {};
Alloy.Globals.jolicode.pageflow = {};
Alloy.Globals.jolicode.pageflow.height = Ti.Platform.displayCaps.platformHeight;
Alloy.Globals.jolicode.pageflow.width = Ti.Platform.displayCaps.platformWidth;

var webService = require("webService");
Alloy.Globals.webService = webService;
var Q = require("q");
Alloy.Globals.Q = Q;

var maxFetchRetries = 3;
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
Alloy.Globals.openWindow = function (_params)
{
	
	if (!Alloy.Globals.pageFlow)
	{
		console.log("Error opening window, no pageFlow controller found in Alloy.Globals");
		return;
	}
	
	
	var left = null;
	var right = null;
	var center = null;
	
	var leftCtrl;
	var centerCtrl;
	var rightCtrl;
	//var backButton;
	_params.arguments.didSetOnRightClick = false;
	_params.arguments.didSetOnLeftClick = false;
	
	if (_params.left)
	{
		leftCtrl = Alloy.createController("nav/left", {buttonTitle: _params.left.title});
		left = leftCtrl.getView();;
		_params.arguments.onLeftClick = leftCtrl.setOnClick;
		_params.arguments.didSetOnLeftClick = true;
	}
	
	if (_params.right)
	{
		rightCtrl = Alloy.createController("nav/right", {buttonTitle: _params.right.title});
		right = rightCtrl.getView();
		_params.arguments.onRightClick = rightCtrl.setOnClick;
		_params.arguments.didSetOnRightClick = true;
	}
	
	centerCtrl = Alloy.createController("nav/center", {title: _params.navBarTitle});
	center = centerCtrl.getView();
	
	
	
	var navBar = {
		center: center,
		left: left,
		right: right
	};
	
	for (var key in navBar)
	{
		if (!navBar[key])
		{
			delete navBar[key];
		}
	}
	
	
	navBar.backgroundColor = _params.navBarColor? _params.navBarColor: Alloy.Globals.defaultNavBarColor;
	Alloy.Globals.pageFlow.addChild({
	    arguments: _params.arguments,
	    backButton:{
	    	hidden: true
	    },
	    controller: _params.name,
	    navBarHidden: _params.navBarHidden? _params.navBarHidden: false,
	    navBar: navBar,
	    direction: _params.direction
	 });
};

Alloy.Globals.conversationCenter = {};
Alloy.Globals.conversationCenter.messageStore = {};
Alloy.Globals.conversationCenter.hasFetchedConversations = false;


function sortConversationsByDate()
{
	
}


function fetchConversations(_refresh)
{
	var deferred = Q.defer();
	if (!_refresh)
	{
		if (Alloy.Globals.conversationCenter.hasFetchedConversations)
		{
			deferred.resolve(Alloy.Globals.conversationCenter.conversations);
		}
		else
		{
			fetch();
		}
	}
	else
	{
		Alloy.Globals.conversationCenter.hasFetchedConversations = false;
		Alloy.Globals.conversationCenter.conversations = [];
		Alloy.Globals.conversationCenter.messageStore = {};
		fetch();
	}
	
	
	function fetch()
	{
		var currentUser = Ti.App.Properties.getObject('parseUser');
		console.log(currentUser);
		webService.listConversations(currentUser.objectId).then(function(result){
			
			
			result.forEach(function(conversation){
				if (!Alloy.Globals.conversationCenter.messageStore[conversation.objectId])
				{
					Alloy.Globals.conversationCenter.messageStore[conversation.objectId] = {
						hasNewMessage: false,
						hasFetchedMessages: false,
						messageList : []
					};
				}
				
			});
			
			Alloy.Globals.conversationCenter.conversations = result;
			Alloy.Globals.conversationCenter.hasFetchedConversations = true;
			deferred.resolve(Alloy.Globals.conversationCenter.conversations);
			
		}, function (error)
		{
			deferred.reject(error);
		});
	}
	
	return deferred.promise;
	
}

function getMessagesInConversation(_conversationId)
{
	var deferred = Q.defer();
	if (!Alloy.Globals.conversationCenter.messageStore[_conversationId].hasFetchedMessages)
	{
		
		webService.getMessagesFromConversationWithId(_conversationId).then(function(messages){
			
			Alloy.Globals.conversationCenter.messageStore[_conversationId].messageList = messages;
			Alloy.Globals.conversationCenter.messageStore[_conversationId].hasFetchedMessages = true;
			deferred.resolve(messages);
			
		}, function(error){
			
			console.log("Error fetching messages in conversation with id:" + _conversationId + " error: " + JSON.stringify(error));
			deferred.reject(error);
		});
	}
	else
	{
		deferred.resolve(Alloy.Globals.conversationCenter.messageStore[_conversationId].messageList);
	}
	
	return deferred.promise;
}

function createNewConversation(_partnerUserId, text)
{
	var deferred = Q.defer();
	if (!_partnerUserId || text.length == 0)
	{
		deferred.reject({message: "Invalid partnerId or text"});
	}
	else
	{
		var currentUser = Ti.App.Properties.getObject('parseUser');
		webService.createConversation({createdByUserWithId:currentUser.objectId, partnerUserWithId: _partnerUserId}).then(function(conversation){
			Alloy.Globals.conversationCenter.conversations.push(conversation);
			/**
			 * Sort by updatedAt
			 */
			
			Alloy.Globals.conversationCenter.messageStore[conversation.objectId] = {
				hasNewMessage: false,
				hasFetchedMessages: false,
				messageList : []
			};
			
			return [conversation, webService.addMessageToConversation({text: text, conversationId: conversation.objectId, fromUserWithId: currentUser.objectId})];
	
		}).spread(function(conversation, message){
			
			Alloy.Globals.conversationCenter.messageStore[conversation.objectId].messageList.push(message);
			
			
			deferred.resolve({
				conversation: conversation,
				message: message
			});
			
		}, function(error){
			
			deferred.reject(error);
		});
	}
	
	return deferred.promise;
}

function isNewConversation(_userId)
{
	if (Alloy.Globals.conversationCenter.hasFetchedConversations)
	{
		for (var index in Alloy.Globals.conversationCenter.conversations)
		{
			var conversation = Alloy.Globals.conversationCenter.conversations[index];
			if (conversation.createdByUser.objectId == _userId || conversation.partner.objectId == _userId)
			{
				return false;
			}
		}
		
		return true;
	}
	else
	{
		/*
		fetchConversations(false).then(function(){
			isNewConversation(_userId);
		}, function(error){
			console.log("Error fetching conversations:" + JSON.stringify(error));
		});
		*/
		console.log("Error, we haven't fetched conversations yet");
	}
}



Alloy.Globals.conversationCenter.fetchConversations = fetchConversations;
Alloy.Globals.conversationCenter.createNewConversation = createNewConversation;
Alloy.Globals.conversationCenter.getMessagesInConversation = getMessagesInConversation;
Alloy.Globals.conversationCenter.isNewConversation = isNewConversation;