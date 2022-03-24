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

    // track mouse
    const mouse = {
        x: null,
        y: null
    };

    addEventListener('mousemove', (e) => {
		mouse.x = e.clientX;
		mouse.y = e.clientY;
	});

    // create images
    const alienImage = new Image();
    alienImage.src = alienImageSrc;
    const alienReversedImage = new Image();
    alienReversedImage.src = alienReversedImageSrc;

    // simple state
    let currentState = 'run';
    let gameFrame = 0;
    let staggerFrames = 8;
    let actionFrame = 0;
    let active = false;
    let isHit = false;
    let hitCount = 0;
    let isDead = false;

    canvas2.addEventListener('click', () => {
        active = true;
        if (hitCount < 1) {
            isDead = false;
            isHit = true;
            hitCount++;
        } else {
            isDead = true;
            hitCount = 0;
        }
    });

    function animate() {
        ctx2.clearRect(0, 0, canvasWidth, canvasHeight);
        // sprite location
        let spriteLocations = spriteAnimations[currentState].loc;
        // slow animation, loop through length
        let currentFrame = Math.floor(gameFrame/staggerFrames) % spriteLocations.length;
        // get sprite data
        let currentSprite = spriteLocations[currentFrame];
        let { width, height, x, y } = currentSprite;
        // center sprite in canvas
        let centerHorizontal = (canvasWidth / 2) - (width / 2);
        let centerVertical = (canvasHeight / 2) - (height / 2);

        // hitbox
        let box = {
            top: canvasBox.top + centerVertical,
            bottom: canvasBox.top + centerVertical + height,
            left: canvasBox.left + centerHorizontal,
            right: canvasBox.left + centerHorizontal + width
        };
        // ctx2.strokeRect(centerHorizontal, centerVertical, width, height);

        // get distance to mouse
        const dx = mouse.x - (canvasBox.left + (canvasBox.width / 2));
        const dy = mouse.y - (canvasBox.top + (canvasBox.height / 2));
        const distance = Math.hypot(dx, dy) - (width / 2);

        // finish current action
        if (active) {
            if (actionFrame < (spriteLocations.length * staggerFrames)) {
                currentState = isDead ? 'dead' : 'hurt';
                actionFrame++;
            } else {
                actionFrame = 0;
                active = false;
            }
        // else return to normal
        } else {
            // inside hitbox
            if (mouse.x > box.left &&
                mouse.x < box.right &&
                mouse.y < box.bottom &&
                mouse.y > box.top) {
                    currentState = 'idle';
            } else {
                // respond to mouse distance
                if (distance < 200) currentState = 'walk';
                else currentState = 'run';
            }
        }

        // change sprite direction
        const isLeftOfImage = mouse.x < canvasBox.left + (canvasBox.width / 2);
        const currentImage = isLeftOfImage ? alienReversedImage : alienImage;
        ctx2.drawImage(currentImage, x, y, width, height, centerHorizontal, centerVertical, width, height);

        // progress animation
        gameFrame++;        
        requestAnimationFrame(animate)
    }
    animate()
}