var args = arguments[0] || {};
var window;
var mainView;
var tableView;
var textArea;
var textAreaContainer;
var sendButton;
var resizeThreshold = 0;
initialize();
function initialize()
{
	window = Ti.UI.createWindow({
		orientationModes: [
			Ti.UI.PORTRAIT,
			Ti.UI.LANDSCAPE_LEFT,
			Ti.UI.LANDSCAPE_RIGHT
		],
		backgroundColor: '#fff',
	
		// How much space must be took on top of the keyboard
		keyboardTriggerOffset: 0,
		// This activates the panning feature
		keyboardPanning: true
	});
	
	
	
	window.addEventListener('close', function (event) {
	// Very important! Releases what needs to be released
		event.source.keyboardPanning = false;
	});
	
	
	mainView = Ti.UI.createView();
	var mainViewStyle = $.createStyle({
		classes: ["mainView"]
	});
	mainView.applyProperties(mainViewStyle);
	
	tableView = Ti.UI.createTableView();
	var tableViewStyle = $.createStyle({
		classes: ["messagesTableView"]
	});
	tableView.applyProperties(tableViewStyle);
	mainView.add(tableView);
	
	textArea = Ti.UI.createTextArea({
		top: 5,
		right: 80,
		bottom: 5,
		left: 5,
		scrollable: false,
		suppressReturn: false,
		height: Ti.UI.SIZE,
		backgroundColor: '#fff',
		borderRadius: 3,
		borderWidth: '1px',
		borderColor: '#BBB'
	});
	
	sendButton = Ti.UI.createButton({
		title: 'Send',
		width: 70,
		right: 5
	});
	
	textAreaContainer = Ti.UI.createView({
		height: Ti.UI.SIZE,
		right: 0,
		bottom: 0, // This value will not be updated!
		left: 0,
		backgroundColor: '#eee'
	});
	
	textAreaContainer.add(textArea);
	textAreaContainer.add(sendButton);
	window.add(mainView);
	window.add(textAreaContainer);
	
	// Automatically add the textarea as a locked view
	window.lockedViews = [ textAreaContainer, mainView ];
	textAreaContainer.addEventListener('postlayout', function (event) {
		window.keyboardTriggerOffset = event.source.rect.height;
		tableView.bottom = event.source.rect.height;
	});
	
	// Just an example programmatic dismissal.
	
	window.open();
}


textArea.addEventListener("change", resizeTypingArea);

var maxTypingHeight = 120;
if (maxTypingHeight && Math.abs(+maxTypingHeight) < 1) {
    maxTypingHeight = Ti.Platform.displayCaps.platformHeight * +maxTypingHeight;
}

function resizeTypingArea (changeEvent) {
    typingAreaHeight = textArea.rect.height,
    length = textArea.value.length;
    
    if (typingAreaHeight > maxTypingHeight) {
        /* The area is bigger than the limit, let's resize */
        textArea.height = maxTypingHeight;
        /* Keep an eye on the length that trigger this change */
        resizeThreshold = resizeThreshold || length;
    } else if (length < resizeThreshold) {
        /* The area is becoming smaller, let it handle its own size like a grown up */
        textArea.setHeight(Ti.UI.SIZE);
    }
}



textArea.value = "Send Message...";
textArea._hintText = textArea.value;

textArea.addEventListener('focus',function(e){
    if(e.source.value == e.source._hintText){
        e.source.value = "";
    }
});

textArea.addEventListener('blur',function(e){
    if(e.source.value==""){
        e.source.value = e.source._hintText;
    }
});


var data = [{style: "incoming", text: "This is a sample message"},
            {style: "outgoing", text: "This is a really long text that is supposed to cover a lot of space"},
            {style: "incoming", text: "O boy how you dey now"}, {style: "outgoing", text: "Chale I dey manage my guy "},  {style: "incoming", text: "O boy how you dey now"}, {style: "outgoing", text: "Chale I dey manage my guy "},  {style: "incoming", text: "O boy how you dey now"}, {style: "outgoing", text: "Chale I dey manage my guy "}];
var tableData = [];


for (var index in data)
{
    var messageData = data[index];
    var row;
    if (messageData.style == "incoming")
    {
  	  	  row = Alloy.createController("incomingTableViewRow", {text: messageData.text}).getView();
    }
    
    else
    {
  	  	  row = Alloy.createController("outgoingTableViewRow", {text: messageData.text}).getView();
        
    }
    
    tableData.push(row);
}

tableView.data = tableData;
scrollToBottom();


function scrollToBottom()
{
    var section =  tableView.sections[0];
    var rows = section.rowCount;
    if (rows > 0)
    {
    	tableView.scrollToIndex(rows-1);

    }
}


// The textarea will change in size, because it’s multi-line.
// I need to update the correct offset for the panning.
