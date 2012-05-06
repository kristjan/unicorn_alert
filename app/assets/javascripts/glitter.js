	// screen size variables
	var SCREEN_WIDTH = window.innerWidth,
			SCREEN_HEIGHT = window.innerHeight,
			HALF_WIDTH = window.innerWidth / 2,
		  HALF_HEIGHT = window.innerHeight / 2;

	// canvas element and 2D context
	  	canvas = document.createElement( 'canvas' ),
			context = canvas.getContext( '2d' ),
			container = $('<div/>', {'class': 'canvasWrapper' });

  // fiziks
	var TO_RADIANS = Math.PI/180,
			TO_DEGREES = 180/Math.PI;

	// Interaction
	var mouseX = HALF_WIDTH,
			mouseY = HALF_HEIGHT,
			mouseDown = false;

	// particles
	var particles = [],
			particleImage = new Image(),
			NEW_PARTICLE_RATE = 5,
			MAX_PARTICLES = 300;


			particleImage.src = 'assets/whitesquare.png'


	/*
	*	Create canvas html and particle objects
	*/
	function init() {

		// Canvas html setup
		$('body').prepend(container);
		container.append(canvas); 
		canvas.width = SCREEN_WIDTH; 
		canvas.height = SCREEN_HEIGHT;

		// Set main loop to run at 33 fps
		setInterval(loop, 1000 / 30);
	
		// Setup interaction
		initMouseListeners(); 

		document.addEventListener( 'mousedown', onMouseDown, false );

	
	}



	function loop() {	

		// make some particles
		if(mouseDown){
			makeParticle(NEW_PARTICLE_RATE); 
		} else{

		}

		// clear the canvas
		context.clearRect(0,0, SCREEN_WIDTH, SCREEN_HEIGHT);

	  	// iteratate through each particle
		for (i=0; i<particles.length; i++) {
			var particle = particles[i]; 

			// render it
			particle.render(context); 

			// and then update. We always render first so particle
			// appears in the starting point.
			particle.update();

				if(particle.posY > SCREEN_HEIGHT) {
					particle.velY*=-0.9; 
					particle.posY = SCREEN_HEIGHT;
				}
		}

		// Keep taking the oldest particles away until we have 
		// fewer than the maximum allowed. 
		while(particles.length>MAX_PARTICLES){
			particles.shift();
		}
		
	}



	function makeParticle(particleCount) {

		for(var i=0; i<particleCount;i++) {

				// create a new particle in the middle of the stage
				var particle = new ImageParticle(particleImage, mouseX, mouseY); 

				//var particle = new ImageParticle(particleImage, mouseX, mouseY); 

				// give it a random x and y velocity
				particle.velX = randomRange(-10,10);
				particle.velY = randomRange(-10,10);
				particle.size = randomRange(0.1,10);
				particle.gravity = 0; 
				particle.drag = 0.96;
				particle.shrink = 0.97; 

				particle.rotation = randomRange(0,360);
				particle.spin = randomRange(-10,10); 


				// sets the blend mode so particles are drawn with an additive blend
				particle.compositeOperation = 'lighter';

				// add it to the array
				particles.push(particle);

		}
	}


	
	function initMouseListeners() {
		document.addEventListener('mousemove', onMouseMove, false);
		document.addEventListener( 'mousedown', onMouseDown, false );
		document.addEventListener( 'mouseup', onMouseUp, false );
	}

	function onMouseMove( event ) {
		event.preventDefault();
		mouseX = event.clientX;
		mouseY = event.clientY;
	}

	function onMouseDown(event) {
		mouseDown = true; 
	}
	function onMouseUp(event) {
		mouseDown = false; 
	}


 	$(document).ready(function(){

		init();

});
