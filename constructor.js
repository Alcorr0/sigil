var sample_add;
var sample_node;
var sample_property;
const settings = JSON.parse(document.getElementById("settingsData").innerHTML);
var json = "[]";
var id = 0;


function initConstructor() {
	var constructor = document.getElementById("constructor");
	var a = constructor.getElementsByClassName("add")[0];
	var b = constructor.getElementsByClassName("node")[0];
	var c = b.getElementsByClassName("propList")[0].getElementsByClassName("property")[0]
	sample_add     = a;
	sample_node    = b;
	sample_property = c;
	a.remove();
	b.remove();
	c.remove();

	constructor.appendChild(sample_add.cloneNode(true));
}

//tree to json
function compileNode(node) {
	node.parentElement.style.border="solid 2px #000";
	var data = {};

	var type = node.getElementsByClassName("nodeName")[0].innerHTML;
	data.type = type;
	var prop_list = node.getElementsByClassName("propList")[0].children;
	for (const property of prop_list) {
		var p_name  = property.children[0].innerHTML;
		var p_value = property.children[1].value;
		if (p_value == "on") p_value = property.children[1].checked;

		data[p_name] = p_value;
	}
	data["id"] = node.parentElement.id;
	console.log(data);
	return data;
}
function compileChildren(list) {
	var data = [];
	for (var i=0; i<list.length; i++) {
		var item = {};

		const node = list[i].getElementsByClassName("node")[0];
		var node_data = compileNode(node);
		item = node_data;

		const add = list[i].getElementsByClassName("add")[0];
		if (add) {
			const children = add.getElementsByClassName("childrenList")[0].children; 
			if (children.length > 0) {
				const children_data = compileChildren(children);
				item.children = children_data;
			}
		}
		
		data[i] = item;
	}
	return data;
}

//interface
var current_add;
function addN(type) {
	showAdd(current_add);
	current_add.type = type;
	add(current_add);
}
function add(e, data) {
	var type = e.type;
	var list = e.getElementsByClassName("childrenList")[0];

	var is_new = false;
	//for external data
	if (!data) {
		is_new = true;
		data = settings[current_add.type];
	} else {
		type = data.type;
	}

	//node
	var new_node = sample_node.cloneNode(true);
	new_node.getElementsByClassName("nodeName")[0].innerHTML = type;
	new_node.getElementsByClassName("nodeNum")[0].innerHTML = id;

	//properties
	for (var i=0; i<data.properties.length; i++) {
		const prop = data.properties[i];
		const def  = data.defaults[i];

		var new_property = sample_property.cloneNode(true);
		new_property.children[0].innerHTML = prop;
		new_property.children[1].name    = prop;
		if (typeof def === "boolean") {//костыль для bool
			new_property.children[1].type    = "checkbox";
			new_property.children[1].checked = def;
		} else
			new_property.children[1].value = def;

		new_node.getElementsByClassName("propList")[0].appendChild(new_property);
	}
	
	var li = document.createElement("li");
	li.appendChild(new_node);
	
	//children button
	if (data.isChildren) {
		var new_add = sample_add.cloneNode(true);
		new_add.getElementsByClassName("childrenList")[0].classList.remove("root");
		li.appendChild(new_add);
	}


	li.id = "e:"+id++;

	list.appendChild(li);

	//draggable
	li.draggable = true;
	li.addEventListener("dragstart", (evt) => {
		evt.target.style.position = "absolute";
		evt.target.classList.add("selected");

		document.getElementById("hover").appendChild(evt.target);

		var crt = document.createElement('div');
		crt.classList.add("ghost");
		document.body.appendChild(crt);
		evt.dataTransfer.setDragImage(crt, 0, 0);
		
	});
	li.addEventListener("dragend", (evt) => {
		evt.target.style.position = "unset";
		evt.target.classList.remove("selected");
		const place = document.getElementById("place");

		var ghosts = document.getElementsByClassName("ghost");
		while(ghosts[0]) document.body.removeChild(ghosts[0]);


		place.parentElement.insertBefore(evt.target,place);
		document.getElementById("hover").appendChild(place);
	});
	li.addEventListener("dragover", (evt) => {
		evt.preventDefault();

		const root = document.getElementsByClassName("root")[0];
		const place = document.getElementById("place");
		const currentElement = evt.target;
		const activeElement = document.getElementsByClassName("selected")[0];
		activeElement.style.left = window.event.clientX + "px";
		activeElement.style.top  = window.event.clientY + "px";

		if(!root.hasChildNodes()) {
			root.appendChild(place);
			return;
		}

		if(currentElement.classList.contains("childrenList")) {
			currentElement.appendChild(place);
			return;
		}
		//find nearest node
		var n = currentElement;
		while ( n
			 && n.parentElement
			 && !n.parentElement.classList.contains("childrenList")
			 && (n=n.parentElement)
		 );
		// n.style.border = "solid 2px #f00";

		//if after center
		const nCoord = n.getBoundingClientRect();
		const nCenter = nCoord.y + nCoord.height / 2;
		var direction = window.event.clientY < nCenter;

		if(!n.parentElement) return;
		if(direction){//up
			n.parentElement.insertBefore(place, n);
		} else {//down
			const nextElement = n.nextSibling;
			if(nextElement)
				nextElement.parentElement.insertBefore(place, nextElement);
			else//if last
				n.parentElement.appendChild(place);
		}

		return;
		
	});

	if(is_new)closeNode(li.getElementsByClassName("moveButton")[0]);

	return li;
}


