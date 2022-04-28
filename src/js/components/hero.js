export default async () => {
	const canvas = document.querySelector('#canvas-hero');
	const canvasContainer = document.querySelector('#hero');
	const ctx = canvas.getContext('2d');
	let animation; // for stopping animation frames
	
	// min size for particle effect
	let isDesktopSize = matchMedia('(min-width: 1280px)').matches;

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

	// config
	let particleSpread = 9;
	let particleSize = 3;

	const handleResize = () => {
		// set the canvas width
		canvas.width = canvasContainer.clientWidth;
		canvas.height = canvasContainer.clientHeight;
		// set particle spread
		particleSpread = Math.min(canvasContainer.clientWidth / 175, 9);
		// center and reanimate particles
		cancelAnimationFrame(animation);
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		// check if desktop size
		isDesktopSize = matchMedia('(min-width: 1280px)').matches

		if (isDesktopSize) {
			initParticles();
		}
	}
	window.addEventListener('resize', handleResize);

	// create particle array
	let pixelArray = [];

	// rectangle for extracting data with getImageData
	const dataSize = { width: 150, height: 57 };
	const dataRect = [ 0, 0, dataSize.width, dataSize.height ];

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

	// particle class
	class Particle {
		constructor(x, y, color) {
			this.x = x;
			this.y = y;
			this.color = color;
			this.size = particleSize;
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
				const color = getRgbaColor(x, y);
				// create particle for opaque pixels
				if (color.alpha > 128) {
					const positionX = x + (canvas.width / (particleSpread * 2)) - (dataSize.width / 2);
					const positionY = y + (canvas.height / (particleSpread * 2)) - (dataSize.height / 2);
					pixelArray.push(new Particle(
						positionX * particleSpread, positionY * particleSpread,
						color.rgba
					));
				}
			}
		}
		animateParticles();
	};

	// init
	if (isDesktopSize) {
		initParticles();
	}

	// animate particles
	function animateParticles() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		for (let particle of pixelArray) {
			particle.draw();
			particle.update();
		}
		animation = requestAnimationFrame(animateParticles);
	};

	function getRgbaColor(x, y) {
		const redIndex = y * (pixelData.width * 4) + x * 4;
		const red = pixelData.data[redIndex];
		const green = pixelData.data[redIndex + 1];
		const blue = pixelData.data[redIndex + 2];
		const alpha = pixelData.data[redIndex + 3];
		return {
			red, green, blue, alpha,
			rgba: `rgba(${red}, ${green}, ${blue}, ${alpha})`
		};
	};
}
