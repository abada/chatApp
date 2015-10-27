var args = arguments[0] || {};
var maxTypingHeight = 120;
if (maxTypingHeight && Math.abs(+maxTypingHeight) < 1) {
    maxTypingHeight = Ti.Platform.displayCaps.platformHeight * +maxTypingHeight;
}
var resizeThreshold = 0;
var last = 0;

initialize();
function initialize()
{
	$.messageViewContainer.lockedViews = [ $.textAreaContainer, $.mainView ];
	$.textAreaContainer.addEventListener('postlayout', function (event) {
		$.messageViewContainer.keyboardTriggerOffset = event.source.rect.height;
		$.tableView.bottom = event.source.rect.height;
	});
	
	$.messageViewContainer.addEventListener('keyboardchange', keyboardchange);
	$.textArea.addEventListener("change", resizeTypingArea);
	$.textArea.value = "Send Message...";
	$.textArea._hintText = $.textArea.value;
	$.textArea.addEventListener('focus', textAreaFocus);
	$.textArea.addEventListener('blur', textAreaBlur);


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

function keyboardchange(event)
{
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
  	  	  row = Alloy.createController("messagecell/incomingTableViewRow", {text: messageData.text}).getView();
    }
    
    else
    {
  	  	  row = Alloy.createController("messagecell/outgoingTableViewRow", {text: messageData.text}).getView();
        
    }
    
    tableData.push(row);
}

$.tableView.data = tableData;
scrollToBottom();


function scrollToBottom()
{
    var section =  $.tableView.sections[0];
    var rows = section.rowCount;
    if (rows > 0)
    {
    	$.tableView.scrollToIndex(rows-1);

    }
}

/*
setTimeout(function(){
	$.textArea.focus();
}, 1000);
*/
// The textarea will change in size, because it’s multi-line.
// I need to update the correct offset for the panning.
