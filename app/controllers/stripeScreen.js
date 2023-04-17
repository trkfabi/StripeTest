const Stripe = require('com.inzori.stripe');

function doClick(e) {

	if (checkCameraPermission()) {
		Stripe.initStripe({
			url: 'https://inzori.glitch.me/create-verification-session',
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
	}

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