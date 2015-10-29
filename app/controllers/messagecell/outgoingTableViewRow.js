var args = arguments[0] || {};

init();

function init()
{
	$.textLabel.text = args.text;
	$.textLabel.addEventListener("postlayout", function constrainSize(){
		$.textLabel.removeEventListener("postlayout", constrainSize);
		if ($.textLabel.rect.width > 230)
		{
			$.textLabel.width = 230;
		}
		if ($.textLabel.rect.height > 36)
		{
			$.imageButton.top = 13;
		}
	});
	//$.viewContainer.left  = Alloy.Globals.Device.width;
}


function animateEntry()
{
	
	var animation = Ti.UI.createAnimation();
	animation.left = 0;
	animation.duration = 3000;
	animation.curve = Titanium.UI.ANIMATION_CURVE_EASE_IN;
	//$.wrapper.animate(animation);
}

exports.animateEntry = animateEntry;
