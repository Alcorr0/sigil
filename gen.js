
//generator
function getGraph() {
	var graph = [];

	/*
	 O O
	O O O
	 O O
	*/

	//set nodes
	var positions = [];
	for (var i=0,j=0; i<7; i++) {
		if(i!=6 && Math.random()>0.3) continue;
		positions.push(i);
		const R = 500,
			  dmax = 200,
			  Rd = -dmax+Math.random()*dmax/2,
			  a = i+Math.PI/3;
		var x = Math.floor(Math.cos(a)*(R+Rd)),
			y = Math.floor(Math.sin(a)*(R+Rd));
		if(i==6) x=y=0;
		const rmin = 50,
			  rmax = 150,
			  r = Math.round(rmin+Math.random()*(rmax-rmin));

		graph[j++] = {
			go:[],
			x:x,
			y:y,
			r:r
		};
	}

	//set lines
	const last = graph.length-1;
	if(last==1)
		graph[0].go=[1];
	else if(graph.length!=1)
		for (var i=0; i<last; i++) {
			var go = [];

			//around
			const t = i<last-1? i+1: 0;
			if(t!=0||last!=2)
				if(Math.abs(positions[i]-positions[t])!=3)
					go.push(t);
			//to center
			if(Math.random()>0)
				go.push(last);

			graph[i].go = go;
		}
	return graph;
}
function graphLines(a, b) {
	const connect_type = Math.random()>0.5;
	const dx = b.x-a.x;
	const dy = b.y-a.y;
	const an = Math.atan2(dy,dx);
	const l  = Math.sqrt(dx*dx+dy*dy);
	const len = l-a.r-b.r;
	const s  = Math.floor(len/20);

	const lines = [
		//lines
		[{"type":"Width","width":"5","children":[{"type":"Line","x":"0","y":"0","dx":len,"dy":"0"}]},{"type":"Line","x":"10","y":"10*sin(time+Id(95))","dx":len-20,"dy":"0"},{"type":"Line","x":"10","y":"-10*sin(time+Id(94))","dx":len-20,"dy":"0"}],
		//ladder
		[{"type":"Line","x":"0","y":"10","dx":len,"dy":"0"},{"type":"Line","x":"0","y":"-10","dx":len,"dy":"0"},{"type":"Rotate","angle":"PI/2","children":[{"type":"To Line","length":s*20,"segments":s,"offset":"1","angle":"0","is alternately":false,"children":[{"type":"Line","x":"-10","y":-(len-s*20)/2,"dx":"20","dy":"0"}]}]},{"type":"Move","x":10+(len-s*20)/2,"y":"0","children":[{"type":"Random Text","width":"20","text":"αβγδεζηθικλμνξοπρστυφχψωΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ","segments":s,"seed":"secs+Id(99)","angle":"PI/2"}]}],
		//chain
		[{"type":"Rotate","angle":"PI/2","children":[{"type":"Move","x":"0","y":"-10","children":[{"type":"To Line","length":len,"segments":s,"offset":"0","angle":"0","is alternately":false,"children":[{"type":"Circle","radius":"10","angle A":"0","angle B":"PI*2"},{"type":"Filled Circle","radius":"4*(nsin(time+Id(98)))","angle A":"0","angle B":"PI*2"}]}]}]}],
		//dna
		[{"type":"Width","width":"5","children":[{"type":"Line","x":"0","y":"0","dx":len,"dy":"0"}]},{"type":"Rotate","angle":"PI/2","children":[{"type":"To Line","length":len,"segments":s,"offset":"0","angle":"0","is alternately":false,"children":[{"type":"Move","x":"10*sin(time+Id(97)/2)","y":"-10","children":[{"type":"Filled Circle","radius":"4","angle A":"0","angle B":"PI*2"}]},{"type":"Move","x":"-10*sin(time+Id(96)/2)","y":"-10","children":[{"type":"Filled Circle","radius":"4","angle A":"0","angle B":"PI*2"}]}]}]}],
		//dna lines
		[{"type":"Rotate","angle":"PI/2","children":[{"type":"To Line","length":len,"segments":s*2,"offset":"0","angle":"0","is alternately":false,"children":[{"type":"Line","x":"-10*sin(time+Id(90)/2)","y":"0","dx":"20*sin(time+Id(89)/2)","dy":"0"}]}]}]
	];
	var line = lines[Math.floor(Math.random()*lines.length)];
	
	const con_an = "PI/"+(4+Math.floor(Math.random()*8));
	return {"type":"Rotate","angle":an,"children":[
		{"type":"Move","x":a.r,"y":"0","children":line},
		{"type":"Circle","radius":a.r,"angle A":"-"+con_an,"angle B":con_an},
		{"type":"Move","x":l,"y":"0","children":[{"type":"Circle","radius":b.r,"angle A":"PI-"+con_an,"angle B":"PI+"+con_an}]}
	]};
}
function microCircle(d) {
	const circles = [
		{"type":"Random Text","width":d,"text":"ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ","segments":"1","seed":"secs*Id(91)","angle":"0"},
		{"type":"Rotate","angle":Math.floor(Math.random()*4-2),"children":[{"type":"Polygon","radius":d,"segments":Math.floor(3+Math.random()*3),"max":"-1"}]}
	];
	return circles[Math.floor(circles.length*Math.random())];
}
function circlesPattern(ra,rb,d,c) {
	const segm = Math.floor(2+Math.random()*8);
	const segmt = Math.floor(1+Math.random()*7);
	var z = [];
	if(segm<5)
		z = {"type":"Rotate","angle":"time*"+(Math.random()*8-4),"children":[
			{"type":"To Circle","radius":"0","segments":segmt,"angle A":"time*"+(Math.random()*4-2),"angle B":"PI*2","is alternately":false,"children":[
				{"type":"Circle","radius":c,"angle A":"0","angle B":"PI/2/"+segmt}
			]},
			{"type":"To Circle","radius":c,"segments":segm,"angle A":"0","angle B":"PI*2","is alternately":false,"children":[
				{"type":"Color RGB","red":"0","green":"0","blue":"0","alpha":"1","children":[
					{"type":"Filled Circle","radius":d/2,"angle A":"0","angle B":"PI*2"}
				]},
				{"type":"Circle","radius":d/2,"angle A":"0","angle B":"PI*2"},
				microCircle(d/2)
			]}
		]};
	else
		z = {"type":"Rotate","angle":"time*"+(Math.random()*8-4),"children":[
			{"type":"To Circle","radius":c,"segments":segm,"angle A":"0","angle B":"PI*2","is alternately":false,"children":[
				{"type":"Color RGB","red":"0","green":"0","blue":"0","alpha":"1","children":[
					{"type":"Filled Circle","radius":d/2,"angle A":"0","angle B":"PI*2"}
				]},
				{"type":"Circle","radius":d/2,"angle A":"0","angle B":"PI*2"},
				microCircle(d/2)
			]}
		]};
	return z;
}
function graphCenter() {
	const rna = -4+Math.random()*8;
	const rnb = Math.ceil(4+Math.random()*4);
	const centers = [
		// цветок
		[
			{"type":"To Circle","radius":"25","segments":Math.floor(4+6*Math.random()),"angle A":"time*"+rna,"angle B":"PI*2","is alternately":false,"children":[{"type":"Circle","radius":"25","angle A":"-PI/2","angle B":"PI/2"}]},
			{"type":"To Circle","radius":"25","segments":Math.floor(4+6*Math.random()),"angle A":"-time*"+rna,"angle B":"PI*2","is alternately":false,"children":[{"type":"Circle","radius":"25","angle A":"PI/2","angle B":"3*PI/2"}]}
		],
		// буква
		[
			{"type":"Circle","radius":50,"angle A":"0","angle B":"PI*2"},
			{"type":"Random Text","width":"40","text":"ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ","segments":"1","seed":"secs*Id(92)","angle":"0"}
		],
		// пульс
		[{"type":"To Circle","radius":"0","segments":rnb,"angle A":"0","angle B":"PI*2","is alternately":false,"children":[{"type":"Polygon","radius":"50*(nsin(time*"+Math.ceil(Math.random()*2)+"+2*PI/"+rnb+"*Id(93)))","segments":"4","max":"-1"}]}]
	];
	return centers[Math.floor(Math.random()*(centers.length))];
	// if (center.constructor === Array)
}
function graphCircle(ra, rb) {
	const d = rb-ra;
	const c = ra+d/2;
	const rna = -4+Math.random()*8;
	const rnb = Math.ceil(4+Math.random()*4);
	const type = rb-ra>20?1:0;
	var circle = [];

	const circles = [
		[//all
			//инверсия лучей
			{"type":"Rotate","angle":"time*"+(Math.random()*8-4),"children":[{"type":"Width","width":d*0.8,"children":[{"type":"Circle","radius":c,"angle A":"0","angle B":"PI*2"}]},{"type":"Color RGB","red":"0","green":"0","blue":"0","alpha":"1","children":[{"type":"Radial Circle","radius A":ra,"radius B":rb,"segments":Math.floor(2+Math.random()*8),"angle A":"0","angle B":"PI*2"}]}]},
			//лучи
			{"type":"Rotate","angle":"time*"+(Math.random()*8-4),"children":[{"type":"Radial Circle","radius A":ra,"radius B":rb,"segments":"64","angle A":"0","angle B":"PI*2"},{"type":"Color RGB","red":"0","green":"0","blue":"0","alpha":"1","children":[{"type":"Radial Circle","radius A":ra,"radius B":rb,"segments":64+Math.round(-5	+Math.random()*10),"angle A":"time/8","angle B":"time/8+PI*2"}]}]},
			//два круга
			{"type":"Width","width":d/4,"children":[{"type":"Circle","radius":ra+d/4,"angle A":"0","angle B":"PI*2"},{"type":"Circle","radius":ra+3*d/4,"angle A":"0","angle B":"PI*2"}]},
			//текст
			{"type":"Rotate","angle":"time*"+(Math.random()*8-4),"children":[{"type":"Random Letters Circle","radius":c,"width":d,"segments":Math.floor(2*Math.PI*c/d),"text":"αβγδεζηθικλμνξοπρστυφχψω ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ","seed":"floor(secs*2-0.5)","angle":"0"}]},
			//кубики
			{"type":"Rotate","angle":"time*"+(Math.random()*8-4),"children":[{"type":"Random Letters Circle","radius":c,"width":d,"segments":Math.floor(2*Math.PI*c/d),"text":"▖▗▘▙▚▛▜▝▞▟■","seed":"Id(87)","angle":"0"}]}
		],
		[//only thick
			//лучи с буквами
			{"type":"Rotate","angle":"time*"+(Math.random()*8-4),"children":[{"type":"Radial Circle","radius A":ra,"radius B":rb,"segments":"16","angle A":"0","angle B":"PI*2"},{"type":"Rotate","angle":"PI/16","children":[{"type":"Random Letters Circle","radius":c,"width":d/2,"segments":"16","text":"αβγδεζηθικλμνξοπρστυφχψω ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ","seed":"floor(secs*2-0.5)","angle":"0"}]}]},
			// цветки
			{"type":"Width","width":"2","children":[{"type":"To Circle","radius":c,"segments":Math.floor(2*Math.PI*c/d),"angle A":"-time*"+rna+"/2","angle B":"PI*2","is alternately":false,"children":[{"type":"Circle","radius":d/2,"angle A":"-PI/2","angle B":"PI/2"}]},{"type":"To Circle","radius":c,"segments":Math.floor(2*Math.PI*c/d),"angle A":"time*"+rna+"/2","angle B":"PI*2","is alternately":false,"children":[{"type":"Circle","radius":d/2,"angle A":"PI/2","angle B":"3*PI/2"}]}]},
			// кольцо с рандомным количеством тонких кругов
			circlesPattern(ra,rb,d,c)
		]
	];
	
	circle.push(circles[type][Math.floor(Math.random()*circles[type].length)]);
	circle.push({"type":"Width","width":"1","children":[{"type":"Circle","radius":ra,"angle A":"0","angle B":"PI*2"}]});
	return circle;
}
function graphCircleBack(r) {
	r *= (0.2+Math.random()*0.8);
	const seg = Math.ceil(2+Math.random()*4);
	const lines = [
		// многоугольники
		[{"type":"Circle","radius":r/2,"angle A":"0","angle B":"PI*2"},{"type":"Rotate","angle":"PI/3","children":[{"type":"Polygon","radius":r/2,"segments":"3","max":"-1"}]},{"type":"Rotate","angle":"-time","children":[{"type":"Polygon","radius":r/2,"segments":"6","max":"-1"}]}],
		// тот треугольник
		[{"type":"Polygon","radius":r/2,"segments":"3","max":"-1"},{"type":"Rotate","angle":"PI/6","children":[{"type":"To Circle","is alternately":false,"radius":"0","segments":"3","angle A":"0","angle B":"PI*2","children":[{"type":"Circle","radius":r/2,"angle A":"0","angle B":"PI/3"}]},{"type":"To Circle","is alternately":false,"radius":r/2,"segments":"3","angle A":"0","angle B":"PI*2","children":[{"type":"Color RGB","red":"0","green":"0","blue":"0","alpha":"1","children":[{"type":"Filled Circle","radius":r/10,"angle A":"0","angle B":"PI*2"}]},{"type":"Circle","radius":r/10,"angle A":"0","angle B":"PI*2"}]}]}],
		// спирали
		[{"type":"To Circle","radius":"0","segments":Math.floor(1+Math.random()*3),"angle A":"0","angle B":"PI*2","is alternately":false,"children":[{"type":"To Line","length":r*1.2,"segments":Math.floor(r/10),"offset":"1","angle":"time*"+Math.random()*2,"is alternately":false,"children":[{"type":"Circle","radius":"5","angle A":"0","angle B":"PI*2"}]}]}],
		// пульс круг
		[{"type":"Circle","radius":r+"+sin(time)*"+r/2,"angle A":"0","angle B":"PI*2"}],
		//экцентрик
		[{"type":"To Circle","radius":"0","segments":seg,"angle A":"0","angle B":"PI*2","is alternately":false,"children":[{"type":"Circle","radius":r+"*(nsin(time+2*PI*Id(88)/"+seg+"))","angle A":"0","angle B":"PI*2"}]}]
	];

	var line = [];
	line = line.concat(lines[Math.floor(Math.random()*lines.length)]);

	return {"type":"Width","width":"1","children":[{"type":"Color RGB","red":"1","green":"1","blue":"1","alpha":"0.5","children":line}]};
}
// function bigBack() {
// 	return {"type":"Width","width":"1","children":[{"type":"Color RGB","red":"1","green":"1","blue":"1","alpha":"0.5","children":line}]};
// }
function generate() {
	var data = [];
	id=0;
	const graph = getGraph();

	//interp graph
	for (var g=0; g<graph.length; g++) {
		var nodes = [];

		//lines
		const go = graph[g].go;
		for (var j=0; j<go.length; j++) {
			nodes.push( graphLines(graph[g], graph[go[j]]) );
		}

		//nodes
		const r = graph[g].r;

		// nodes.concat(graphNodes());

		nodes.push({"type":"Color RGB","red":"0","green":"0","blue":"0","alpha":"0.5","children":[{"type":"Filled Circle","radius":r,"angle A":"0","angle B":"PI*2"}]});
		nodes = nodes.concat(graphCenter());
		if(Math.random()>0.3) nodes.push(graphCircleBack(r));
		var cr = 50;
		while (cr<r) {
			const prev_r = cr;
			cr+=Math.floor(10+Math.random()*r/5)

			if(cr>r) {
				cr=r;
				if(r-prev_r<10) {
					nodes.push({"type":"Circle","radius":r,"angle A":"0","angle B":"PI*2"});
					break;
				}
			}

			nodes = nodes.concat(graphCircle(prev_r, cr));
		}

		data.push({
			"type": "Move",
			"x": graph[g].x,
			"y": graph[g].y,
			"children": nodes
		});
	}
	// if(Math.random()>0.3) nodes.push(bigBack());

	json = JSON.stringify(data, (k,v) => (typeof v === 'object' || typeof v === 'boolean')? v: v.toString());

	exp();
	imp();

	if (isStop) {
		if (json.includes("time") || json.includes("secs"))
			isStop = false;

		window.requestAnimationFrame(draw);
	}
}