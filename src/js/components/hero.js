export default async () => {
	const canvas = document.querySelector('#canvas-hero');
	const canvasContainer = document.querySelector('#hero');
	const ctx = canvas.getContext('2d');
	let animation; // for stopping animation frames

	// default canvas size
	canvas.width = canvasContainer.clientWidth;
	canvas.height = canvasContainer.clientHeight;

	// track mouse movement
	const mouse = {
		x: null,
		y: null,
		radius: 100
	}
	// get mouse coords
	canvas.addEventListener('mousemove', (e) => {
		mouse.x = e.offsetX;
		mouse.y = e.offsetY;
	});

	// const LINE_CONNECT_DISTANCE = 10;
	// const LINE_CONNECT_WIDTH = 2;
	// const LINE_CONNECT_COLOR = 'white';
	let PARTICLE_SPREAD = Math.min(canvasContainer.clientWidth / 175, 9);

	const handleResize = () => {
		// set the canvas width
		canvas.width = canvasContainer.clientWidth;
		canvas.height = canvasContainer.clientHeight;
		// set particle spread
		PARTICLE_SPREAD = Math.min(canvasContainer.clientWidth / 175, 9);
		// center and reanimate particles
		cancelAnimationFrame(animation);
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		initParticles();
	}
	window.addEventListener('resize', handleResize);

	// create particle array
	let pixelArray = [];

	// save default state
	ctx.save();

	// rectangle for extracting data with getImageData
	const dataSize = { width: 150, height: 57 };
	const dataRect = [ 0, 0, dataSize.width, dataSize.height ];
	// TESTING - visualize data box
	// COMMENT OUT for production
	////////////////////////////////////
	// ctx.rect(...dataRect);
	// ctx.strokeStyle = 'white';
	// ctx.stroke();

	// particle headline
	const headline = [
		`Hi, I'm`,
		`Jhonathan`,
		`Web Developer`
	];

	// draw text
	ctx.fillStyle = 'white';
	ctx.font = '12px Verdana';
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	ctx.fillText(headline[0], dataSize.width / 2, (dataSize.height / 2) - 17);
	ctx.font = 'normal 800 17px Verdana';
	ctx.fillText(headline[1], dataSize.width / 2, (dataSize.height / 2));
	ctx.fillStyle = '#850D4A';
	ctx.font = 'normal 800 17px Verdana';
	ctx.fillText(headline[2], dataSize.width / 2, (dataSize.height / 2) + 18);

	// get image data
	const pixelData = ctx.getImageData(...dataRect);

	// restore default state
	ctx.restore();

	// particle class
	class Particle {
		constructor(x, y, color) {
			this.x = x;
			this.y = y;
			this.color = color;
			this.size = 3;
			this.baseX = this.x;
			this.baseY = this.y;
			this.density = (Math.random() * 30) + 1;
		}
		
		draw() {
			ctx.fillStyle = this.color;
			ctx.beginPath();
			ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
			ctx.closePath();
			ctx.fill();
		}
		
		update() {
			const dx = mouse.x - this.x;
			const dy = mouse.y - this.y;
			const distance = Math.hypot(dx, dy);
			const forceDirectionX = dx / distance;
			const forceDirectionY = dy / distance;
			const maxDistance = mouse.radius;
			const force = (maxDistance - distance) / maxDistance;
			const directionX = forceDirectionX * force * this.density;
			const directionY = forceDirectionY * force * this.density;
			if (distance < mouse.radius) {
				this.x -= directionX;
				this.y -= directionY;
			} else {
				if (this.x !== this.baseX) {
					const dx = this.x - this.baseX;
					this.x -= dx/10;
				}
				if (this.y !== this.baseY) {
					const dy = this.y - this.baseY;
					this.y -= dy/10;
				}
			}
		}
	}

	// generate particles
	function initParticles() {
		pixelArray = [];
		for (let y = 0; y < pixelData.height; y++) {
			for (let x = 0; x < pixelData.width; x++) {
				// colors index
				const redIndex = y * (pixelData.width * 4) + x * 4;
				const greenIndex = redIndex + 1;
				const blueIndex = redIndex + 2;
				const alphaIndex = redIndex + 3;
				// create particle for opaque pixels
				if (pixelData.data[alphaIndex] > 128) {
					const positionX = x + (canvas.width / (PARTICLE_SPREAD * 2)) - (dataSize.width / 2);
					const positionY = y + (canvas.height / (PARTICLE_SPREAD * 2)) - (dataSize.height / 2);
					pixelArray.push(new Particle(
						positionX * PARTICLE_SPREAD, positionY * PARTICLE_SPREAD,
						`rgba(${pixelData.data[redIndex]},${pixelData.data[greenIndex]},${pixelData.data[blueIndex]},${pixelData.data[alphaIndex]})`
					));
				}
			}
		}
		animateParticles();
	};
	initParticles();

	// connect particles
	// const connectParticles = () => {
	// 	let opacity = 1;
	// 	for (let a = 0; a < pixelArray.length; a++) {
	// 		for (let b = a; b < pixelArray.length; b++) {
	// 			let dx = pixelArray[a].x - pixelArray[b].x;
	// 			let dy = pixelArray[a].y - pixelArray[b].y;
	// 			let distance = Math.hypot(dx, dy);

	// 			if (distance < LINE_CONNECT_DISTANCE) {
	// 				ctx.strokeStyle = LINE_CONNECT_COLOR;
	// 				ctx.lineWidth = LINE_CONNECT_WIDTH;
	// 				ctx.beginPath();
	// 				ctx.moveTo(pixelArray[a].x, pixelArray[a].y);
	// 				ctx.lineTo(pixelArray[b].x, pixelArray[b].y);
	// 				ctx.stroke();
	// 			}
	// 		}
	// 	}
	// }

	// animate particles
	function animateParticles() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		for (particle of pixelArray) {
			particle.draw();
			particle.update();
		}

		// connectParticles();
		animation = requestAnimationFrame(animateParticles);
	};
}
