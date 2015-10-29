var args = arguments[0] || {};
var conversationId = args.conversationId;
var maxTypingHeight = 120;
if (maxTypingHeight && Math.abs(+maxTypingHeight) < 1) {
    maxTypingHeight = Ti.Platform.displayCaps.platformHeight * +maxTypingHeight;
}
var geofencing = require("com.tentie.geofencing");
var resizeThreshold = 0;
var last = 0;
var conversation = args.conversation;
var currentUser = Ti.App.Properties.getObject('parseUser');
var POP = require("guy.mcdooooo.tipop");


initialize();
function initialize()
{
	$.messageViewContainer.lockedViews = [ $.textAreaContainer, $.mainView ];
	$.textAreaContainer.addEventListener('postlayout', function (event) {
		$.messageViewContainer.keyboardTriggerOffset = event.source.rect.height;
		$.tableView.bottom = event.source.rect.height;
		$.messageContainer.bottom = event.source.rect.height;
	});
	
	$.messageViewContainer.addEventListener('keyboardchange', keyboardchange);
	$.textArea.addEventListener("change", resizeTypingArea);
	$.textArea.value = "Send Message...";
	$.textArea._hintText = $.textArea.value;
	$.textArea.addEventListener('focus', textAreaFocus);
	$.textArea.addEventListener('blur', textAreaBlur);
	$.sendButton.addEventListener("click", sendMessage);
	
	console.log(JSON.stringify($.tableView.rect));
	if (conversation != null || conversation != undefined)
	{
		
		var preloader = Alloy.createWidget("preloader", {
		    delay : 200, //milliseconds delay || default 100
		    dots : 4, //Number of dots to display || default 3
		    color : {
		        on : "#FFF488", // Switch color
		        off : "#E6E6E6",
		        random : false // Default false || if true then random color 
		    },
		    text : "Fetching messages" // Default text loading
		});
		preloader.start();
		//TODO Add loading mask here
		Alloy.Globals.conversationCenter.getMessagesInConversation(conversation.objectId).then(function(messages){
			var data = [];
			messages.forEach(function(message){
				console.log(message.fromUser.objectId);
				var rowCtrl;
				if (message.fromUser.objectId == currentUser.objectId)
				{
				
					console.log("appending");
					 rowCtrl = Alloy.createController("messagecell/outgoingTableViewRow", {text: message.text});
					 var row = rowCtrl.getView();
					 data.push(row);
				}
			});
			$.tableView.data = data;
			preloader.stop();			
			
		}, function(error){
			preloader.stop();	
			console.log(error);
		});
	}
	
}


function getMessages()
{
	
}
/*
exports.preShow = function()
{
	if (!$.messageViewContainer.keyboardPanning)
	{
		$.messageViewContainer.keyboardPanning = true;
	}
};

exports.postHide = function()
{
	$.messageViewContainer.keyboardPanning = false;
};
*/

exports.postHide = function()
{
	$.messageViewContainer.keyboardPanning = false;
};

exports.postShow = function()
{
	setTimeout(function(){
		$.textArea.focus();
	}, 800);
};


geofencing.addEventListener("keyboardWillShow", function(e){
	console.log("Keyboard will show, with height=" + e.keyboardHeight);
	 //$.tableView.top = e.keyboardHeight;
	 
	 $.tableView.animate({
	 	top: e.keyboardHeight,
	 	duration: 500,
	 	curve: Titanium.UI.ANIMATION_CURVE_EASE_IN
	 });
});

geofencing.addEventListener("keyboardWillHide", function(e){
	console.log("Keyboard will show, with height=" + e.keyboardHeight);
	// $.tableView.top = 0;
	
	 $.tableView.animate({
	 	top: 0,
	 	duration: 500,
	 	curve: Titanium.UI.ANIMATION_CURVE_EASE_IN
	 });
});


function keyboardchange(event)
{
	console.log("Height is " +  event.height);
	var next = event.height ? ($.messageViewContainer.rect.height - event.y) : 0;
	var delta = Math.abs(next - last);
	var transform = Ti.UI.create2DMatrix().translate(0, -next);

	if (delta > 40) {
		$.textAreaContainer.animate({
			curve: 7, // Undocumented (by Apple) iOS7 animation curve
			duration: 300,
			transform: transform
		});
		
	}
	else if (delta > 0) {
		$.textAreaContainer.transform = transform;
		//$.tableView.top = "0dp";
	}

	last = next;
	
	
}




function resizeTypingArea (changeEvent) {
    typingAreaHeight = $.textArea.rect.height,
    length = $.textArea.value.length;
    
    if (typingAreaHeight > maxTypingHeight) {
        /* The area is bigger than the limit, let's resize */
        $.textArea.height = maxTypingHeight;
        /* Keep an eye on the length that trigger this change */
        resizeThreshold = resizeThreshold || length;
    } else if (length < resizeThreshold) {
        /* The area is becoming smaller, let it handle its own size like a grown up */
        $.textArea.setHeight(Ti.UI.SIZE);
    }
}





function textAreaFocus(e)
{
	if(e.source.value == e.source._hintText){
        e.source.value = "";
    }
}

function textAreaBlur(e)
{
	 if(e.source.value==""){
        e.source.value = e.source._hintText;
    }
}




function sendMessage()
{
	//TODO: Check for network
	var text = $.textArea.value;
	if (text.length == 0)
	{
		return;
	}
	
	if (conversation == null || conversation == undefined)
	{
		Alloy.Globals.conversationCenter.createNewConversation(args.partner.objectId, text).then(function(result){
			//console.log(result);
			conversation = result.conversation;	
			appendNewRow(text, "out", true);
			
		}, handleError);
	}
	else
	{
		Alloy.Globals.conversationCenter.addMessageToConversation(conversation.objectId, text).then(function(result){
			console.log(result);
			appendNewRow(text, "out", true);
			
			
		}, handleError);
	}
	
	
	function handleError(error)
	{
		console.log("Error adding message: " + JSON.stringify(error));
	}
}







function adjustTableViewHeight()
{
	//$.tableView.height = $.tableView.data[0].rows.length * $.tableView.data[0].rows[0].size.height;
}

replacePreviousView();

function replacePreviousView()
{
	var count = Alloy.Globals.pageFlow.countPages();
	console.log("Page count is currently");
	console.log(count);
}



function appendNewRow(text, style, animate)
{
	var rowCtrl  = null;
	if (style == "out")
	{
		rowCtrl = Alloy.createController("messagecell/outgoingTableViewRow", {text: text});
		var row = rowCtrl.getView();
		
		$.tableView.appendRow(row, {
			animated: true,
			animationStyle: Titanium.UI.iPhone.RowAnimationStyle.RIGHT
		});	
	}
	
}


function scrollToBottom()
{
    var section =  $.tableView.sections[0];
    if (section)
    {
    	var rows = section.rowCount;
	    if (rows > 0)
	    {
	    	$.tableView.scrollToIndex(rows-1);
	
	    }
    }
    
}


