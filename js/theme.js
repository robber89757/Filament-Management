const ThemeManager = {
    THEME_KEY: 'appTheme',
    LIGHT_THEME: 'light',
    DARK_THEME: 'dark',

    init() {
        const savedTheme = localStorage.getItem(this.THEME_KEY) || this.LIGHT_THEME;
        this.setTheme(savedTheme);
    },

    setTheme(theme) {
        localStorage.setItem(this.THEME_KEY, theme);
        document.documentElement.setAttribute('data-theme', theme);
        this.updateToggleButton(theme);
    },

    toggleTheme() {
        const currentTheme = localStorage.getItem(this.THEME_KEY) || this.LIGHT_THEME;
        const newTheme = currentTheme === this.LIGHT_THEME ? this.DARK_THEME : this.LIGHT_THEME;
        this.setTheme(newTheme);
    },

    getCurrentTheme() {
        return localStorage.getItem(this.THEME_KEY) || this.LIGHT_THEME;
    },

    updateToggleButton(theme) {
        const toggleBtns = document.querySelectorAll('.theme-toggle-btn');
        toggleBtns.forEach(btn => {
            if (theme === this.DARK_THEME) {
                btn.innerHTML = '<i class="fa fa-sun-o mr-2"></i>浅色模式';
                btn.classList.remove('bg-gray-200', 'text-gray-700');
                btn.classList.add('bg-yellow-500', 'text-white');
            } else {
                btn.innerHTML = '<i class="fa fa-moon-o mr-2"></i>深色模式';
                btn.classList.remove('bg-yellow-500', 'text-white');
                btn.classList.add('bg-gray-200', 'text-gray-700');
            }
        });
    },

    applyThemeStyles(theme) {
        if (theme === this.DARK_THEME) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }
};

function initThemeToggle() {
    ThemeManager.init();

    const toggleBtns = document.querySelectorAll('.theme-toggle-btn');
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            ThemeManager.toggleTheme();
        });
    });

    const currentTheme = ThemeManager.getCurrentTheme();
    ThemeManager.updateToggleButton(currentTheme);
    ThemeManager.applyThemeStyles(currentTheme);
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', function() {
        initThemeToggle();
    });
}