function clr(e) {
	if (e) {
		e.innerHTML = "";
		e.remove();
	}
	else
		document.getElementsByClassName("childrenList")[0].innerHTML = "";
}

initConstructor();






//JSON//

//children cycle
var sub_i = [0];
function arrParse(arr, is_sub) {
	if (is_sub) {

		prr(arr[ sub_i[sub_i.length-1 ]])

		if (++sub_i[sub_i.length-1] >= arr.length)
			sub_i[sub_i.length-1] = 0;

	} else {
		for (var i=0; i<arr.length; i++)
			prr(arr[i])
	}
}

//json to tree
function decompileChildren(list,add_element) {
	var arr = [];
	for (var i=0; i<list.length; i++) {
		const item = list[i];

		//parse 1
		var data = {
			"type":item.type,
			"properties":[],
			"defaults":[]
		};

		for (key in item) {
			if (key != "type" && key != "children" && key != "id") {
				data.properties.push(key);
				data.defaults.push(item[key]);
			}
		}

		if (settings[item.type].isChildren)//item.children
			data.isChildren = true;

		var li = add(add_element,data);

		if (item.children) {
			decompileChildren(item.children,li);
		}

		arr[i] = li;
	}
}

//import export
const field_share = document.getElementById("shareInout");
function exp() {
	field_share.value = json;
}
function imp() {
	var data;
	try {
		data = JSON.parse(field_share.value);
	} catch(e) {
		field_share.style.border = "solid 2px #f00";
		return;
	}
	field_share.style.border = "solid 2px #888";

	json = field_share.value;

	clr();
	id = 0;
	sub_i = [0];
	decompileChildren(data,document.getElementsByClassName("add")[0]);
}

//tree to json
function compile() {
	var constructor = document.getElementById("constructor");

	var root = constructor.getElementsByClassName("add")[0].getElementsByClassName("childrenList")[0];

	var data = compileChildren(root.children);

	json = JSON.stringify(data);

	if (isStop) {
		if (json.includes("time") || json.includes("secs"))
			isStop = false;

		window.requestAnimationFrame(draw);
	}

	exp();
}

//show hide buttons
function showAdd(e) {
	if(e) current_add = e;
	var list = document.getElementById("addMenu");
	if (list.classList.contains("open"))
		list.classList.remove("open");
	else
		list.classList.add("open");
}
function closeNode(e) {
	const direction = e.classList.contains("up");
	if(direction) {
		e.classList.remove("up");
		e.classList.add("down");

		e.parentElement.getElementsByClassName('propList')[0].classList.remove("open");
	} else {
		e.classList.remove("down");
		e.classList.add("up");

		e.parentElement.getElementsByClassName('propList')[0].classList.add("open");
	}

	// var node = e.parentNode.parentNode.parentNode;
	// if (direction) {
	// //up
	// 	var prev = node.previousSibling;
	// 	node.parentNode.insertBefore(node,prev);
	// } else {
	// //down
	// 	var next = node.nextSibling;
	// 	node.parentNode.insertBefore(next,node);
	// }
}

//SHOW HIDE//

function show() {
	var constructor = document.getElementById("constructor").style;
	if (constructor.display == "block")
	{
		document.getElementById("show").innerHTML = "edit";
		constructor.transform = "perspective(500px) translateZ(-500px) rotateY(-60deg) translateZ(500px)";
		constructor.opacity = "0%";
		setTimeout(() => constructor.display = "none", 800);
	}
	else
	{
		if (document.getElementById("info").style.display == "block") showInfo();


		document.getElementById("show").innerHTML = "hide";
		constructor.display = "block";
		// constructor.opacity = "100%"
		setTimeout(() => {
			constructor.opacity = "100%"
			constructor.transform = "perspective(500px) translateZ(-500px) rotateY(0deg) translateZ(500px)";
		}, 200);
	}
}

function showInfo() {
	var info = document.getElementById("info").style;
	if (info.display == "block")
	{
		info.opacity = "0%";
		setTimeout(() => info.display = "none", 800);
	}
	else
	{
		if (document.getElementById("constructor").style.display == "block") show();

		info.display = "block";
		setTimeout(() => info.opacity = "100%", 200);
	}
}

function info(e) {
	var style;
	const list = JSON.parse(document.getElementById("infoData").innerHTML);

	const data = list[e.value];

	// var textNode = document.getElementById("infoText");
	// textNode.innerHTML = data.text;
	var imgNode  = document.getElementById("imgInfo");
	imgNode.src        = data.src;
}
info(document.getElementById("infoSelect"));