
function doClick(e) {
	Alloy.createController('stripeScreen').getView().open();
}

$.index.open();


const onUncaughtException = (e) => {
	let lineSource;
	if (OS_IOS) {
		lineSource = e.stack ? e.stack : e.nativeStack ? e.nativeStack : "";
	} else {
		lineSource = e.lineSource;
	}
	if (lineSource === null) lineSource = "";
	
	const errorData = {
		line: e.line,
		lineOffset: OS_IOS ? e.column : e.lineOffset,
		message: e.message,
		sourceName: OS_IOS ? e.sourceURL : e.sourceName,
		lineSource: lineSource,
	};
	console.error(JSON.stringify(errorData));
}
Ti.App.addEventListener("uncaughtException", onUncaughtException);