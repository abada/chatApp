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
}
