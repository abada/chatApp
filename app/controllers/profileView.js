var args = arguments[0] || {};





var UIBlurView = require('com.artanisdesign.uivisualeffect');
var proxy2 = UIBlurView.createView({
    effect : "light", //extralight, dark
    width : Ti.UI.FILL,
    height :Ti.UI.FILL ,
    top : 0,
    left : 0,
    zIndex: 1
});

$.backgroundImageView.image = args.image;
$.imageView.image = args.image;
$.nickNameLabel = args.name;
$.backgroundView.add(proxy2);


setNavButtonListeners();
function setNavButtonListeners()
{
	if(args.didSetOnLeftClick)
	{
		args.onLeftClick(function(){
			Alloy.Globals.pageFlow.back();
		});
	}
}


$.messageButton.addEventListener("click", showMessageView);


function showMessageView()
{
	var check = Alloy.Globals.conversationCenter.isNewConversation(args.user.objectId);
	
	Alloy.Globals.openWindow({
		name: "messages",
		arguments: {
			partner: args.user,
			conversation: check.conversation
		},
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
