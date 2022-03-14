import mixitup from 'mixitup';

export default async () => {
    // add event listeners
    const filterControls = Array.from(document.querySelectorAll('.project-controls > *'));
    filterControls.forEach(control => {
        control.addEventListener('change', handleControlChange);
    })
    const mixer = mixitup('.project-grid', {
        selectors: {
            target: '.project-card'
        },
        animation: {
            animateResizeTargets: true
        }
    });
    function handleControlChange() {
        if (this.checked) {
            // uncheck other controls
            filterControls.forEach(control => {
                if (control !== this) {
                    control.checked = false;
                }
            });
            const lang = this.dataset.lang;
            if (lang == 'all') return mixer.show();
            else return mixer.filter(`.lang-${lang}`);
        }
    }
};