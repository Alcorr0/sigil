function controlsUpdate(el) {
	switch (el.id) {
	case 'speed':
		step = el.value/10;
		if (isStop && step!=0) {
			isStop = false;
			window.requestAnimationFrame(draw);
			requestAnimationFrame(animate);
		}
		if (!isStop && step==0)
			isStop = true;		
		break;
	case 'translateX':
		translateX = el.value;
		break;
	case 'translateY':
		translateY = el.value;
		break;
	case 'scale':
		scale = el.value;
		break;
	}
	if (isStop)
		window.requestAnimationFrame(draw);
}

//MAIN DRAW FUNCTION//
draw = function() {
//prepare
	
	ctx.resetTransform();
	ctx.fillStyle = "#000000";
	ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
	ctx.fillStyle = "#ffffff";
	// ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
//transform
	ctx.transform(
		scale,
		translateY,
		translateX,
		scale,
		(2-scale*2-translateX)*window.innerWidth/4,
		(0.5-scale/2-translateY)*window.innerHeight  
	);


//time
	secs += step/Math.PI*2;
	time += step;


//json setup
	getId();
	
	if (json.includes("time") || json.includes("secs")){} else
		isStop = true;

	var data = JSON.parse(json);

//record
	if (isRecord) {
		runRecord();
		//stop
		if (time-videoTime>videoLength)
			stopRecord();
	}
//main
	move(window.innerWidth/2, window.innerHeight/2, function(){
		arrParse(data);
	});

	if (!isStop)
		window.requestAnimationFrame(draw);
}

// controlsUpdate();
window.requestAnimationFrame(draw);
imp();