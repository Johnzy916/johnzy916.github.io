export default () => {
    const copyrightSpan = document.querySelector('#copyright span');
    copyrightSpan.textContent = new Date().getFullYear();
}