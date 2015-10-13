var args = arguments[0] || {};
var data = [];
for (var i = 10; i > 0; i--)
{
	var row = Alloy.createController("conversationTableViewRow").getView();
	data.push(row);
}

$.tableView.data = data;

$.backButton.addEventListener("click", function(){
	$.navWindow.close();
});
