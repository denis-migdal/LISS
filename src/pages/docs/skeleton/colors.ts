const root = document.documentElement;
root.classList.add('dark-mode');

const btn = document.createElement('span');
btn.classList.add('color-scheme-gui-btn');

btn.addEventListener('click', () => {
    root.classList.toggle('dark-mode');
    root.classList.toggle('light-mode');
});

document.body.append(btn);