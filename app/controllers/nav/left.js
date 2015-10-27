var args = arguments[0] || {};
$.button.title = args.buttonTitle;

exports.setOnClick = function(listener)
{
	console.log("clicked");
	$.button.addEventListener("click", listener);
	
};

