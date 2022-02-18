export default async () => {
	const canvas = document.querySelector('#canvas-hero');
	const canvasContainer = document.querySelector('#canvas-container');
	const ctx = canvas.getContext('2d');
	// set size to container
	const resizeCanvas = () => {
		canvas.width = canvasContainer.clientWidth;
		canvas.height = canvasContainer.clientHeight;
	}
	resizeCanvas();
	window.addEventListener('resize', resizeCanvas);
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
	// create particle array
	let pixelArray = [];
	// constants
	const HEADLINE_COLOR = 'white';
	const TITLE_COLOR = '#850D4A';
	const PARTICLE_SPREAD = 10;
	const PARTICLE_ADJUST_X = 30;
	const PARTICLE_ADJUST_Y = 20;
	const LINE_CONNECT_DISTANCE = 10;
	const LINE_CONNECT_WIDTH = 2;
	const LINE_CONNECT_COLOR = 'white';
	// load font
	// const openSans = new FontFace('Open Sans', 'url(../../fonts/OpenSans-ExtraBold.ttf)', {
	// 	style: 'normal', weight: 800
	// });
	// await openSans.load();
	// document.fonts.add(openSans);
	document.body.style.fontFamily = '"Open Sans", sans-serif';
	// draw text
	ctx.fillStyle = HEADLINE_COLOR;
	ctx.font = '10px Verdana';
	ctx.fillText(`Hi, I'm`, 45, 15);
	ctx.font = 'normal 800 15px Verdana';
	ctx.fillText('Jhonathan', 20, 30);
	ctx.fillStyle = TITLE_COLOR;
	ctx.font = 'normal 800 15px Verdana';
	ctx.fillText('Web Developer', 0, 50);
	// testing - text box
	// ctx.rect(0, 0, 130, 55);
	// ctx.strokeStyle = 'white';
	// ctx.stroke();

	// get image data
	const pixelData = ctx.getImageData(0, 0, 130, 55);
	

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
	const initParticles = () => {
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
					const positionX = x + PARTICLE_ADJUST_X;
					const positionY = y + PARTICLE_ADJUST_Y;
					pixelArray.push(new Particle(
						positionX * PARTICLE_SPREAD, positionY * PARTICLE_SPREAD,
						`rgba(${pixelData.data[redIndex]},${pixelData.data[greenIndex]},${pixelData.data[blueIndex]},${pixelData.data[alphaIndex]})`
					));
				}
			}
		}
		console.log('pixel: ', pixelArray[0])
	};
	initParticles();

	// connect particles
	const connectParticles = () => {
		let opacity = 1;
		for (let a = 0; a < pixelArray.length; a++) {
			for (let b = a; b < pixelArray.length; b++) {
				let dx = pixelArray[a].x - pixelArray[b].x;
				let dy = pixelArray[a].y - pixelArray[b].y;
				let distance = Math.hypot(dx, dy);

				if (distance < LINE_CONNECT_DISTANCE) {
					ctx.strokeStyle = LINE_CONNECT_COLOR;
					ctx.lineWidth = LINE_CONNECT_WIDTH;
					ctx.beginPath();
					ctx.moveTo(pixelArray[a].x, pixelArray[a].y);
					ctx.lineTo(pixelArray[b].x, pixelArray[b].y);
					ctx.stroke();
				}
			}
		}
	}

	// animate particles
	const animateParticles = () => {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		for (particle of pixelArray) {
			particle.draw();
			particle.update();
		}
		// connectParticles();
		requestAnimationFrame(animateParticles);
	};
	animateParticles();
}
