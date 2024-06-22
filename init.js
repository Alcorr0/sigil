//SETUP//
//canvas setup
const canvas = document.getElementById("canvas");
const glow   = document.getElementById("glow");
const ctx   = canvas.getContext("2d");

ctx.strokeStyle = "#ffffff";
ctx.fillStyle = "#ffffff";
ctx.lineWidth = 2;

//on resize
var res;
function fixRes() {
	res = {
		x:window.innerWidth,
		y:window.innerHeight
	};
	canvas.width  = res.x;
	canvas.height = res.y;

	ctx.strokeStyle = "#ffffff";
	ctx.fillStyle = "#ffffff";
	ctx.lineWidth = 2;

	if (isStop)
		window.requestAnimationFrame(draw);

}
window.addEventListener('resize', fixRes, true);
fixRes();

var secs = 0;
var time = 0;
var step = 0.02;
var translateX = 0;
var translateY = 0;
var skewX = 0;
var skewY = 0;
var scale = 1;
var glowR = 0;
var glowC = 0;

var isStop = false;
var draw;

//texts
var greekU = "ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ";
var greekD = "αβγδεζηθικλμνξοπρστυφχψω";

//gpu
function initGPU(args) {
	try {
		return new window.GPU.GPU(args);
	} catch (e) {
		return new GPU(args);
	}
}
const gpu = initGPU({
	canvas: glow,
	mode: 'gpu'
	// mode: 'dev'
});
const getGlow = gpu.createKernel(
	function(frame,radius,color,directions,quality) {
		const TPI = Math.PI*2;
		const k = quality * directions - 15;
		const x = this.thread.x,
			  y = this.thread.y,
			  w = this.output.x,
			  h = this.output.y;
		var Color = frame[y][x];
		const prev = Color;
		for(var d=0; d<TPI; d+=TPI/directions)
			for(var i=1/quality; i<=1; i+=1/quality)
			{
				var nx = x+cos(d)*radius*i; if(nx<0)nx=0; else if(nx>=w)nx=w-1
				var ny = y+sin(d)*radius*i; if(ny<0)ny=0; else if(ny>=h)ny=h-1
				const col = frame[ny][nx];
				// *2-1
				Color.r += col.r;
				Color.g += col.g;
				Color.b += col.b;
				Color.a += col.a;
			}
		Color.r /= k;
		Color.g /= k;
		Color.b /= k;
		Color.a /= k;

		if(color>0) {
			var max = Math.max(Color.r, Math.max(Color.g, Color.b)),
				min = Math.min(Color.r, Math.min(Color.g, Color.b));
  			var d = max - min;
  			var H = 0,
  				S = 1,//(max == 0) ? 0 : d / max,
  				V = max;
			if (max != min) {
				var o = 0; if(Color.g<Color.b) o = 6;
				if(max==Color.r) H = (Color.g - Color.b) / d + 6;
				if(max==Color.g) H = (Color.b - Color.r) / d + 2;
				if(max==Color.b) H = (Color.r - Color.g) / d + 4;
				H /= 6;
			}

			H += color;

			var i = Math.floor(H * 6);
			var f = H * 6 - i;
			var p = V * (1 - S);
			var q = V * (1 - S * f);
			var t = V * (1 - S * (1 - f));
			i = i%6;
			     if(i==0){Color.r = V; Color.g = t; Color.b = p;}
			else if(i==1){Color.r = q; Color.g = V; Color.b = p;}
			else if(i==2){Color.r = p; Color.g = V; Color.b = t;}
			else if(i==3){Color.r = p; Color.g = q; Color.b = V;}
			else if(i==4){Color.r = t; Color.g = p; Color.b = V;}
			else         {Color.r = V; Color.g = p; Color.b = q;}
			
		}

		this.color(
			/*prev.r+*/Color.r,
			/*prev.g+*/Color.g,
			/*prev.b+*/Color.b,
			/*prev.a+*/Color.a
		);
	}, {
		output: [res.x,res.y],
		graphical: true
	}
);

//
function rgbToHsv(r, g, b) {
  r /= 255, g /= 255, b /= 255;

  var max = Math.max(r, g, b), min = Math.min(r, g, b);
  var h, s, v = max;

  var d = max - min;
  s = max == 0 ? 0 : d / max;

  if (max == min) {
    h = 0; // achromatic
  } else {
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }

    h /= 6;
  }

  return [ h, s, v ];
}
function hsvToRgb(h, s, v) {
  var r, g, b;

  var i = Math.floor(h * 6);
  var f = h * 6 - i;
  var p = v * (1 - s);
  var q = v * (1 - f * s);
  var t = v * (1 - (1 - f) * s);

  switch (i % 6) {
    case 0: r = v, g = t, b = p; break;
    case 1: r = q, g = v, b = p; break;
    case 2: r = p, g = v, b = t; break;
    case 3: r = p, g = q, b = v; break;
    case 4: r = t, g = p, b = v; break;
    case 5: r = v, g = p, b = q; break;
  }

  return [ r * 255, g * 255, b * 255 ];
}

//random
function getRand(a) {
	return function() {
		var t = a += 0x6D2B79F5;
		t = Math.imul(t ^ t >>> 15, t | 1);
		t ^= t + Math.imul(t ^ t >>> 7, t | 61);
		return ((t ^ t >>> 14) >>> 0) / 4294967296;
	}
}

var j_id=[];
var j_depth=0;
function getId(val) {
	if(val !== undefined) {
		j_id[j_depth] = val;
		return val;
	}
	if (j_id[j_depth] === undefined)
		j_id[j_depth] = 0;
	// console.log(j_depth,j_id[j_depth]);
	return j_id[j_depth]++;
}

//①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮⑯⑰⑱⑲⑳
//▖▗▘▙▚▛▜▝▞▟■


function parse(str) {
	str = str.replaceAll("Pi",Math.PI);
	str = str.replaceAll("nsin(","0.5+0.5*sin(");
	str = str.replaceAll("ncos(","0.5+0.5*cos(");
	str = str.replaceAll("sin(","Math.sin(");
	str = str.replaceAll("cos(","Math.cos(");
	str = str.replaceAll("floor(","Math.floor(");
	str = str.replaceAll("round(","Math.round(");
	str = str.replaceAll("ceil(","Math.ceil(");
	str = str.replaceAll("Time",time);
	str = str.replaceAll("Secs",secs);
	str = str.replaceAll("I","getId()");
	return eval(str);
}