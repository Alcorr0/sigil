//record setup
var isRecord = false;
var videoTime = 0;
var videoLength = Math.PI*2;
var videoStream = document.getElementById("canvas").captureStream(30);
var mediaRecorder = new MediaRecorder(videoStream);
var chunks = [];

mediaRecorder.ondataavailable = function(e) {
	chunks.push(e.data);
};
mediaRecorder.onstop = function(e) {
	var blob = new Blob(chunks, { 'type' : 'video/webm' });
	chunks = [];

	//save
	var filename = "video.webm";
	if (window.navigator.msSaveOrOpenBlob) // IE10+
		window.navigator.msSaveOrOpenBlob(blob, filename);
	else { // Others
		var a = document.createElement("a"),
		url = URL.createObjectURL(blob);
		a.href = url;
		a.download = filename;
		document.body.appendChild(a);
		a.click();
		setTimeout(function() {
			document.body.removeChild(a);
			window.URL.revokeObjectURL(url);  
		}, 0); 
	}
};

function startRecord() {
	var t = document.getElementById("time").value;
	t = t.replaceAll("PI","Math.PI");
	videoLength = eval(t);
	videoTime = time;
	isRecord = true;

	mediaRecorder.start();
}
function runRecord() {
	const percent = Math.floor(100*(time-videoTime)/videoLength);
	document.getElementById("record").style.backgroundSize = percent+"%,100%";
}
function stopRecord() {
	isRecord = false;
	mediaRecorder.stop();
	document.getElementById("record").style.backgroundSize = "0%,100%";
}




// var isRecord = false;
// var videoTime = 0;
// var videoLength = Math.PI*2;
// var encoder;
// var rec_ctx;

// function startRecord() {
// 	var t = document.getElementById("time").value;
// 	t = t.replaceAll("PI","Math.PI");
// 	videoLength = eval(t);
// 	videoTime = time;
// 	isRecord = true;
// 	rec_ctx = document.getElementById("canvasShaded").getContext("2d");

// 	encoder = new GIFEncoder();
// 	encoder.setRepeat(0);
// 	encoder.setDelay(0);
// 	encoder.start();
// }
// function runRecord() {
// 	const percent = Math.floor(100*(time-videoTime)/videoLength);
// 	document.getElementById("record").style.backgroundSize = percent+"%,100%";
	
// 	encoder.addFrame(rec_ctx);
// }
// function stopRecord() {
// 	isRecord = false;
// 	document.getElementById("record").style.backgroundSize = "0%,100%";

// 	encoder.finish();
// 	encoder.download("video.gif");
// }