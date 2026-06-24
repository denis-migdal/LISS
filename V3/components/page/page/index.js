const root_style = document.documentElement.style;
const p = new URLSearchParams(location.search);
const IS_IN_OVERVIEW = p.has("overview");
if (IS_IN_OVERVIEW) {
    document.body.style.setProperty('--overview', p.get("overview"));
    document.body.classList.add('overview');
}
/** need it (unitless) **/
window.addEventListener('resize', () => {
    root_style.setProperty('--screen_width', `${document.documentElement.clientWidth}`);
});
root_style.setProperty('--screen_width', `${document.documentElement.clientWidth}`);
export {};
//# sourceMappingURL=index.js.map