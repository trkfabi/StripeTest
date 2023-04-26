const Stripe = require('com.inzori.stripe');

Stripe.addEventListener('stripe:verification_result', _e => {
	console.warn('En la app: ' + JSON.stringify(_e));

});

function doClick(e) {
	if (checkCameraPermission()) {
		getKeys({
			url: 'https://inzori.glitch.me/create-verification-session',
			onComplete: function (e) {
				console.warn(JSON.stringify(e));
				if (e.success) {
					Stripe.startVerification({
						verificationSessionId: e.data.id,
						ephemeralKeySecret: e.data.ephemeral_key_secret,
						logoUrl: "http://inzori.com/fluidlogo.png",
						onComplete: _result => {
							if (_result.success) {
								if (_result.type === 'log') {
									console.warn('Stripe log: ' + _result.message);
								}
								if (_result.type === 'status') {
									console.warn('Stripe status: ' + _result.status + ' - ' + _result.message);
								}
							} else{
								alert(_result.message);
							}
			
						}
					});
				} else {
					alert('Could not initialize Stripe');
				}
			}
		});
	}

}

function getKeys(params) {
	params = params || {};
    const url = params.url || '';
	const callback = params.onComplete || null;
    var client = Ti.Network.createHTTPClient({
        // function called when the response data is available
        onload : function(e) {
            //console.warn("Received text: " + JSON.stringify(e));
			callback && callback({
				success: true,
				data: JSON.parse(this.responseText)
			});
            
        },
        // function called when an error occurs, including a timeout
        onerror : function(e) {
            //console.error(JSON.stringify(e));
			callback && callback(e);
            
        },
        timeout : 30000  // in milliseconds
    });
    // Prepare the connection.
	
    client.open("POST", url);
	client.setRequestHeader('Content-Type', 'application/json');
    // Send the request.
    client.send(JSON.stringify({
		user_id: 2830,
		user_email: 'test2830@mailinator.com'
	}));
}

function checkCameraPermission() {
	if (OS_IOS) {
		if (Ti.Media.hasCameraPermissions() && Ti.Media.hasAudioRecorderPermissions()) {
			return true;
		} else {
			Ti.Media.requestCameraPermissions(function (event) {
				if (!event.success) {
					return false;
				}
				Ti.Media.requestAudioRecorderPermissions(function (event2) {
					if (!event2.success) {
						return false;
					}
					return true;
				});
			});
		}
	} else {
		if (!Ti.Media.hasCameraPermissions()) {
			Ti.Media.requestCameraPermissions(function (e) {
				if (e.success) {
					return checkStoragePermissions();
				} else {
					alert('No camera access allowed');
					return false;
				}
			});

		} else {
			return checkStoragePermissions();
		}

	}
}

function checkStoragePermissions() {

	if (!Ti.Android.hasPermission("android.permission.WRITE_EXTERNAL_STORAGE")) {            
		Ti.Android.requestPermissions("android.permission.WRITE_EXTERNAL_STORAGE", function (e) {
			if (e.success) {
				return true;
			} else {
				return false;
			}
		});
	} else {
		return true;
	}
}

$.win.addEventListener('open', checkCameraPermission);