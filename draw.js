//MAIN DRAW FUNCTION//
draw = function() {
//record
	if (isRecord) {
		runRecord();
		//stop
		if (time-videoTime>videoLength)
			stopRecord();
	}
//prepare
	ctx.resetTransform();
	ctx.fillStyle = "#000000";
	ctx.fillStyle = "#ffffff";
	ctx.clearRect(0, 0, res.x, res.y);
//transform
	ctx.transform(
		scale,
		skewY,
		skewX,
		scale,
		(translateX+2.0-scale*2-skewX)*res.x/4,
		(translateY+0.5-scale/2-skewY)*res.y
	);
	// ctx.imageSmoothingEnabled = false;
	// ctx.imageSmoothingQuality = "low";
	// ctx.globalAlpha = 1;
//time
	secs += step/Math.PI*2;
	time += step;
//ids
	j_id=[];
	j_depth=0;

//json setup
	getId();
	
	if (json.includes("Time") || json.includes("Secs")){} else
		isStop = true;

	var data = JSON.parse(json);

//main
	move(res.x/2, res.y/2, function(){
		arrParse(data);
	});
//glow
	if (glowR>0) {
		glow.style.display = 'block';
		getGlow(canvas,glowR,glowC,glowD,glowQ,glowB);
	} else
		glow.style.display = 'none';

	if (!isStop)
		window.requestAnimationFrame(draw);

	// ctx.putImageData(ctx.getImageData(0, 0, canvas.width, canvas.height), res.x, res.y);
	// console.log(ctx.getImageData(0, 0, canvas.width, canvas.height));

	// ctx.drawImage(ctx.getImageData(0, 0, canvas.width, canvas.height).data,0,0);
}

function controlsUpdate(el) {
	if (el) {
		const v = Number(el.value);
		switch (el.id) {
		case 'speed':
			step = el.value/10;
			if (isStop && step!=0) {
				isStop = false;
				window.requestAnimationFrame(draw);
			}
			if (!isStop && step==0)
				isStop = true;		
			break;
		case 'translateX':	translateX = v; break;
		case 'translateY':	translateY = v; break;
		case 'skewX':		skewX = v; 		break;
		case 'skewY':		skewY = v; 		break;
		case 'scale':		scale = v; 		break;
		case 'glowR':		glowR = v; 		break;
		case 'glowC':		glowC = v; 		break;
		case 'glowD':		glowD = v; 		break;
		case 'glowQ':		glowQ = v; 		break;
		case 'glowB':		glowB = v; 		break;
		case 'fRate': document.getElementById("fRateL").innerText = "FrmRate "+v;
							fRate = v;		break;
		}

		if (isStop)
			window.requestAnimationFrame(draw);
	} else {
		controlsUpdate(document.getElementById("speed"));
		controlsUpdate(document.getElementById("translateX"));
		controlsUpdate(document.getElementById("translateY"));
		controlsUpdate(document.getElementById("skewX"));
		controlsUpdate(document.getElementById("skewY"));
		controlsUpdate(document.getElementById("scale"));
		controlsUpdate(document.getElementById("glowR"));
		controlsUpdate(document.getElementById("glowC"));
		controlsUpdate(document.getElementById("glowD"));
		controlsUpdate(document.getElementById("glowQ"));
		controlsUpdate(document.getElementById("glowB"));
		controlsUpdate(document.getElementById("fRate"));
	}
}
controlsUpdate();window.requestAnimationFrame(draw);
imp();