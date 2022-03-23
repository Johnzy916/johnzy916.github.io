import { spriteAnimations } from "../models/sprite";
import alienImageSrc from '../../img/sprites/alien-sprite.png';

export default () => {
    const contactFlexbox = document.querySelector('.contact-flexbox');
    const contactForm = document.querySelector('.contact-form');
    const canvas2 = document.getElementById('contact-canvas');
    const ctx2 = canvas2.getContext('2d');

    const canvasWidth = canvas2.width = contactFlexbox.offsetWidth / 2;
    const canvasHeight = canvas2.height = contactForm.offsetHeight * 1.5;

    const alienImage = new Image();
    alienImage.src =alienImageSrc;

    let currentState = 'idle';
    let currentFrame = 0;
    let gameFrame = 0;
    const staggerFrames = 7;

    function animate() {
        ctx2.clearRect(0, 0, canvasWidth, canvasHeight);

        let spriteLocations = spriteAnimations[currentState].loc;
        let currentSprite = spriteLocations[currentFrame];
        let { width, height, x, y } = currentSprite;
        let centerHorizontal = (canvasWidth / 2) - (width / 2);
        let floorVertical = canvasHeight - (height + 10);

        ctx2.drawImage(alienImage, x, y, width, height, centerHorizontal, floorVertical, width, height);
        if (gameFrame % staggerFrames == 0) {
            if (currentFrame < spriteLocations.length - 1) currentFrame++;
            else currentFrame = 0;
        }

        gameFrame++;        
        requestAnimationFrame(animate)
    }
    animate()
}