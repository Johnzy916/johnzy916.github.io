export default () => {
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
	const TEXT_COLOR = 'white';
	const PARTICLE_COLOR = 'white';
	const PARTICLE_SPREAD = 10;
	const PARTICLE_ADJUST_X = 9;
	const PARTICLE_ADJUST_Y = 20;
	const LINE_CONNECT_DISTANCE = 10;
	const LINE_CONNECT_WIDTH = 2;
	const LINE_CONNECT_COLOR = 'white';

	// draw text
	ctx.fillStyle = TEXT_COLOR;
	ctx.font = '20px Verdana';
	ctx.fillText('Jhonathan', 0, 20);
	// ctx.rect(0, 0, 105, 25);
	// ctx.strokeStyle = 'white';
	// ctx.stroke();

	// get image data
	const pixelData = ctx.getImageData(0, 0, 105, 25);
	

	// particle class
	class Particle {
		constructor(x, y) {
			this.x = x;
			this.y = y;
			this.size = 3;
			this.baseX = this.x;
			this.baseY = this.y;
			this.density = (Math.random() * 30) + 1;
		}
		
		draw() {
			ctx.fillStyle = PARTICLE_COLOR;
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
				if (pixelData.data[(y * 4 * pixelData.width) + (x * 4) + 3] > 128) {
					const positionX = x + PARTICLE_ADJUST_X;
					const positionY = y + PARTICLE_ADJUST_Y;
					pixelArray.push(new Particle(
						positionX * PARTICLE_SPREAD, positionY * PARTICLE_SPREAD
					));
				}
			}
		}
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
