export default () => {
	const canvas = document.querySelector('#canvas-hero');
	const ctx = canvas.getContext('2d');
	// set size to window
	canvas.width = window.innerWidth;
	canvas.height = window. innerHeight;
	// create particle array
	let pArray = [];

	// draw text
	ctx.fillStyle = 'white';
	ctx.font = '30px Verdana';
	ctx.fillText('Web', 0, 40);
	// get image data
	const pixelData = ctx.getImageData(0, 0, 100, 100);

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
			ctx.fillStyle = 'white';
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
				if (pixelData.data[(y * 4 * data.width) + (x * 4) + 3] > 128) {
					const positionX = x;
					const positionY = y;
					pixelArray.push(new Particle(x, y))
				}
			}
		}
	};
	initParticles();

	// animate particles
	const animateParticles = () => {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		for (particle of pArray) {
			particle.draw();
			particle.update();
		}
		requestAnimationFrame(animateParticles);
	};
	animateParticles();
}
