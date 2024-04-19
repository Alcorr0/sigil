// var container;
// var camera, scene;
// var uniforms, material, mesh;
// var mouseX = 0, mouseY = 0,
// 	lat = 0, lon = 0, phy = 0, theta = 0;
// var tex;
// var br,bb,bc,tr={x:0,y:0};

// init();
// var startTime = Date.now();
// animate();

// function init() {
// 	container = document.getElementById('container');

// 	camera = new THREE.Camera();
// 	camera.position.z = 1;
// 	scene = new THREE.Scene();

// 	tex = new THREE.CanvasTexture(canvas);
// 	tex.needsUpdate = true;

// 	uniforms = {
// 		time:           { type: "f",  value: 1.0 },
// 		resolution:     { type: "v2", value: new THREE.Vector2() },
// 		texture1:       { type: "t",  value: null },
// 		blurRadius:     { type: "f",  value: br },
// 		blurBrightness: { type: "f",  value: bb },
// 		blurColor:      { type: "f",  value: bc },
// 		translate:      { type: "v2", value: tr },
// 		scale:          { type: "f",  value: scale }
// 	};

// 	material = new THREE.ShaderMaterial({
// 		uniforms: uniforms,
// 		vertexShader: document.getElementById('vertexShader').textContent,
// 		fragmentShader: document.getElementById('fragmentShader').textContent
// 	});

// 	mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
// 	scene.add(mesh);

// 	renderer = new THREE.WebGLRenderer();
// 	renderer.domElement.id = "canvasShaded";

// 	renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);
// 	renderer.setSize(window.innerWidth, window.innerHeight);
// 	uniforms.resolution.value.x = window.innerWidth;
// 	uniforms.resolution.value.y = window.innerHeight;

// 	canvas.style.display = "none";
// 	document.getElementById("body").insertBefore(renderer.domElement, document.getElementById("interface"));
// }

// function animate() {
// 	if (!isStop)
// 		requestAnimationFrame(animate);
// 	render();
// }

// function render() {
// 	var elapsedMilliseconds = Date.now() - startTime;
// 	var elapsedSeconds = elapsedMilliseconds / 1000.;
// 	uniforms.time.value = 60. * elapsedSeconds;

// 	tex.needsUpdate = true;
// 	uniforms.texture1.value = tex;

// 	uniforms.resolution.value = res;

// 	renderer.render(scene, camera);
// }

// function shaderUpdate(e) {
// 	switch (e.name) {
// 	case "blurRadius":
// 		br = e.value;
// 		uniforms.blurRadius.value = br;
// 	break;
// 	case "blurBrightness":
// 		bb = e.value;
// 		uniforms.blurBrightness.value = bb;
// 	break;
// 	case "blurColor":
// 		bc = e.value-0.5;
// 		uniforms.blurColor.value = bc;
// 	break;

// 	case "translateX":
// 		tr.x = e.value;
// 		uniforms.translate.value = tr;
// 	break;
// 	case "translateY":
// 		tr.y = e.value;
// 		uniforms.translate.value = tr;
// 	break;
// 	case "scale":
// 		scale = e.value;
// 		uniforms.scale.value = scale;
// 	break;
// 	}
	
// 	if (isStop)
// 		window.requestAnimationFrame(draw);
// }

// shaderUpdate(document.getElementById("blurRadius"));
// shaderUpdate(document.getElementById("blurBrightness"));
// shaderUpdate(document.getElementById("blurColor"));
// shaderUpdate(document.getElementById("translateX"));
// shaderUpdate(document.getElementById("translateY"));
// shaderUpdate(document.getElementById("scale"));
