//SETUP//
//canvas setup
const canvas = document.getElementById("canvas");
const ctx   = canvas.getContext("2d");
var renderer;

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

	if (renderer) {
		renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);
		renderer.setSize(window.innerWidth, window.innerHeight);
		uniforms.resolution.value.x = window.innerWidth;
		uniforms.resolution.value.y = window.innerHeight;

		tex.dispose();
		tex = new THREE.CanvasTexture(canvas);
		tex.needsUpdate = true;
	}

	if (isStop)
		window.requestAnimationFrame(draw);

	ctx.strokeStyle = "#ffffff";
	ctx.fillStyle = "#ffffff";
	ctx.lineWidth = 2;
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

var isStop = false;
var draw;

//texts
var greekU = "ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ";
var greekD = "αβγδεζηθικλμνξοπρστυφχψω";

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
function getId(n) {
	if (n === undefined) {
		j_id = [];
		return;
	}

	if (j_id[n] === undefined) 
		j_id[n] = 0;
	else
		j_id[n]++;

	return j_id[n];
}

//①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮⑯⑰⑱⑲⑳
//▖▗▘▙▚▛▜▝▞▟■


function parse(str) {
	str = str.replaceAll("PI",Math.PI);
	str = str.replaceAll("nsin(","0.5+0.5*sin(");
	str = str.replaceAll("ncos(","0.5+0.5*cos(");
	str = str.replaceAll("sin(","Math.sin(");
	str = str.replaceAll("cos(","Math.cos(");
	str = str.replaceAll("floor(","Math.floor(");
	str = str.replaceAll("time",time);
	str = str.replaceAll("secs",secs);
	str = str.replaceAll("Id(","getId(");
	return eval(str);
}