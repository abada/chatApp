var args = arguments[0] || {};
var image = args.imageToCrop;
$.imageView.image = image;

var view = Ti.UI.createView();
$.rootWindow.add(view);

$.leftNavButton.addEventListener("click", function(){
	$.navWindow.close();
});


var olt = Titanium.UI.create3DMatrix();
var curX, curY;
 
$.areaToCrop.addEventListener('touchstart', function(e) {
    curX = e.x;
    curY = e.y;
   

});


$.areaToCrop.addEventListener('touchmove', function(e) {
	var point = e.source.convertPointToView({x: e.x, y:e.y}, view);
	console.log("Point is " + JSON.stringify(point));
	
    var deltaX = e.x - curX, deltaY = e.y - curY;
    olt = olt.translate(deltaX, deltaY, 0);
    $.areaToCrop.animate({
        transform : olt,
        duration : 100
    });
});
 

$.imageView.addEventListener("postlayout", function(e){
	console.log(e);
	console.log("Rect is " + JSON.stringify($.imageView.rect));
});
