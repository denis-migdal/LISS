const root_style = document.documentElement.style;

window.addEventListener('resize', () => {
    root_style.setProperty('--screen_width', `${window.innerWidth}`);
});

root_style.setProperty('--screen_width', `${window.innerWidth}`);
root_style.setProperty('--main-width', window.getComputedStyle( document.querySelector('main')! ).width.slice(0,-2) );

// force module recognition to avoid "Cannot redeclare block-scoped variable" error.
export {}