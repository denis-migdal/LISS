const root_style = document.documentElement.style;

const p = new URLSearchParams(location.search);

const IS_IN_OVERVIEW = p.has("overview");

if( IS_IN_OVERVIEW ) {
    document.body.style.setProperty('--overview', p.get("overview"));
    document.body.classList.add('overview');
}

/** need it (unitless) **/
window.addEventListener('resize', () => {
    root_style.setProperty('--screen_width', `${document.documentElement.clientWidth}`);
});

root_style.setProperty('--screen_width', `${document.documentElement.clientWidth}`);
//root_style.setProperty('--main-width', window.getComputedStyle( document.querySelector('main')! ).width.slice(0,-2) );

// force module recognition to avoid "Cannot redeclare block-scoped variable" error.
export {}