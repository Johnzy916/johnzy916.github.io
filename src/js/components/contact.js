import { spriteAnimations } from "../models/sprite";
import alienImageSrc from '../../img/sprites/alien-sprite.png';
import alienReversedImageSrc from '../../img/sprites/alien-sprite_reversed.png';
import floorImageSrc from '../../img/sprites/floor.png';
import emailjs from "@emailjs/browser";

export default () => {
    const contactFlexbox = document.querySelector('.contact-flexbox');
    const canvas2 = document.getElementById('contact-canvas');
    const ctx2 = canvas2.getContext('2d');
    let animation, canvasBox;

    let canvasWidth = canvas2.width = contactFlexbox.offsetWidth / 2.2;
    let canvasHeight = canvas2.height = contactFlexbox.offsetHeight;
    canvasBox = canvas2.getBoundingClientRect();
    console.log('canvasBox: ', canvasBox)

    // track mouse
    const mouse = {
        x: null,
        y: null
    };

    addEventListener('mousemove', (e) => {
		mouse.x = e.clientX;
		mouse.y = e.clientY;
	});

    const restartCanvas = () => {
        cancelAnimationFrame(animation);
        canvasWidth = canvas2.width = contactFlexbox.offsetWidth / 2;
        canvasBox = canvas2.getBoundingClientRect();
        animate();
    }

    // resize event
    addEventListener('resize', restartCanvas);
    // start animation on load
    addEventListener('load', restartCanvas);
    // fix for hitbox issue
    addEventListener('scroll', restartCanvas);

    // create images
    const alienImage = new Image();
    alienImage.src = alienImageSrc;
    const alienReversedImage = new Image();
    alienReversedImage.src = alienReversedImageSrc;
    const floorImage = new Image();
    floorImage.src = floorImageSrc;

    // simple state
    let currentState = 'run';
    let gameFrame = 0;
    let staggerFrames = 8;
    let actionFrame = 0;
    let active = false;
    let isHit = false;
    let hitCount = 0;
    let isDead = false;
    let floorX = 0;
    let moveSpeed = 15;

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
        let floorVertical = canvasHeight - (height + 40);
        // get distance to mouse
        const dx = mouse.x - (canvasBox.left + (canvasBox.width / 2));
        const dy = mouse.y - (canvasBox.top + (canvasBox.height / 2));
        const distance = Math.hypot(dx, dy) - (width / 2);

        // get sprite direction and image
        const isLeftOfImage = mouse.x < canvasBox.left + (canvasBox.width / 2);
        const currentImage = isLeftOfImage ? alienReversedImage : alienImage;

        // hitbox
        let box = {
            top: canvasBox.top + floorVertical,
            bottom: canvasBox.top + floorVertical + height,
            left: canvasBox.left + centerHorizontal,
            right: canvasBox.left + centerHorizontal + width
        };

        // if active (hurt or dead)
        // finish current action
        if (active) {
            if (actionFrame < (spriteLocations.length * staggerFrames)) {
                currentState = isDead ? 'dead' : 'hurt';
                actionFrame++;
            } else {
                actionFrame = 0;
                active = false;
            }
        // else handle normally
        } else {
            
            if (mouse.x > box.left &&
                mouse.x < box.right &&
                mouse.y < box.bottom &&
                mouse.y > box.top) {
                    moveSpeed = 0;
                    currentState = 'idle';
            } else {
                // respond to mouse distance
                if (distance < 300) {
                    moveSpeed = 7;
                    currentState = 'walk';
                } else {
                    moveSpeed = 15;
                    currentState = 'run';
                }
            }

            if (isLeftOfImage) {
                if (floorX > 0) floorX = -2400;
                floorX = Math.floor(floorX + moveSpeed);
            } else {
                if (floorX < -2400) floorX = 0;
                floorX = Math.floor(floorX - moveSpeed);
            }
        }

        // draw animation
        ctx2.drawImage(currentImage, x, y, width, height, centerHorizontal, floorVertical, width, height);
        ctx2.drawImage(floorImage, floorX, canvasHeight - 640);
        ctx2.drawImage(floorImage, floorX + 2400, canvasHeight - 640);

        // progress animation
        gameFrame++;        
        animation = requestAnimationFrame(animate)
    };

     // send contact email
     ///////////////////////////////////////
     document.querySelector('#contact-form').addEventListener('submit', (e) => {
        e.preventDefault();
        let name = e.target.elements.name.value;
        let email = e.target.elements.email.value;
        let message = e.target.elements.message.value;
        const sendButton = document.querySelector('.contact-button');
        const templateParams = { name, email, message };

        // change button while processing
        sendButton.textContent = 'Sending...';

        // send email
        emailjs.send(
            'default_service',
            'angus_dev_contact',
            templateParams,
            'KpqjNCJx_DYZFKpk0'
        ).then(response => {
            sendButton.textContent = 'SUCCESS!';
            sendButton.classList.add('button-success');
            console.log('MESSAGE SENT! ', response.status, response.text);
            setTimeout(() => {
                sendButton.classList.remove('button-success');
                sendButton.textContent = 'Send Message';
            }, 3000);
        }, error => {
            sendButton.textContent = 'FAILED...';
            sendButton.classList.add('button-fail');
            console.log('MESSAGE FAILED... ', error);
            setTimeout(() => {
                sendButton.textContent = 'Send Message';
                sendButton.classList.remove('button-fail');
            }, 3000);
        });

        // empty values
        e.target.elements.name.value = '';
        e.target.elements.email.value = '';
        e.target.elements.message.value = '';
    });
}