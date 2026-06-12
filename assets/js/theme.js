(function() {
    'use strict';

    var STORAGE_KEY = 'mcdtc-theme';
    var toggle = document.getElementById('themeToggle');
    var icon = toggle ? toggle.querySelector('i') : null;

    function getStored() {
        try { return localStorage.getItem(STORAGE_KEY); } catch(e) { return null; }
    }

    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        if (icon) {
            icon.className = theme === 'dark' ? 'fa fa-sun-o' : 'fa fa-moon-o';
        }
        try { localStorage.setItem(STORAGE_KEY, theme); } catch(e) {}
    }

    var stored = getStored();
    if (stored === 'dark' || stored === 'light') {
        setTheme(stored);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setTheme('dark');
    }

    if (toggle) {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            var current = document.documentElement.getAttribute('data-theme');
            setTheme(current === 'dark' ? 'light' : 'dark');
        });
    }
})();
