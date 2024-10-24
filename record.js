//record setup
var isRecord = false;
var isPrint  = false;
var videoTime = 0;
var videoLength = Math.PI*2;
var chunks = [];

function startRecord() {
	var t = document.getElementById("time").value;
	t = t.replaceAll("Pi","Math.PI");
	videoLength = eval(t);
	videoTime = time;
	isRecord = true;

	chunks = [];
}
function runRecord() {
	const percent = Math.floor(100*(time-videoTime)/videoLength);
	
	getGlow(canvas,glowR,glowC,glowD,glowQ,glowB,cnvBack,cnvFront);
	const pixels = getGlow.getPixels(false);
	chunks.push(pixels);

	document.getElementById("record").style.backgroundSize = percent+"%,100%";
}
function stopRecord() {
	isRecord = false;

	HME.createH264MP4Encoder().then(async encoder => {
		encoder.width = canvas.width;
		encoder.height = canvas.height;
		encoder.frameRate = fRate;
		encoder.initialize();
		
		// console.log(chunks);
		for (let i = 0; i < chunks.length; i++) {
			encoder.addFrameRgba(chunks[i]);
		}

		encoder.finalize();
		const uint8Array = encoder.FS.readFile(encoder.outputFilename);
		var blob = new Blob([uint8Array], { type: "video/mp4" });
		var filename = "video.mp4";
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
		encoder.delete();
	})

	document.getElementById("record").style.backgroundSize = "0%,100%";
}

function getPrint() {
	isPrint = true;
	window.requestAnimationFrame(draw);
}
function runPrint() {
	window.open(glow.toDataURL("image/png"));
	isPrint = false;
}