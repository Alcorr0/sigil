//DRAW FUNCTIONS//
ctx.strokeStyle = "#ffffff";
ctx.fillStyle = "#ffffff";
ctx.lineWidth = 2;

//color spaces
function normalise(n,base=255) {
	return Math.floor(n*base);
}
function hsv2rgb(h,s,v) {
	let f= (n,k=(n+h/60)%6) => v - v*s*Math.max( Math.min(k,4-k,1), 0);
	return [f(5),f(3),f(1)];
}
function componentToHex(c) {
	var hex = c.toString(16);
	return hex.length == 1 ? "0" + hex : hex;
}
function rgbToHex(r, g, b, a) {
	return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b) + componentToHex(a);
}


function condition(expr,func) {
	if (parse(expr))
		func();
}
//space transform
function move(x,y,func) {
	ctx.save();
	ctx.translate(x,y);

	func();

	ctx.restore();
}
function rotate(angle,func) {
	ctx.save();
	ctx.rotate(angle);

	func();

	ctx.restore();
}
function color(color,func) {
	var c = ctx.strokeStyle;

	const clear = color=="#000000ff";
	if(clear) ctx.globalCompositeOperation = 'destination-out';

	ctx.strokeStyle = color;
	ctx.fillStyle   = color;
	func();

	if(clear) ctx.globalCompositeOperation = 'source-over';

	ctx.strokeStyle = c;
	ctx.fillStyle   = c;
}
function width(width,func) {
	var w = ctx.lineWidth;
	ctx.lineWidth = width;

	func();

	ctx.lineWidth = w;
}
function toCircle(r,c,aa=0,ab=Math.PI*2,func) {
	ab += aa;
	
	if (aa>ab) {
		var b = ab;
		ab = aa;
		aa=b;
	}

	var step = Math.PI*2/c;
	for (var a=aa; a<ab-0.01; a+=step) {
		ctx.save();
		ctx.rotate(a+Math.PI/2);
		ctx.translate(0,-r);

		func();

		ctx.restore();
	}
}
function toLine(l,c,o,a,func) {
	var stepL=l/c;
	var stepA=a/c;
	for(var i=o; i<c; i++) {
		ctx.save();
		ctx.rotate(stepA*i);
		ctx.translate(0,-stepL*i);
		func();
		ctx.restore();
	}
}

//single forms 
function text(w,s,a) {
	ctx.font = w+"px serif";
	for(var i=0; i<s.length; i++) {
		var ch = s.charAt(i);
		ctx.save();

		move(i*w,0,function(){
			rotate(a,function(){
				if(ch == ch.toUpperCase())
					ctx.fillText(ch,-w/4-w/16,w/4+w/16)
				else
					ctx.fillText(ch,-w/4,w/4)
			})
		});

		ctx.restore();
	}
}
function randomText(w,s,c,t,a) {
	var rand = getRand(t);
	ctx.font = w+"px serif";
	
	
	for(var i=0; i<c; i++) {
		var n = Math.floor(rand() * s.length);
		var ch = s.charAt(n);
		ctx.save();

		move(i*w,0,function(){
			rotate(a,function(){
				if(ch == ch.toUpperCase())
					ctx.fillText(ch,-w/4-w/16,w/4+w/16)
				else
					ctx.fillText(ch,-w/4,w/4)
			})
		});

		ctx.restore();
	}
}
function number(w,s) {
	ctx.font = w+"px serif";
	ctx.fillText(s,0,0);
}
function line(x,y,dx=0,dy=0) {
	move(x,y,function(){

		ctx.beginPath();
		ctx.moveTo(0,0);

		ctx.lineTo(dx,dy);
		ctx.stroke();
		ctx.closePath();
	});
}

//circles
function circle(r,aa=0,ab=Math.PI*2) {
	ctx.beginPath();
	ctx.arc(0,0, r, aa,ab);
	ctx.stroke();
	ctx.closePath();
}
function filledCircle(r,aa=0,ab=Math.PI*2) {
	ctx.beginPath();
	ctx.arc(0,0, r, aa,ab);
	ctx.fill();
}
function ellipse(ra,rb,a) {
	// console.log(ra,rb,a);
	ctx.beginPath();
	ctx.ellipse(0,0, ra,rb, a+Math.PI/2, 0,Math.PI*2);
	ctx.stroke();
	ctx.closePath();
}
function filledEllipse(ra,rb,a) {
	ctx.beginPath();
	ctx.ellipse(0,0, ra,rb, a, 0,Math.PI*2);
	ctx.fill();
}
function lettersCircle(r,w,s,d=1,a) {
	var c = s.length*d;
	ctx.font = w+"px serif";
	for (var i=0; i<c; i++) {
		var ch = s.charAt(i%s.length);
		ctx.save();
		ctx.rotate(i*Math.PI*2/c);

		move(0,-r,function(){
			rotate(a,function(){
				if(ch == ch.toUpperCase())
					ctx.fillText(ch,-w/4-w/16,w/4+w/16)
				else
					ctx.fillText(ch,-w/4,w/4)
			})
		});

		ctx.restore();
	}
}
function randLettersCircle(r,w,c,s,t,a) {
	const rand = getRand(t);
	const step = Math.PI*2/c;
	ctx.font = w+"px serif";
	for (var i=0;i<c;i++) {
		var an = i*step;
		ctx.save();
		ctx.rotate(an);

		var n = Math.floor(rand() * s.length);
		var ch = s.charAt(n);
		move(0,-r,function(){
			rotate(a,function(){
				if(ch == ch.toUpperCase())
					ctx.fillText(ch,-w/4-w/16,w/4+w/16)
				else
					ctx.fillText(ch,-w/4,w/4)
			})
		});

		ctx.restore();
	}
}
function polygon(r,c,max) {
	var step = Math.PI*2/c;

	ctx.moveTo(0,-r);
	ctx.beginPath();
	for (var a=0,i=0; a<=Math.PI*2+step,i++<=max; a+=step) {
		ctx.save();
		ctx.rotate(a);

		ctx.lineTo(0,-r);
		
		ctx.restore();
	}
	ctx.stroke();
	ctx.closePath();
}
function radialCircle(ra,rb,c,aa=0,ab=Math.PI*2) {
	ab += aa;

	if (aa>ab) {
		var b = ab;
		ab = aa;
		aa=b;
	}
	var step = Math.PI*2/c;
	
	for (var a=aa; a<=ab+step; a+=step) {
		ctx.save();
		ctx.rotate(a+Math.PI/2);

		ctx.beginPath();
		ctx.moveTo(0,-ra);
		ctx.lineTo(0,-rb);
		ctx.stroke();
		ctx.closePath();

		ctx.restore();
	}
}