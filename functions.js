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


function variable(name,value) {
	vars.set(name,value);
	// console.log(vars);
	// eval();
}
function condition(expr,func) {
	if (parse(expr))
		func();
}
//space transform
function move(x,y,func,ct=ctx) {
	j_depth++;
	ct.save();
	ct.translate(x,y);

	func();

	ct.restore();
	getId(0);
	j_depth--;
}
function rotate(angle,func) {
	j_depth++;
	ctx.save();
	ctx.rotate(angle);

	func();

	ctx.restore();
	getId(0);
	j_depth--;
}
function transparent(func) {
	j_depth++;
	const c = ctx.fillStyle
	ctx.fillStyle = "#000000ff";
	ctx.globalCompositeOperation = 'destination-out';

	func();

	ctx.globalCompositeOperation = 'source-over';
	ctx.fillStyle = c;
	getId(0);
	j_depth--;
}
function color(color,func) {
	j_depth++;
	var c = ctx.strokeStyle;
	ctx.strokeStyle = color;
	ctx.fillStyle   = color;

	func();

	ctx.strokeStyle = c;
	ctx.fillStyle   = c;
	getId(0);
	j_depth--;
}
function width(width,func) {
	j_depth++;
	var w = ctx.lineWidth;
	ctx.lineWidth = width;

	func();

	ctx.lineWidth = w;
	getId(0);
	j_depth--;
}
function toCircle(r,c,aa=0,ab=Math.PI*2,func) {
	j_depth++;
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
	getId(0);
	j_depth--;
}
function toLine(l,c,o,a,func) {
	j_depth++;
	var stepL=l/c;
	var stepA=a/c;
	for(var i=o; i<c; i++) {
		ctx.save();
		ctx.rotate(Math.PI/2+stepA*i);
		ctx.translate(0,-stepL*i);
		ctx.rotate(-Math.PI/2);
		
		func();

		ctx.restore();
	}
	getId(0);
	j_depth--;
}
function toEllipse(ra,rb,c,aa=0,ab=Math.PI*2,func) {
	j_depth++;
	ab += aa;
	
	if (aa>ab) {
		var b = ab;
		ab = aa;
		aa=b;
	}

	var step = Math.PI*2/c;
	for (var a=aa; a<ab-0.01; a+=step) {
		ctx.save();
		ctx.translate(ra*Math.cos(a),-rb*Math.sin(a));
		// ctx.rotate(a+Math.PI/2);

		func();

		ctx.restore();
	}
	getId(0);
	j_depth--;
}
function fun(a,b,c,func) {
	j_depth++;
	
	if (a>b) {
		var bb = b;
		b = a;
		a=bb;
	}

	var step = (b-a)/c;
	for (var i=a; i<b; i+=step) {
		variable("i",i);
		func();
	}
	getId(0);
	j_depth--;
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
function circle(r, aa=0,ab=Math.PI*2, fill) {
	if(aa>ab) {
		var a = aa;
		aa = ab;
		ab = a;
	}
	ctx.beginPath();
	ctx.arc(0,0, r, aa,ab);
	ctx.stroke();
	ctx.closePath();
	if(fill) ctx.fill();
}
function ellipse(ra,rb, aa=0,ab=Math.PI*2, fill) {
	ctx.beginPath();
	ctx.ellipse(0,0, ra,rb, Math.PI/2, aa,ab);
	ctx.stroke();
	ctx.closePath();
	if(fill) ctx.fill();
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
function lettersEllipse(ra,rb,w,s,d=1,as) {
	var c = s.length*d;
	ctx.font = w+"px serif";
	for (var i=0; i<c; i++) {
		var ch = s.charAt(i%s.length);
		ctx.save();
		const a = i*Math.PI*2/c+as;

		move(ra*Math.cos(a),-rb*Math.sin(a),function(){
			if(ch == ch.toUpperCase())
				ctx.fillText(ch,-w/4-w/16,w/4+w/16)
			else
				ctx.fillText(ch,-w/4,w/4)
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
function polygon(r,c,fill) {
	var step = Math.PI*2/c;

	ctx.moveTo(0,-r);
	ctx.beginPath();
	for (var a=0,i=0; a<=Math.PI*2+step,i++<=c; a+=step) {
		ctx.save();
		ctx.rotate(a);

		ctx.lineTo(0,-r);
		
		ctx.restore();
	}
	ctx.stroke();
	ctx.closePath();
	if(fill) ctx.fill();
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

function image(x,y,w,h,src,is_f,print=false,ct=ctx) {
	if(src!="data:image/png;base64") {
		var img = new Image(w,h);
		img.src = src;
		img.crossOrigin = "anonymous";
		if(print) {
			ct.drawImage(img,x,y,w,h);
		} else {
			imgData = {
				src: img,
				x: x,
				y: y,
				w: w,
				h: h
			};
			if (is_f)
				imagesFront.push(imgData);
			else
				imagesBack.push(imgData);
		}
	}
}

function star(w,ha,hb) {
	move(w,-ha,function(){ellipse(ha,w, aa=0,ab=Math.PI/2, false);});
	move(w,hb,function(){ellipse(hb,w, aa=Math.PI/2,ab=Math.PI, false);});
	move(-w,hb,function(){ellipse(hb,w, aa=Math.PI,ab=3*Math.PI/2, false);});
	move(-w,-ha,function(){ellipse(ha,w, aa=3*Math.PI/2,ab=Math.PI*2, false);});
}



function note(r,p,h,type,dx,dy,ct=ctx) {
	//type	0	1	2	3	4	5	6
	//		o	.	♩	♪	♪♪	♪♪♪	♪♪♪♪	♫	♬	♭♮♯

	move(0,-p,function(){
		rotate(-Math.PI/4,function(){ellipse(r*0.8,r*1.2, 0,Math.PI*2, type>1)});
		if(type>0) {
			line(r,0,0,-h);
			for (var i=0; i<type-2; i++) {
				if(dx==0) {
					move(10,-h+i*h*0.2,function(){
						rotate(Math.PI/2,function(){
							customLine(
								0,h*0.7,10,
								function(i){return -20+Math.sin((i+4)*Math.PI/8)*20},
								function(i){return min(0,-35+Math.pow(i-9,2))},
								true
							)
						})
					})
				} else {
					const f_h = 10;
					move(r,-h+i*f_h*1.5,function(){
						customLine(
							0,dx,2,
							function(i){return i*dy},
							function(i){return i*dy+f_h},
							true
						)
					})
				}
			}
		}
	});

}

function customLine(a,b,c,funA,funB,fill) {
	if (a>b) { var bb=b; b=a; a=bb; }
	var step = (b-a)/c;

	ctx.beginPath();
	ctx.moveTo(0,0);

	for (var i=0; i<=c; i++)
		ctx.lineTo(a+step*i,funA(i));
	for (var i=c; i>=0; i--)
		ctx.lineTo(a+step*i,funB(i));

	ctx.lineTo(0,0);
	ctx.stroke();

	ctx.closePath();
	if(fill) ctx.fill();
}