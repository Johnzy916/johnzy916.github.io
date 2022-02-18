import initHeroComponent from './components/hero.js';

// Mouse tracking
//////////////////////////
const mouse = {
    x: null,
    y: null,
    radius: 150
}
// get mouse coords
document.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
});

// Hero
/////////////////////////
initHeroComponent();