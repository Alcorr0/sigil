function elementParse(element) {
	switch (element["type"]) {
	case "Transparent":
		if(element["children"]) {
			transparent(
				function(){arrParse(element["children"])}
			);
		}
	break;
	case "Move":
		if(element["children"]) {
			move(
				parse(element["x"]),
				parse(element["y"]),
				function(){arrParse(element["children"])}
			);
		}
	break;
	case "Rotate":
		if(element["children"]) {
			rotate(
				parse(element["angle"]),
				function(){arrParse(element["children"])}
			);
		}
	break;
	case "Color RGB":
		if(element["children"]) {
			color(
				rgbToHex(
					normalise(parse(element["red"])),
					normalise(parse(element["green"])),
					normalise(parse(element["blue"])),
					normalise(parse(element["alpha"]))
				),
				function(){arrParse(element["children"])}
			);
		}
	break;
	case "Color HSV":
		if(element["children"]) {
			var col = hsv2rgb(
				normalise(parse(element["hue"]), 360),
				parse(element["saturation"]),
				parse(element["value"])
			);
			color(
				rgbToHex(
					normalise(col[0]),
					normalise(col[1]),
					normalise(col[2]),
					normalise(parse(element["alpha"]))
				),
				function(){arrParse(element["children"])}
			);
		}
	break;
	case "Width":
		if(element["children"]) {
			width(
				parse(element["width"]),
				function(){arrParse(element["children"])}
			);
		}
	break;
	case "To Circle":
		if(element["children"]) {
			toCircle(
				parse(element["radius"]),
				parse(element["segments"]),
				element["angle A"]?parse(element["angle A"]):0,
				element["angle B"]?parse(element["angle B"]):Math.PI*2,
				function(){arrParse(element["children"], element["separate"])}
			);
		}
	break;
	case "To Line":
		if(element["children"]) {
			toLine(
				parse(element["length"]),
				parse(element["segments"]),
				parse(element["offset"]),
				parse(element["angle"]),
				function(){arrParse(element["children"], element["separate"])}
			);
		}
	break;
	case "To Ellipse":
		if(element["children"]) {
			toEllipse(
				parse(element["radius A"]),
				parse(element["radius B"]),
				parse(element["segments"]),
				element["angle A"]?parse(element["angle A"]):0,
				element["angle B"]?parse(element["angle B"]):Math.PI*2,
				function(){arrParse(element["children"], element["separate"])}
			);
		}
	break;
	case "Function":
		if(element["children"]) {
			fun(
				parse(element["from"]),
				parse(element["to"]),
				parse(element["segments"]),
				function(){arrParse(element["children"], element["separate"])}
			);
		}
	break;

	case "Variable":
		variable(
			element["name"],
			parse(element["value"])
		);
	break;

	case "Text":
		text(
			parse(element["width"]),
			element["text"],
			parse(element["angle"])
		);
	break;
	case "Random Text":
		randomText(
			parse(element["width"]),
			element["text"],
			parse(element["segments"]),
			parse(element["seed"]),
			parse(element["angle"])
		);
	break;
	case "Number":
		number(
			parse(element["width"]),
			parse(element["expression"])
		);
	break;
	case "Line":
		line(
			parse(element["x"]),
			parse(element["y"]),
			element["dx"]?parse(element["dx"]):0,
			element["dy"]?parse(element["dy"]):0
		);
	break;
	case "Circle":
		circle(
			parse(element["radius"]),
			element["angle A"]?parse(element["angle A"]):0,
			element["angle B"]?parse(element["angle B"]):Math.PI*2,
			element["fill"]
		);
	break;
	case "Ellipse":
		ellipse(
			parse(element["radius A"]),
			parse(element["radius B"]),
			element["angle A"]?parse(element["angle A"]):0,
			element["angle B"]?parse(element["angle B"]):Math.PI*2,
			element["fill"]
		);
	break;
	
	case "Letters Circle":
		lettersCircle(
			parse(element["radius"]),
			parse(element["width"]),
			element["text"],
			element["segments"]?parse(element["segments"]):1,
			parse(element["angle"])
		);
	break;
	case "Letters Ellipse":
		lettersEllipse(
			parse(element["radius A"]),
			parse(element["radius B"]),
			parse(element["width"]),
			element["text"],
			element["segments"]?parse(element["segments"]):1,
			parse(element["angle"])
		);
	break;
	case "Random Letters Circle":
		randLettersCircle(
			parse(element["radius"]),
			parse(element["width"]),
			parse(element["segments"]),
			element["text"],
			parse(element["seed"]),
			parse(element["angle"])
		);
	break;
	case "Polygon":
		polygon(
			parse(element["radius"]),
			parse(element["segments"]),
			element["fill"]
			//(element["max"]&&element["max"]!=-1)?element["max"]:parse(element["segments"])
		);
	break;
	case "Radial Circle":
		radialCircle(
			parse(element["radius A"]),
			parse(element["radius B"]),
			parse(element["segments"]),
			element["angle A"]?parse(element["angle A"]):0,
			element["angle B"]?parse(element["angle B"]):Math.PI*2
		);
	break;
	case "Image":
		image(
			parse(element["x"]),
			parse(element["y"]),
			parse(element["width"]),
			parse(element["height"]),
			element["image"],
			element["front"]
		);
	break;
	case "Star":
		star(
			parse(element["width"]),
			parse(element["height A"]),
			parse(element["height B"])
		);
	break;
	case "Note":
		note(
			parse(element["radius"]),
			parse(element["pitch"]),
			parse(element["height"]),
			parse(element["note type"]),
			parse(element["dx"]),
			parse(element["dy"])
		);
	break;
	case "Custom line":
		customLine(
			parse(element["from"]),
			parse(element["to"]),
			parse(element["segments"]),
			function(i){return eval(element["function A"])},
			function(i){return eval(element["function B"])},
			element["fill"]
		);
	break;
	}
}

// function evalInContext() {eval("example()")}

// evalInContext.call(context);

function prr(el) {
	try {
		sub_i.push(0);
		elementParse(el);
		sub_i.pop();

		return true;
	} catch(e) {
		console.log(e);
		var err_el = document.getElementById(el.id)
		if (err_el)
			err_el.style.border = "solid 2px #f00";
		return false;
	}
}