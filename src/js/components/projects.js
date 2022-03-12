import mixitup from 'mixitup';

export default async () => {
    const mixer = mixitup('.project-grid', {
        selectors: {
            target: '.project-card'
        }
    });
};