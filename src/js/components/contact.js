import { spriteAnimations } from "../models/sprite";
import alienImageSrc from '../../img/sprites/alien-sprite.png';
import alienReversedImageSrc from '../../img/sprites/alien-sprite_reversed.png';

export default () => {
    const contactFlexbox = document.querySelector('.contact-flexbox');
    const contactForm = document.querySelector('.contact-form');
    const canvas2 = document.getElementById('contact-canvas');
    const ctx2 = canvas2.getContext('2d');

    const canvasWidth = canvas2.width = contactFlexbox.offsetWidth / 2;
    const canvasHeight = canvas2.height = contactForm.offsetHeight * 1.5;

    const canvasBox = canvas2.getBoundingClientRect();

    const mouse = {
        x: null,
        y: null
    };

    addEventListener('mousemove', (e) => {
		mouse.x = e.clientX;
		mouse.y = e.clientY;
	});

    const alienImage = new Image();
    alienImage.src = alienImageSrc;
    const alienReversedImage = new Image();
    alienReversedImage.src = alienReversedImageSrc;

    let currentState = 'run';
    let previousState = null;
    let gameFrame = 0;
    const staggerFrames = 8;

    function animate() {
        ctx2.clearRect(0, 0, canvasWidth, canvasHeight);
        // sprite location
        let spriteLocations = spriteAnimations[currentState].loc;
        let currentFrame = Math.floor(gameFrame/staggerFrames) % spriteLocations.length;
        let currentSprite = spriteLocations[currentFrame];
        let { width, height, x, y } = currentSprite;
        let centerHorizontal = (canvasWidth / 2) - (width / 2);
        let floorVertical = canvasHeight - (height + 10);

        // get distance
        const dx = mouse.x - (canvasBox.left + (canvasBox.width / 2));
        const dy = mouse.y - (canvasBox.top + (canvasBox.height / 2));
        const distance = Math.hypot(dx, dy);

        // change direction
        const isLeftOfImage = mouse.x < canvasBox.left + (canvasBox.width / 2);
        const currentImage = isLeftOfImage ? alienReversedImage : alienImage;
        ctx2.drawImage(currentImage, x, y, width, height, centerHorizontal, floorVertical, width, height);

        // update sprite
        if (distance < 200) currentState = 'idle';
        else if (distance < 400) currentState = 'walk';
        else currentState = 'run';

        // progress animation
        gameFrame++;        
        requestAnimationFrame(animate)
    }
    animate()
}