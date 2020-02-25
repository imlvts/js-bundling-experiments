import * as THREE from 'three';

import Stats from 'three/examples/jsm/libs/stats.module.js';

var container, stats;

var camera, scene, renderer;

var group;

var targetRotation = 0;
var targetRotationOnMouseDown = 0;

var mouseX = 0;
var mouseXOnMouseDown = 0;

var windowHalfX = window.innerWidth / 2;

window.addEventListener('load', function() {
    init();
    animate();
});

function init() {

	container = document.createElement( 'div' );
	document.body.appendChild( container );

	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0xf0f0f0 );

	camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 1000 );
	camera.position.set( 0, 150, 500 );
	scene.add( camera );

	var light = new THREE.PointLight( 0xffffff, 0.8 );
	camera.add( light );

	group = new THREE.Group();
	group.position.y = 50;
	scene.add( group );

	var loader = new THREE.TextureLoader();
	var texture = loader.load( "textures/uv_grid_opengl.jpg" );

	// it's necessary to apply these settings in order to correctly display the texture on a shape geometry

	texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
	texture.repeat.set( 0.008, 0.008 );

	function addShape( shape, extrudeSettings, color, x, y, z, rx, ry, rz, s ) {

		// flat shape with texture
		// note: default UVs generated by THREE.ShapeBufferGeometry are simply the x- and y-coordinates of the vertices

		var geometry = new THREE.ShapeBufferGeometry( shape );

		var mesh = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial( { side: THREE.DoubleSide, map: texture } ) );
		mesh.position.set( x, y, z - 175 );
		mesh.rotation.set( rx, ry, rz );
		mesh.scale.set( s, s, s );
		group.add( mesh );

		// flat shape

		var geometry = new THREE.ShapeBufferGeometry( shape );

		var mesh = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial( { color: color, side: THREE.DoubleSide } ) );
		mesh.position.set( x, y, z - 125 );
		mesh.rotation.set( rx, ry, rz );
		mesh.scale.set( s, s, s );
		group.add( mesh );

		// extruded shape

		var geometry = new THREE.ExtrudeBufferGeometry( shape, extrudeSettings );

		var mesh = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial( { color: color } ) );
		mesh.position.set( x, y, z - 75 );
		mesh.rotation.set( rx, ry, rz );
		mesh.scale.set( s, s, s );
		group.add( mesh );

		addLineShape( shape, color, x, y, z, rx, ry, rz, s );

	}

	function addLineShape( shape, color, x, y, z, rx, ry, rz, s ) {

		// lines

		shape.autoClose = true;

		var points = shape.getPoints();
		var spacedPoints = shape.getSpacedPoints( 50 );

		var geometryPoints = new THREE.BufferGeometry().setFromPoints( points );
		var geometrySpacedPoints = new THREE.BufferGeometry().setFromPoints( spacedPoints );

		// solid line

		var line = new THREE.Line( geometryPoints, new THREE.LineBasicMaterial( { color: color } ) );
		line.position.set( x, y, z - 25 );
		line.rotation.set( rx, ry, rz );
		line.scale.set( s, s, s );
		group.add( line );

		// line from equidistance sampled points

		var line = new THREE.Line( geometrySpacedPoints, new THREE.LineBasicMaterial( { color: color } ) );
		line.position.set( x, y, z + 25 );
		line.rotation.set( rx, ry, rz );
		line.scale.set( s, s, s );
		group.add( line );

		// vertices from real points

		var particles = new THREE.Points( geometryPoints, new THREE.PointsMaterial( { color: color, size: 4 } ) );
		particles.position.set( x, y, z + 75 );
		particles.rotation.set( rx, ry, rz );
		particles.scale.set( s, s, s );
		group.add( particles );

		// equidistance sampled points

		var particles = new THREE.Points( geometrySpacedPoints, new THREE.PointsMaterial( { color: color, size: 4 } ) );
		particles.position.set( x, y, z + 125 );
		particles.rotation.set( rx, ry, rz );
		particles.scale.set( s, s, s );
		group.add( particles );

	}


	// California

	var californiaPts = [];

	californiaPts.push( new THREE.Vector2( 610, 320 ) );
	californiaPts.push( new THREE.Vector2( 450, 300 ) );
	californiaPts.push( new THREE.Vector2( 392, 392 ) );
	californiaPts.push( new THREE.Vector2( 266, 438 ) );
	californiaPts.push( new THREE.Vector2( 190, 570 ) );
	californiaPts.push( new THREE.Vector2( 190, 600 ) );
	californiaPts.push( new THREE.Vector2( 160, 620 ) );
	californiaPts.push( new THREE.Vector2( 160, 650 ) );
	californiaPts.push( new THREE.Vector2( 180, 640 ) );
	californiaPts.push( new THREE.Vector2( 165, 680 ) );
	californiaPts.push( new THREE.Vector2( 150, 670 ) );
	californiaPts.push( new THREE.Vector2( 90, 737 ) );
	californiaPts.push( new THREE.Vector2( 80, 795 ) );
	californiaPts.push( new THREE.Vector2( 50, 835 ) );
	californiaPts.push( new THREE.Vector2( 64, 870 ) );
	californiaPts.push( new THREE.Vector2( 60, 945 ) );
	californiaPts.push( new THREE.Vector2( 300, 945 ) );
	californiaPts.push( new THREE.Vector2( 300, 743 ) );
	californiaPts.push( new THREE.Vector2( 600, 473 ) );
	californiaPts.push( new THREE.Vector2( 626, 425 ) );
	californiaPts.push( new THREE.Vector2( 600, 370 ) );
	californiaPts.push( new THREE.Vector2( 610, 320 ) );

	for ( var i = 0; i < californiaPts.length; i ++ ) californiaPts[ i ].multiplyScalar( 0.25 );

	var californiaShape = new THREE.Shape( californiaPts );


	// Triangle

	var triangleShape = new THREE.Shape()
		.moveTo( 80, 20 )
		.lineTo( 40, 80 )
		.lineTo( 120, 80 )
		.lineTo( 80, 20 ); // close path


	// Heart

	var x = 0, y = 0;

	var heartShape = new THREE.Shape() // From http://blog.burlock.org/html5/130-paths
		.moveTo( x + 25, y + 25 )
		.bezierCurveTo( x + 25, y + 25, x + 20, y, x, y )
		.bezierCurveTo( x - 30, y, x - 30, y + 35, x - 30, y + 35 )
		.bezierCurveTo( x - 30, y + 55, x - 10, y + 77, x + 25, y + 95 )
		.bezierCurveTo( x + 60, y + 77, x + 80, y + 55, x + 80, y + 35 )
		.bezierCurveTo( x + 80, y + 35, x + 80, y, x + 50, y )
		.bezierCurveTo( x + 35, y, x + 25, y + 25, x + 25, y + 25 );


	// Square

	var sqLength = 80;

	var squareShape = new THREE.Shape()
		.moveTo( 0, 0 )
		.lineTo( 0, sqLength )
		.lineTo( sqLength, sqLength )
		.lineTo( sqLength, 0 )
		.lineTo( 0, 0 );

	// Rounded rectangle

	var roundedRectShape = new THREE.Shape();

	( function roundedRect( ctx, x, y, width, height, radius ) {

		ctx.moveTo( x, y + radius );
		ctx.lineTo( x, y + height - radius );
		ctx.quadraticCurveTo( x, y + height, x + radius, y + height );
		ctx.lineTo( x + width - radius, y + height );
		ctx.quadraticCurveTo( x + width, y + height, x + width, y + height - radius );
		ctx.lineTo( x + width, y + radius );
		ctx.quadraticCurveTo( x + width, y, x + width - radius, y );
		ctx.lineTo( x + radius, y );
		ctx.quadraticCurveTo( x, y, x, y + radius );

	} )( roundedRectShape, 0, 0, 50, 50, 20 );


	// Track

	var trackShape = new THREE.Shape()
		.moveTo( 40, 40 )
		.lineTo( 40, 160 )
		.absarc( 60, 160, 20, Math.PI, 0, true )
		.lineTo( 80, 40 )
		.absarc( 60, 40, 20, 2 * Math.PI, Math.PI, true );


	// Circle

	var circleRadius = 40;
	var circleShape = new THREE.Shape()
		.moveTo( 0, circleRadius )
		.quadraticCurveTo( circleRadius, circleRadius, circleRadius, 0 )
		.quadraticCurveTo( circleRadius, - circleRadius, 0, - circleRadius )
		.quadraticCurveTo( - circleRadius, - circleRadius, - circleRadius, 0 )
		.quadraticCurveTo( - circleRadius, circleRadius, 0, circleRadius );


	// Fish

	var x = y = 0;

	var fishShape = new THREE.Shape()
		.moveTo( x, y )
		.quadraticCurveTo( x + 50, y - 80, x + 90, y - 10 )
		.quadraticCurveTo( x + 100, y - 10, x + 115, y - 40 )
		.quadraticCurveTo( x + 115, y, x + 115, y + 40 )
		.quadraticCurveTo( x + 100, y + 10, x + 90, y + 10 )
		.quadraticCurveTo( x + 50, y + 80, x, y );


	// Arc circle

	var arcShape = new THREE.Shape()
		.moveTo( 50, 10 )
		.absarc( 10, 10, 40, 0, Math.PI * 2, false );

	var holePath = new THREE.Path()
		.moveTo( 20, 10 )
		.absarc( 10, 10, 10, 0, Math.PI * 2, true )

	arcShape.holes.push( holePath );


	// Smiley

	var smileyShape = new THREE.Shape()
		.moveTo( 80, 40 )
		.absarc( 40, 40, 40, 0, Math.PI * 2, false );

	var smileyEye1Path = new THREE.Path()
		.moveTo( 35, 20 )
		.absellipse( 25, 20, 10, 10, 0, Math.PI * 2, true );

	var smileyEye2Path = new THREE.Path()
		.moveTo( 65, 20 )
		.absarc( 55, 20, 10, 0, Math.PI * 2, true );

	var smileyMouthPath = new THREE.Path()
		.moveTo( 20, 40 )
		.quadraticCurveTo( 40, 60, 60, 40 )
		.bezierCurveTo( 70, 45, 70, 50, 60, 60 )
		.quadraticCurveTo( 40, 80, 20, 60 )
		.quadraticCurveTo( 5, 50, 20, 40 );

	smileyShape.holes.push( smileyEye1Path );
	smileyShape.holes.push( smileyEye2Path );
	smileyShape.holes.push( smileyMouthPath );


	// Spline shape

	var splinepts = [];
	splinepts.push( new THREE.Vector2( 70, 20 ) );
	splinepts.push( new THREE.Vector2( 80, 90 ) );
	splinepts.push( new THREE.Vector2( - 30, 70 ) );
	splinepts.push( new THREE.Vector2( 0, 0 ) );

	var splineShape = new THREE.Shape()
		.moveTo( 0, 0 )
		.splineThru( splinepts );

	var extrudeSettings = { depth: 8, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 1, bevelThickness: 1 };

	// addShape( shape, color, x, y, z, rx, ry,rz, s );

	addShape( californiaShape, extrudeSettings, 0xf08000, - 300, - 100, 0, 0, 0, 0, 1 );
	addShape( triangleShape, extrudeSettings, 0x8080f0, - 180, 0, 0, 0, 0, 0, 1 );
	addShape( roundedRectShape, extrudeSettings, 0x008000, - 150, 150, 0, 0, 0, 0, 1 );
	addShape( trackShape, extrudeSettings, 0x008080, 200, - 100, 0, 0, 0, 0, 1 );
	addShape( squareShape, extrudeSettings, 0x0040f0, 150, 100, 0, 0, 0, 0, 1 );
	addShape( heartShape, extrudeSettings, 0xf00000, 60, 100, 0, 0, 0, Math.PI, 1 );
	addShape( circleShape, extrudeSettings, 0x00f000, 120, 250, 0, 0, 0, 0, 1 );
	addShape( fishShape, extrudeSettings, 0x404040, - 60, 200, 0, 0, 0, 0, 1 );
	addShape( smileyShape, extrudeSettings, 0xf000f0, - 200, 250, 0, 0, 0, Math.PI, 1 );
	addShape( arcShape, extrudeSettings, 0x804000, 150, 0, 0, 0, 0, 0, 1 );
	addShape( splineShape, extrudeSettings, 0x808080, - 50, - 100, 0, 0, 0, 0, 1 );

	addLineShape( arcShape.holes[ 0 ], 0x804000, 150, 0, 0, 0, 0, 0, 1 );

	for ( var i = 0; i < smileyShape.holes.length; i += 1 ) {

		addLineShape( smileyShape.holes[ i ], 0xf000f0, - 200, 250, 0, 0, 0, Math.PI, 1 );

	}

	//

	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	container.appendChild( renderer.domElement );

	stats = new Stats();
	container.appendChild( stats.dom );

	document.addEventListener( 'mousedown', onDocumentMouseDown, false );
	document.addEventListener( 'touchstart', onDocumentTouchStart, false );
	document.addEventListener( 'touchmove', onDocumentTouchMove, false );

	//

	window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}

