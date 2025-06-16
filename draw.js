//MAIN DRAW FUNCTION//
draw = function() {
//back images
	if (imagesBack.length > 0) {
		move(res.x/2, res.y/2, function(){
			for (const img of imagesBack) {
				image(
					img.x,
					img.y,
					img.w,
					img.h,
					img.src.src,
					true,
					true,
					ctxBack
				);
			}
		}, ctxBack);
		imagesBack = [];
	}
//front images
	if (imagesFront.length > 0) {
		move(res.x/2, res.y/2, function(){
			for (const img of imagesFront) {
				image(
					img.x,
					img.y,
					img.w,
					img.h,
					img.src.src,
					true,
					true,
					ctxFront
				);
			}
		}, ctxFront);
		imagesFront = [];
	}
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
		scale,skewY,skewX,scale,
		(translateX+2.0-scale*2-skewX)*res.x/4,
		(translateY+0.5-scale/2-skewY)*res.y
	);
	
//time
	secs += step/Math.PI*2;
	time += step;
//ids
	j_id=[];
	j_depth=0;

//json setup
	getId();
	
	// isStop = !(json.includes("Time") || json.includes("Secs"));

	var data = JSON.parse(json);

//main
	move(res.x/2, res.y/2, function(){
		arrParse(data);
	});
//glow
	if (glowR>0
	 || imagesBack.length > 0
	 || imagesFront.length > 0) {
		glow.style.display = 'block';
		canvas.style.display = 'none';
		getGlow(canvas,glowR,glowC,glowD,glowQ,glowB,cnvBack,cnvFront);
	} else {
		glow.style.display = 'none';
		canvas.style.display = 'block';
	}
	if (isPrint)
		runPrint();

	ctxBack.resetTransform();
	ctxFront.resetTransform();
	ctxBack.clearRect( 0, 0, res.x, res.y*2);
	ctxFront.clearRect(0, 0, res.x, res.y*2);
	ctxBack.transform(
		scale,skewY,skewX,scale,
		(translateX+2.0-scale*2-skewX)*res.x/4,
		(translateY+0.5-scale/2-skewY)*res.y
	);
	ctxFront.transform(
		scale,skewY,skewX,scale,
		(translateX+2.0-scale*2-skewX)*res.x/4,
		(translateY+0.5-scale/2-skewY)*res.y
	);

	console.log(isStop);

	if (!isStop)
		window.requestAnimationFrame(draw);

	// ctx.putImageData(ctx.getImageData(0, 0, canvas.width, canvas.height), res.x, res.y);
	// console.log(ctx.getImageData(0, 0, canvas.width, canvas.height));

	// ctx.drawImage(ctx.getImageData(0, 0, canvas.width, canvas.height).data,0,0);
}

function controlsUpdate(el) {
	const v = Number(el.value);
	switch (el.id) {
	case 'speed':
		step = el.value/10;
		if (isStop && step!=0 && isTime) {
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

	// if (isStop)
	// 	window.requestAnimationFrame(draw);
}
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
window.requestAnimationFrame(draw);
imp();


document.addEventListener("wheel", (event) => {
	if(event.target != document.getElementById('interface')
	&& event.target != document.getElementById('glow')) return;

	event.preventDefault();
	if(event.ctrlKey) {
		scale += event.deltaX/res.x + event.deltaY/res.y/3;
		document.getElementById("scale").value = scale;
	} else {
		translateX += event.deltaX/res.x;
		translateY -= event.deltaY/res.y/3;

		document.getElementById("translateX").value = translateX;
		document.getElementById("translateY").value = translateY;
	}


	window.requestAnimationFrame(draw);
});