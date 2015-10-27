var args = arguments[0] || {};
$.button.title = args.buttonTitle;

exports.setOnClick = function(listener)
{
	$.button.addEventListener("click", listener);
	
};