//

function onDocumentMouseDown( event ) {

	event.preventDefault();

	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	document.addEventListener( 'mouseup', onDocumentMouseUp, false );
	document.addEventListener( 'mouseout', onDocumentMouseOut, false );

	mouseXOnMouseDown = event.clientX - windowHalfX;
	targetRotationOnMouseDown = targetRotation;

}

function onDocumentMouseMove( event ) {

	mouseX = event.clientX - windowHalfX;

	targetRotation = targetRotationOnMouseDown + ( mouseX - mouseXOnMouseDown ) * 0.02;

}

function onDocumentMouseUp() {

	document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
	document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
	document.removeEventListener( 'mouseout', onDocumentMouseOut, false );

}

function onDocumentMouseOut() {

	document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
	document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
	document.removeEventListener( 'mouseout', onDocumentMouseOut, false );

}

function onDocumentTouchStart( event ) {

	if ( event.touches.length == 1 ) {

		event.preventDefault();

		mouseXOnMouseDown = event.touches[ 0 ].pageX - windowHalfX;
		targetRotationOnMouseDown = targetRotation;

	}

}

function onDocumentTouchMove( event ) {

	if ( event.touches.length == 1 ) {

		event.preventDefault();

		mouseX = event.touches[ 0 ].pageX - windowHalfX;
		targetRotation = targetRotationOnMouseDown + ( mouseX - mouseXOnMouseDown ) * 0.05;

	}

}

//

function animate() {

	requestAnimationFrame( animate );

	render();
	stats.update();

}

function render() {

	group.rotation.y += ( targetRotation - group.rotation.y ) * 0.05;
	renderer.render( scene, camera );

}
