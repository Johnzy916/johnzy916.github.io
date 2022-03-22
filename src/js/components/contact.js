import { spriteAnimations } from "../models/sprite";
import alienImageSrc from '../../img/sprites/alien-sprite.png';

export default () => {
    const contactFlexbox = document.querySelector('.contact-flexbox');
    const contactForm = document.querySelector('.contact-form');
    const canvas2 = document.getElementById('contact-canvas');
    const ctx2 = canvas2.getContext('2d');

    const canvasWidth = canvas2.width = contactFlexbox.offsetWidth / 2;
    const canvasHeight = canvas2.height = contactForm.offsetHeight;

    const alienImage = new Image();
    alienImage.src = alienImageSrc;

    const spriteWidth = spriteAnimations['idle'].loc[0].width;
    const spriteHeight = spriteAnimations['idle'].loc[0].height;
    const spriteX = spriteAnimations['idle'].loc[0].x;
    const spriteY = spriteAnimations['idle'].loc[0].y;

    function animate() {
        ctx2.clearRect(0, 0, canvasWidth, canvasHeight);
        // ctx2.fillText('before', 50, 50)
        ctx2.drawImage(alienImage, spriteX, spriteY, spriteWidth, spriteHeight, 50, 50, spriteWidth, spriteHeight);
    }
    animate()
}