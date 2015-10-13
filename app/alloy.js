Alloy.Globals.Device = {
	version : Ti.Platform.version,
	width : Ti.Platform.displayCaps.platformWidth,
	height : Ti.Platform.displayCaps.platformHeight,
	dpi : Ti.Platform.displayCaps.dpi,
	defaultWindowHeight: Ti.Platform.displayCaps.platformHeight - 80
};
var heightPadding = 37;
Alloy.Globals.itemScreenWidth = (Alloy.Globals.Device.width/3) - 15;
Alloy.Globals.itemScreenHeight = (Alloy.Globals.itemScreenWidth) + heightPadding;
Alloy.Globals.itemImageSize = Math.floor(Alloy.Globals.itemScreenWidth - 10);
Alloy.Globals.itemImageRadius = Math.floor(Alloy.Globals.itemImageSize/2);
Alloy.Globals.itemLabelHeight = 20;
console.log("Size is " + Alloy.Globals.itemImageSize);
console.log("Radius is " + Alloy.Globals.itemImageRadius);
