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


//$.backgroundImageView.image = args.image;
//$.imageView.image = args.image;
//$.nickNameLabel = args.name;
$.backgroundView.add(proxy2);


$.logoutButton.addEventListener("click", function(){
	//$.navWindow.close({animated: false});
	//Alloy.Globals.pageFlow.back();
	args.didClickLogout();
});
