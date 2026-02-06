const root = document.documentElement;
root.classList.add( localStorage.getItem("LISS.color-scheme") ?? 'dark-mode');

const btn = document.createElement('span');
btn.classList.add('color-scheme-gui-btn');

btn.addEventListener('click', () => {
    const isDark = root.classList.toggle('dark-mode');
    root.classList.toggle('light-mode');

    localStorage.setItem("LISS.color-scheme", isDark ? 'dark-mode' : 'light-mode');
});

document.body.append(btn);

// force module recognition to avoid "Cannot redeclare block-scoped variable" error.
export {}