var args = arguments[0] || {};
var webService = require("webService");
var hasAddedPicture = false;
var cameraEvent = null;
var ImageFactory = require('ti.imagefactory');

initialize();
function initialize()
{
	if (args.fbUserData)
	{
		$.fieldsTable.height = 199;
		$.firstNameField.value = args.fbUserData.firstName;
		$.lastNameField.value = args.fbUserData.lastName;
		$.emailField.value = args.fbUserData.authUserEmail,
		$.passwordField.value = args.fbUserData.authUserId;
		$.profilePictueImageView.image = args.fbUserData.picture;
		$.profilePictueImageView.visible = true;
		$.cameraButton.visible = false;
		hasAddedPicture = true;
	} 
}

$.leftNavButton.addEventListener("click", closeWindow);

function closeWindow()
{
	if (args.cancelCallback)
	{
		args.cancelCallback();
	}
	$.navWindow.close();
}

$.rightNavButton.addEventListener("click", completeSignup);

function completeSignup()
{
	var userData =  {
		firstName : $.firstNameField.value,
		lastName: $.lastNameField.value,
		email: $.emailField.value,
		nickName: $.nickNameField.value,
		password: $.passwordField.value
	};
	
	
	for (var key in userData)
	{
		if (!userData[key])
		{
			alert("Please complete all fields before continuing");
			return;
		}
	}
	

	if(!hasAddedPicture)
	{
		alert("Please add your profile picture to continue");
		return;
	}
	
	if (args.fbUserData)
	{
		userData.image = args.fbUserData.picture;
		userData.authUserId = args.fbUserData.authUserId;
	}
	else
	{
		var compressedImage = ImageFactory.compress(cameraEvent.media, 0.0);
		userData.image = compressedImage;
	}
	
	
	webService.createUser(userData).then(function(result){
		console.log("Result is " + JSON.stringify(result));
	}, function(error){
		console.log(error);
	});
}

$.profilePictueImageView.addEventListener("click", addProfilePicture);
$.cameraButton.addEventListener("click", addProfilePicture);

function addProfilePicture()
{
	Titanium.Media.openPhotoGallery({
		mediaTypes: [Titanium.Media.MEDIA_TYPE_PHOTO],
		autoHide: true,
		allowEditing: true,
		cancel: function(e){
	
		},
		error: function(e){
			
		},
		success: function(e){
			$.profilePictueImageView.image = e.media;
			cameraEvent = null;
			cameraEvent = e;
			$.profilePictueImageView.visible = true;
			$.cameraButton.visible = false;
			hasAddedPicture = true;
		}
	});
}

