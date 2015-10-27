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

$.backgroundImageView.image = args.image;
$.imageView.image = args.image;
$.nickNameLabel = args.name;
$.backgroundView.add(proxy2);
